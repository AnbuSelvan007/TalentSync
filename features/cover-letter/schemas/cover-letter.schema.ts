import { z } from "zod";

export const applicantInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company name is required"),
  experience: z.string().min(1, "Years of experience is required"),
});

export const coverLetterInputSchema = z.object({
  applicant: applicantInfoSchema,
  resumeText: z.string().min(10, "Resume text must be at least 10 characters"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
});