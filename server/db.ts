import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  if (!MONGODB_URI) {
    console.warn("MONGODB_URI environment variable is not defined - running without database");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("Continuing without database connection...");
  }
}

export default mongoose;
