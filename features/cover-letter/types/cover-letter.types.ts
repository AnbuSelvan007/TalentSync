export interface ApplicantInfo {
  fullName: string;
  role: string;
  company: string;
  experience: string;
}

export interface CoverLetterInput {
  applicant: ApplicantInfo;
  resumeText: string;
  jobDescription: string;
}

export type CoverLetterPhase = "form" | "generating" | "result" | "error";