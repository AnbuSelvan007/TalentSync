import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI missing");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export async function connectDB() {
  console.log("MongoURL:", MONGODB_URI);
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          const conn = await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            heartbeatFrequencyMS: 10000,
          });
          return conn;
        } catch (error) {
          if (attempt === MAX_RETRIES) {
            throw error;
          }
          console.warn(
            `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed. Retrying in ${RETRY_DELAY_MS}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
        }
      }
      throw new Error("Failed to connect to MongoDB after all retries");
    })();
  }

  cached.conn = await cached.promise;

  return cached.conn;
}