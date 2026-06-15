import mongoose, { Schema, model, models } from "mongoose";

export interface IInterview {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  role: string;
  difficulty: string;
  questions: string[];
  answers: string[];
  evaluations: Record<string, unknown>[];
  finalScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      default: "medium",
    },
    questions: {
      type: [String],
      default: [],
    },
    answers: {
      type: [String],
      default: [],
    },
    evaluations: {
      type: [{ type: Schema.Types.Mixed }],
      default: [],
    },
    finalScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Interview =
  models.Interview || model<IInterview>("Interview", InterviewSchema);

export default Interview;