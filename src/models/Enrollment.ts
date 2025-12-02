import mongoose, { Schema, type Document } from "mongoose";

export interface IEnrollment extends Document {
  courseId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  batchId: string;
  enrolledAt: Date;
  completedAt?: Date;
  status: "active" | "completed" | "dropped";
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batchId: {
      type: String,
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Compound index to prevent duplicate enrollments
enrollmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);
