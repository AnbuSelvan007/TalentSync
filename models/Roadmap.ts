import mongoose, { Schema, model, models } from "mongoose";

export interface IRoadmap {
  _id?: string;
  userId: mongoose.Types.ObjectId;
  goal: string;
  timeline: string;
  roadmap: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    goal: {
      type: String,
      required: true,
    },
    timeline: {
      type: String,
      required: true,
    },
    roadmap: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Roadmap = models.Roadmap || model<IRoadmap>("Roadmap", RoadmapSchema);

export default Roadmap;