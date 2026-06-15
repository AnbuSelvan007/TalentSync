import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
async function testConnection() {
  try {
    console.log("Connecting to MongoDB...:", MONGODB_URI);

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully!");
    console.log("Database:", mongoose.connection.name);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection Failed:");
    console.error(error);

    process.exit(1);
  }
}

testConnection();