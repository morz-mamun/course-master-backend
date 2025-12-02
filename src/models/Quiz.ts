import mongoose, { Schema, type Document } from "mongoose";

export interface IQuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  questionText: string;
  options: IQuestionOption[];
  explanation: string;
}

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  questions: IQuestion[];
  passingScore: number;
  attempts: {
    studentId: mongoose.Types.ObjectId;
    answers: number[]; // index of selected option per question
    score: number;
    attemptedAt: Date;
    timeTaken: number; // in seconds
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const questionOptionSchema = new Schema<IQuestionOption>(
  {
    text: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false },
);

const questionSchema = new Schema<IQuestion>(
  {
    questionText: {
      type: String,
      required: true,
    },
    options: [questionOptionSchema],
    explanation: String,
  },
  { _id: false },
);

const quizSchema = new Schema<IQuiz>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Quiz title is required"],
    },
    description: String,
    questions: [questionSchema],
    passingScore: {
      type: Number,
      required: true,
      default: 70,
    },
    attempts: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        answers: [Number],
        score: Number,
        attemptedAt: {
          type: Date,
          default: Date.now,
        },
        timeTaken: Number,
        _id: false,
      },
    ],
  },
  { timestamps: true },
);

quizSchema.index({ courseId: 1 });

export default mongoose.model<IQuiz>("Quiz", quizSchema);
