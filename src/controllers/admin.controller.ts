/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import Course from "../models/Course";
import User from "../models/User";
import Enrollment from "../models/Enrollment";
import Assignment from "../models/Assignment";
import Quiz from "../models/Quiz";

/**
 * Retrieves dashboard statistics for admin
 * @param req - Express request with user authentication
 * @param res - Express response
 */
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get total courses
    const totalCourses = await Course.countDocuments();

    // Get total students (users with role 'student')
    const totalStudents = await User.countDocuments({ role: "student" });

    // Get total enrollments
    const totalEnrollments = await Enrollment.countDocuments();

    // Get total assignments
    const totalAssignments = await Assignment.countDocuments();

    res.json({
      totalCourses,
      totalStudents,
      totalEnrollments,
      totalAssignments,
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard stats",
    });
  }
};

/**
 * Retrieves all users (students and admins)
 * @param req - Express request
 * @param res - Express response
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select("-password") // Exclude password
      .sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch users",
    });
  }
};

/**
 * Retrieves all enrollments
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
 * Retrieves all assignment submissions
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
        _id: sub._id,
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        courseTitle: (assignment.courseId as any).title,
        studentName: (sub.studentId as any)?.name || "Unknown",
        studentEmail: (sub.studentId as any)?.email || "Unknown",
        submittedAt: sub.submittedAt,
        score: sub.score,
        submissionLink: sub.submissionLink,
        submissionText: sub.submissionText,
        feedback: sub.feedback,
        gradedAt: sub.gradedAt,
      })),
    );

    // Sort by submission date (newest first)
    submissions.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
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
 * Retrieves all quiz attempts
 * @param req - Express request
 * @param res - Express response
 */
export const getAllQuizAttempts = async (req: AuthRequest, res: Response) => {
  try {
    // Find all quizzes that have attempts
    const quizzes = await Quiz.find({
      "attempts.0": { $exists: true },
    })
      .populate("courseId", "title")
      .populate("attempts.studentId", "name email");

    // Flatten the structure
    const attempts = quizzes.flatMap((quiz) =>
      quiz.attempts.map((attempt) => ({
        _id: attempt._id,
        quizId: quiz._id,
        quizTitle: quiz.title,
        courseTitle: (quiz.courseId as any).title,
        studentName: (attempt.studentId as any)?.name || "Unknown",
        studentEmail: (attempt.studentId as any)?.email || "Unknown",
        score: attempt.score,
        passingScore: quiz.passingScore,
        passed: attempt.score >= quiz.passingScore,
        attemptedAt: attempt.attemptedAt,
        timeTaken: attempt.timeTaken,
      })),
    );

    // Sort by attempt date (newest first)
    attempts.sort(
      (a, b) =>
        new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime(),
    );

    res.json({ attempts });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch quiz attempts",
    });
  }
};

/**
 * Grade a student's assignment submission
 * @param req - Express request with user authentication and grading data
 * @param res - Express response
 */
export const gradeAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { assignmentId, submissionId, score, feedback } = req.body;

    // Validate input
    if (!assignmentId || !submissionId) {
      return res
        .status(400)
        .json({ error: "Assignment ID and Submission ID are required" });
    }

    if (score !== undefined && (score < 0 || score > 100)) {
      return res.status(400).json({ error: "Score must be between 0 and 100" });
    }

    // Find the assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Find the submission within the assignment
    const submission = assignment.submissions.find(
      (sub) => sub._id.toString() === submissionId,
    );
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Update the submission with score and feedback
    submission.score = score;
    submission.feedback = feedback;
    submission.gradedAt = new Date();

    await assignment.save();

    res.json({
      message: "Assignment graded successfully",
      submission: {
        _id: submission._id,
        score: submission.score,
        feedback: submission.feedback,
        gradedAt: submission.gradedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to grade assignment",
    });
  }
};
