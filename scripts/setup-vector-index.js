/**
 * MongoDB Atlas Vector Search Index Setup Script
 *
 * This script creates the required vector search index on the Memory collection
 * for the RAG pipeline to use $vectorSearch instead of brute-force in-memory search.
 *
 * Prerequisites:
 * - MongoDB Atlas cluster (M10+ tier for vector search)
 * - mongosh or MongoDB Compass connected to your Atlas cluster
 *
 * How to run:
 *   mongosh "$MONGODB_URI" --file scripts/setup-vector-index.js
 *
 * Or in MongoDB Compass:
 *   1. Connect to your Atlas cluster
 *   2. Go to the talentsync database
 *   3. Go to the memories collection
 *   4. Click on "Search Indexes" tab
 *   5. Click "Create Search Index"
 *   6. Use the JSON definition below
 */

const vectorIndexDefinition = {
  name: "vector_index",
  type: "vectorSearch",
  definition: {
    fields: [
      {
        type: "vector",
        path: "embedding",
        numDimensions: 768,
        similarity: "cosine",
      },
      {
        type: "filter",
        path: "userId",
      },
    ],
  },
};

print("=== MongoDB Atlas Vector Search Index Setup ===");
print("Database: talentsync");
print("Collection: memories");
print("Index Name: vector_index");
print("");
print("To create this index, run the following command in mongosh:");
print("");
print(`  db.memories.createSearchIndex(${JSON.stringify(vectorIndexDefinition, null, 2)});`);
print("");
print("Or in MongoDB Compass:");
print("  1. Navigate to talentsync > memories > Search Indexes");
print("  2. Click 'Create Search Index'");
print("  3. Select 'Atlas Vector Search' as the index type");
print("  4. Use the JSON definition above");
print("  5. Click 'Create Index'");
print("");
print("After the index is created, the RAG pipeline will automatically");
print("use $vectorSearch instead of the in-memory fallback.");
print("");

// If running via mongosh, attempt to create the index
if (typeof db !== "undefined") {
  const dbName = "talentsync";
  const dbInstance = db.getSiblingDB(dbName);
  const collectionName = "memories";

  // Check if collection exists
  const collections = dbInstance.getCollectionNames();
  if (!collections.includes(collectionName)) {
    print(`Collection '${collectionName}' does not exist yet.`);
    print("Please run the application first to create the collection, then run this script again.");
    quit(0);
  }

  try {
    const result = dbInstance.collection(collectionName).createSearchIndex(vectorIndexDefinition);
    print(`✓ Vector search index '${result}' created successfully!`);
  } catch (error) {
    print(`✗ Failed to create index: ${error.message}`);
    print("");
    print("If the index already exists, you can update it with:");
    print(`  db.memories.updateSearchIndex("vector_index", ${JSON.stringify(vectorIndexDefinition.definition, null, 2)});`);
  }
}