import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_DB_URL;

if (!MONGO_URL) {
  throw new Error("MONGO_DB_URL is not defined in environment variables");
}

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    }).then((m) => {
      console.log("MongoDB connected");
      return m;
    }).catch((err) => {
      cached.promise = null;
      console.error("MongoDB connection error:", err);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}