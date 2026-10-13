import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const metadata = { title: "Settings — TalentSync AI" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:space-y-8 sm:py-8">
      <SettingsClient />
    </div>
  );
}