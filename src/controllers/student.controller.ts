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
