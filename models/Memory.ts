import mongoose, { Schema, model, models } from "mongoose";

export interface IMemory {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  content: string;
  embedding: number[];
  type: "chat_memory" | "resume_insight" | "interview_feedback" | "roadmap_goal" | "career_preference";
  metadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

const MemorySchema = new Schema<IMemory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    content: {
      type: String,
      required: [true, "content is required"],
    },
    embedding: {
      type: [Number],
      required: true,
    },
    type: {
      type: String,
      enum: ["chat_memory", "resume_insight", "interview_feedback", "roadmap_goal", "career_preference"],
      default: "chat_memory",
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

MemorySchema.index({ userId: 1, type: 1 });

const Memory = models.Memory || model<IMemory>("Memory", MemorySchema);

export default Memory;