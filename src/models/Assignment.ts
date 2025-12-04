import mongoose, { Schema, type Document } from "mongoose";

/**
 * Assignment document interface
 */
export interface IAssignment extends Document {
  courseId: mongoose.Types.ObjectId;
  lessonId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  submissions: {
    _id: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    submissionText?: string;
    submissionLink?: string;
    submittedAt: Date;
    score?: number;
    feedback?: string;
    gradedAt?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lessonId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Assignment title is required"],
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
      default: 100,
    },
    submissions: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        submissionText: String,
        submissionLink: String,
        submittedAt: {
          type: Date,
          default: Date.now,
        },
        score: Number,
        feedback: String,
        gradedAt: Date,
      },
    ],
  },
  { timestamps: true },
);

assignmentSchema.index({ courseId: 1 });

export default mongoose.model<IAssignment>("Assignment", assignmentSchema);
