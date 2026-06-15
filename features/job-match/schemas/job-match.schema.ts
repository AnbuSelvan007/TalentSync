import { z } from "zod";

export const jobMatchInputSchema = z.object({
  resumeText: z.string().min(10, "Resume text must be at least 10 characters"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
});