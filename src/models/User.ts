import mongoose, { Schema, type Document } from "mongoose";

/**
 * User document interface
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  enrolledCourses: mongoose.Types.ObjectId[];
  progress: {
    courseId: mongoose.Types.ObjectId;
    lessonsCompleted: number;
    totalLessons: number;
    percentage: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    progress: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        lessonsCompleted: {
          type: Number,
          default: 0,
        },
        totalLessons: {
          type: Number,
          default: 0,
        },
        percentage: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true },
);

// Indexes for performance
userSchema.index({ role: 1 });

export default mongoose.model<IUser>("User", userSchema);
