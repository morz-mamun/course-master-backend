import mongoose, { Schema, type Document } from "mongoose";

export interface IProgress extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonsCompleted: number;
  totalLessons: number;
  percentage: number;
  completedLessonIds: string[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    lessonsCompleted: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    completedLessonIds: [String],
    completedAt: Date,
  },
  { timestamps: true },
);

// Compound index to prevent duplicates and enable efficient queries
progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
progressSchema.index({ courseId: 1, percentage: 1 });

export default mongoose.model<IProgress>("Progress", progressSchema);
