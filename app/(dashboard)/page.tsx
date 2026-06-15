import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db/connection";
import Chat from "@/models/Chat";
import ResumeAnalysisModel from "@/models/ResumeAnalysis";
import InterviewModel from "@/models/Interview";
import RoadmapModel from "@/models/Roadmap";
import CoverLetterModel from "@/models/CoverLetter";
import DashboardClient from "./DashboardClient";

export const metadata = { title: "Dashboard — TalentSync AI" };

async function getDashboardStats(userId: string) {
  await connectDB();
  const [totalChats, totalResumes, totalInterviews, totalRoadmaps, totalCoverLetters] =
    await Promise.all([
      Chat.countDocuments({ userId }),
      ResumeAnalysisModel.countDocuments({ userId }),
      InterviewModel.countDocuments({ userId }),
      RoadmapModel.countDocuments({ userId }),
      CoverLetterModel.countDocuments({ userId }),
    ]);

  const recentActivity: { type: string; label: string; timestamp: Date }[] = [];

  const [recentResumes, recentInterviews, recentRoadmaps] = await Promise.all([
    ResumeAnalysisModel.find({ userId }).sort({ createdAt: -1 }).limit(3).lean(),
    InterviewModel.find({ userId }).sort({ createdAt: -1 }).limit(3).lean(),
    RoadmapModel.find({ userId }).sort({ createdAt: -1 }).limit(3).lean(),
  ]);

  recentResumes.forEach((r) =>
    recentActivity.push({ type: "resume", label: `Resume reviewed — ${r.fileName}`, timestamp: r.createdAt as Date })
  );
  recentInterviews.forEach((i) =>
    recentActivity.push({ type: "interview", label: `Mock interview — ${i.role}`, timestamp: i.createdAt as Date })
  );
  recentRoadmaps.forEach((r) =>
    recentActivity.push({ type: "roadmap", label: `Roadmap — ${r.goal}`, timestamp: r.createdAt as Date })
  );

  recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    totalChats,
    totalResumes,
    totalInterviews,
    totalRoadmaps,
    totalCoverLetters,
    recentActivity: recentActivity.slice(0, 5),
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const stats = await getDashboardStats(session.user.id);

  return <DashboardClient stats={stats} userName={session.user.name || "User"} />;
}