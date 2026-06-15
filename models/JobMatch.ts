import mongoose, { Schema, model, models } from "mongoose";

export interface IJobMatch {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  jobTitle: string;
  company: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  keywordAnalysis?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

const JobMatchSchema = new Schema<IJobMatch>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    matchingSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    keywordAnalysis: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const JobMatch = models.JobMatch || model<IJobMatch>("JobMatch", JobMatchSchema);

export default JobMatch;