import mongoose from "mongoose"
import config from "."

const MONGO_URI = config?.database_url

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export default mongoose
