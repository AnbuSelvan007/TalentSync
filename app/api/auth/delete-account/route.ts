import { NextResponse } from "next/server";
import { getCurrentUserId, unauthorized } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connection";
import User from "@/models/User";

export async function DELETE() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    await connectDB();
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}