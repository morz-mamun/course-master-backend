/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { studentService } from "../services/student.service";
import {
  enrollmentSchema,
  progressSchema,
  assignmentSubmissionSchema,
  quizSubmissionSchema,
} from "../utils/validation";
import { AppError } from "../middleware/error-handler";
import Assignment from "../models/Assignment";
import Quiz from "../models/Quiz";
import { calculateQuizScore } from "../utils/helpers";
import { Types } from "mongoose";
import Enrollment from "../models/Enrollment";

/**
 * Enrolls a student in a course
 * @param req - Express request with user authentication
 * @param res - Express response
 */
export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const validated = enrollmentSchema.parse(req.body);
    const enrollment = await studentService.enrollCourse(
      req.user.userId,
      validated.courseId,
      validated.batchId,
    );

    res.status(201).json({
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 400).json({
      error: error instanceof Error ? error.message : "Enrollment failed",
    });
  }
};

/**
 * Retrieves all courses enrolled by the authenticated student
 * @param req - Express request with user authentication
 * @param res - Express response
 */
export const getStudentCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const courses = await studentService.getStudentCourses(req.user.userId);
    res.json({ courses });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch courses",
    });
  }
};

/**
 * Updates student's progress for a specific lesson in a course
 * @param req - Express request with user authentication
 * @param res - Express response
 */
export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const validated = progressSchema.parse(req.body);
    const progress = await studentService.updateProgress(
      req.user.userId,
      validated.courseId,
      validated.lessonId,
    );

    res.json({
      message: "Progress updated",
      progress,
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 400).json({
      error:
        error instanceof Error ? error.message : "Failed to update progress",
    });
  }
};

/**
 * Submits an assignment for a student
 * @param req - Express request with user authentication
 * @param res - Express response
 */
export const submitAssignment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const validated = assignmentSubmissionSchema.parse(req.body);
    const assignment = await Assignment.findById(validated.assignmentId);

    if (!assignment) {
      throw new AppError("Assignment not found", 404);
    }
    const submission = {
      _id: new Types.ObjectId(),
      studentId: new Types.ObjectId(req.user.userId),
      submissionText: validated.submissionText,
      submissionLink: validated.submissionLink,
      submittedAt: new Date(),
    };

    assignment.submissions.push(submission);
    await assignment.save();

    res.status(201).json({
      message: "Assignment submitted successfully",
      submission,
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 400).json({
      error:
        error instanceof Error ? error.message : "Failed to submit assignment",
    });
  }
};

/**
 * Submits a quiz attempt for a student
 * @param req - Express request with user authentication
 * @param res - Express response
 */
export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const validated = quizSubmissionSchema.parse(req.body);
    const quiz = await Quiz.findById(validated.quizId);

    if (!quiz) {
      throw new AppError("Quiz not found", 404);
    }

    if (validated.answers.length !== quiz.questions.length) {
      throw new AppError("Invalid number of answers", 400);
    }

    const score = calculateQuizScore(validated.answers, quiz.questions);
    const passed = score >= quiz.passingScore;
    const attempt = {
      _id: new Types.ObjectId(),
      studentId: new Types.ObjectId(req.user.userId),
      answers: validated.answers,
      score,
      attemptedAt: new Date(),
      timeTaken: validated.timeTaken,
    };

    quiz.attempts.push(attempt);
    await quiz.save();

    res.json({
      message: "Quiz submitted",
      attempt,
      passed,
      passingScore: quiz.passingScore,
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 400).json({
      error: error instanceof Error ? error.message : "Failed to submit quiz",
    });
  }
};

/**
 * Retrieves all enrollments (Admin only)
 * @param req - Express request
 * @param res - Express response
 */
export const getAllEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("courseId", "title")
      .populate("studentId", "name email")
      .sort({ createdAt: -1 });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to fetch enrollments",
    });
  }
};

/**
 * Retrieves all assignment submissions (Admin only)
 * @param req - Express request
 * @param res - Express response
 */
export const getAllSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    // Find all assignments that have submissions
    const assignments = await Assignment.find({
      "submissions.0": { $exists: true },
    })
      .populate("courseId", "title")
      .populate("submissions.studentId", "name email");

    // Flatten the structure to return a list of submissions
    const submissions = assignments.flatMap((assignment) =>
      assignment.submissions.map((sub) => ({
        _id: sub._id, // This might be undefined if sub doesn't have _id, but mongoose subdocs usually do
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        courseTitle: (assignment.courseId as any).title,
        studentName: (sub.studentId as any).name,
        studentEmail: (sub.studentId as any).email,
        submittedAt: sub.submittedAt,
        score: sub.score,
        submissionLink: sub.submissionLink,
        submissionText: sub.submissionText,
      })),
    );

    res.json({ submissions });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to fetch submissions",
    });
  }
};

/**
 * Retrieves materials (assignments/quizzes) for a specific lesson
 * @param req - Express request
 * @param res - Express response
 */
export const getLessonMaterials = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, lessonId } = req.query;

    if (!courseId || !lessonId) {
      throw new AppError("Course ID and Lesson ID are required", 400);
    }

    const assignments = await Assignment.find({
      courseId,
      lessonId,
    }).select("-submissions"); // Don't send submissions to student

    const quizzes = await Quiz.find({
      courseId,
      lessonId,
    }).select("-attempts"); // Don't send attempts to student

    // Check for student's submissions/attempts to show status
    // This is a bit more complex, for now let's just return the materials
    // The frontend can check status if needed or we can enhance this later

    res.json({ assignments, quizzes });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch lesson materials",
    });
  }
};
