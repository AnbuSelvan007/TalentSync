import mongoose, { Schema, model, models } from "mongoose";

export interface ICoverLetter {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  applicantName: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    applicantName: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const CoverLetter =
  models.CoverLetter ||
  model<ICoverLetter>("CoverLetter", CoverLetterSchema);

export default CoverLetter;