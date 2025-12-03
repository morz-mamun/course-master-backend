import mongoose from "mongoose";
import config from ".";

/**
 * Establishes connection to MongoDB database
 * @returns Promise that resolves when connection is established
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = config?.database_url;
    if (!mongoUri) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");

    // Create indexes
    mongoose.connection.on("open", async () => {
      console.log("Creating database indexes...");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
