"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connection";
import User from "@/models/User";
import type { RegisterInput } from "@/features/auth/schemas/auth.schemas";

export async function registerUser(data: RegisterInput) {
  // Inline validation for zod v4
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 2) errors.push("Name must be at least 2 characters");
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("Please enter a valid email address");
  if (!data.password || data.password.length < 6) errors.push("Password must be at least 6 characters");
  if (!/[A-Za-z]/.test(data.password)) errors.push("Password must contain at least one letter");
  if (!/[0-9]/.test(data.password)) errors.push("Password must contain at least one number");
  if (data.password !== data.confirmPassword) errors.push("Passwords do not match");

  if (errors.length > 0) {
    return {
      success: false as const,
      error: errors.join(", "),
    };
  }

  const { name, email, password } = data;

  try {
    console.log("Connecting to MongoDB for registration...");
    await connectDB();
    console.log("Connected to MongoDB for registration");

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return {
        success: false as const,
        error: "An account with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    console.log("User created successfully");

    return {
      success: true as const,
      message: "Account created successfully! Redirecting to login...",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false as const,
      error: "Something went wrong. Please try again.",
    };
  }
}