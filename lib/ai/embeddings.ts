import { ai } from "./gemini";
import { connectDB } from "@/lib/db/connection";
import Memory, { IMemory } from "@/models/Memory";
import mongoose from "mongoose";

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = Number(process.env.EMBEDDING_DIMENSIONS) || 768;
const STORAGE_SIMILARITY_THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD as string) || 0.85;
const SEARCH_SIMILARITY_THRESHOLD = 0.6; // Higher than old 0.3 to avoid noise
const SEARCH_TOP_K = 5;

type EmbeddingTaskType = "RETRIEVAL_QUERY" | "RETRIEVAL_DOCUMENT" | "SEMANTIC_SIMILARITY";

/**
 * Generate an embedding vector for the given text using Gemini Embeddings API.
 */
export async function generateEmbedding(
  text: string,
  taskType: EmbeddingTaskType = "RETRIEVAL_DOCUMENT"
): Promise<number[]> {
  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
        taskType,
      },
    });

    const embedding = response.embeddings?.[0]?.values;
    if (!embedding || embedding.length === 0) {
      throw new Error("No embedding returned from Gemini API");
    }

    return embedding;
  } catch (error) {
    console.error("[Embeddings] Failed to generate embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

/**
 * Check if content contains career-relevant information worth storing as a memory.
 * Filters out trivial/transient chat utterances.
 */
function isCareerRelevant(content: string): boolean {
  const lower = content.toLowerCase();
  const careerKeywords = [
    "skill", "experience", "project", "internship", "job", "career",
    "interview", "resume", "cv", "goal", "learning", "course",
    "certification", "technology", "programming", "framework",
    "role", "position", "company", "industry", "domain",
    "achievement", "award", "publication", "research",
    "education", "degree", "major", "specialization",
    "interested in", "want to learn", "working on",
    "developed", "built", "created", "designed", "led",
    "python", "java", "javascript", "react", "node", "sql",
    "machine learning", "data science", "web development",
    "cloud", "docker", "kubernetes", "aws", "azure", "gcp",
    "database", "api", "system design", "algorithm", "dsa",
    "leetcode", "hackerrank", "codeforces",
  ];
  return careerKeywords.some((keyword) => lower.includes(keyword));
}

/**
 * Store a memory with its embedding, scoped to the given userId.
 * Only stores messages that are career-relevant to avoid polluting memory.
 * Performs deduplication: if a semantically similar memory exists for the same user, it updates instead of creating a duplicate.
 */
export async function storeMemory(
  userId: string,
  content: string,
  type: IMemory["type"] = "chat_memory",
  metadata?: Record<string, unknown>
) {
  // Skip storing trivial/transient messages
  if (!isCareerRelevant(content)) {
    console.log(`[Memory] Skipped storing non-career-relevant message for user ${userId}`);
    return null;
  }

  await connectDB();

  const embedding = await generateEmbedding(content, "RETRIEVAL_DOCUMENT");
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check for similar existing memory (deduplication)
  const existingMemories = await Memory.find({ userId: userObjectId, type })
    .lean()
    .select("content embedding");

  for (const mem of existingMemories) {
    const similarity = cosineSimilarity(embedding, mem.embedding as number[]);
    if (similarity >= STORAGE_SIMILARITY_THRESHOLD) {
      // Update existing memory with new content
      const updated = await Memory.findByIdAndUpdate(
        mem._id,
        { content, embedding, metadata, updatedAt: new Date() },
        { new: true }
      );
      console.log(`[Memory] Updated existing memory ${mem._id} (similarity: ${similarity.toFixed(3)})`);
      return updated;
    }
  }

  // Create new memory
  const memory = await Memory.create({
    userId: userObjectId,
    content,
    embedding,
    type,
    metadata,
  });

  console.log(`[Memory] Created new memory ${memory._id} for user ${userId}`);
  return memory;
}

/**
 * Search for the top-k most relevant memories for a given user.
 * Uses MongoDB Atlas Vector Search ($vectorSearch) when available,
 * falls back to optimized in-memory cosine similarity.
 * CRITICAL: The query is ALWAYS scoped to the current userId to prevent data leakage.
 */
export async function searchRelevantMemories(
  userId: string,
  query: string,
  limit: number = SEARCH_TOP_K
) {
  await connectDB();

  const queryEmbedding = await generateEmbedding(query, "RETRIEVAL_QUERY");
  const userObjectId = new mongoose.Types.ObjectId(userId);

  try {
    // Try MongoDB Atlas $vectorSearch first (requires a vector search index named "vector_index" on Memory collection)
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: limit * 10, // Increased candidates for better recall
          limit,
          filter: {
            userId: userObjectId,
          },
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          type: 1,
          metadata: 1,
          createdAt: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const results = await Memory.aggregate(pipeline);
    if (results.length > 0) {
      return results.map((r) => ({ ...r, score: r.score ?? 0 }));
    }
  } catch (error) {
    // $vectorSearch index not configured — log warning and fall back to in-memory search
    console.warn("[Embeddings] $vectorSearch failed, falling back to in-memory search. Create a vector search index named 'vector_index' on the Memory collection to enable native vector search.", error);
  }

  // Fallback: optimized in-memory cosine similarity with bounded fetch
  // Uses lean + select to minimize data transfer, limits to a reasonable batch
  const memories = await Memory.find({ userId: userObjectId })
    .lean()
    .select("content type metadata createdAt embedding");

  const scored = memories
    .map((mem) => ({
      _id: mem._id,
      content: mem.content,
      type: mem.type,
      metadata: mem.metadata,
      createdAt: mem.createdAt,
      score: cosineSimilarity(queryEmbedding, mem.embedding as number[]),
    }))
    .filter((mem) => mem.score >= SEARCH_SIMILARITY_THRESHOLD) // Higher threshold = less noise
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}

/**
 * Compute cosine similarity between two vectors.
 * Optimized with early exit on zero norm.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    console.warn(`[CosineSimilarity] Vector length mismatch: ${a.length} vs ${b.length}`);
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}