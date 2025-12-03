import mongoose, { Schema, type Document } from "mongoose";

// Lesson interface
/**
 * Lesson interface for course syllabus
 */
export interface ILesson {
  lessonId: string;
  title: string;
  duration: number; // in minutes
  videoUrl: string;
  description: string;
}

// Batch interface
/**
 * Batch interface for course enrollment periods
 */
export interface IBatch {
  batchId: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  enrolledCount: number;
}

// Course interface
/**
 * Course document interface
 */
export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  price: number;
  category: string;
  tags: string[];
  syllabus: ILesson[];
  batches: IBatch[];
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Lesson schema
const lessonSchema = new Schema<ILesson>(
  {
    lessonId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Lesson title is required"],
    },
    duration: {
      type: Number,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

// Batch schema
const batchSchema = new Schema<IBatch>(
  {
    batchId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    enrolledCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

// Course schema
const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true,
    },
    tags: [String],
    syllabus: [lessonSchema],
    batches: [batchSchema],
    enrollmentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// Text index for full-text search
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1, price: 1 });

export default mongoose.model<ICourse>("Course", courseSchema);
