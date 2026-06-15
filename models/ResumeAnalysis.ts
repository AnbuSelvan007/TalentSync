import mongoose, { Schema, model, models } from "mongoose";

export interface IResumeAnalysis {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  fileName: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
  atsScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ResumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    atsScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis =
  models.ResumeAnalysis ||
  model<IResumeAnalysis>("ResumeAnalysis", ResumeAnalysisSchema);

export default ResumeAnalysis;