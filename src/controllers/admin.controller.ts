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

/**
 * Create a new assignment for a lesson
 * @param req - Express request with user authentication and assignment data
 * @param res - Express response
 */
export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, lessonId, title, description, dueDate, maxScore } =
      req.body;

    // Validate required fields
    if (!courseId || !lessonId || !title || !description || !dueDate) {
      return res.status(400).json({
        error:
          "Course ID, Lesson ID, title, description, and due date are required",
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Create the assignment
    const assignment = await Assignment.create({
      courseId,
      lessonId,
      title,
      description,
      dueDate: new Date(dueDate),
      maxScore: maxScore || 100,
      submissions: [],
    });

    res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to create assignment",
    });
  }
};

/**
 * Create a new quiz for a lesson
 * @param req - Express request with user authentication and quiz data
 * @param res - Express response
 */
export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, lessonId, title, description, questions, passingScore } =
      req.body;

    // Validate required fields
    if (
      !courseId ||
      !lessonId ||
      !title ||
      !questions ||
      !Array.isArray(questions)
    ) {
      return res.status(400).json({
        error: "Course ID, Lesson ID, title, and questions array are required",
      });
    }

    // Validate questions structure
    for (const question of questions) {
      if (
        !question.questionText ||
        !question.options ||
        !Array.isArray(question.options)
      ) {
        return res.status(400).json({
          error: "Each question must have questionText and options array",
        });
      }

      const hasCorrectAnswer = question.options.some(
        (opt: any) => opt.isCorrect,
      );
      if (!hasCorrectAnswer) {
        return res.status(400).json({
          error: "Each question must have at least one correct answer",
        });
      }
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Create the quiz
    const quiz = await Quiz.create({
      courseId,
      lessonId,
      title,
      description: description || "",
      questions,
      passingScore: passingScore || 70,
      attempts: [],
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to create quiz",
    });
  }
};

/**
 * Get all assignments for a specific lesson
 * @param req - Express request with courseId and lessonId params
 * @param res - Express response
 */
export const getAssignmentsByLesson = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { courseId, lessonId } = req.params;

    if (!courseId || !lessonId) {
      return res.status(400).json({
        error: "Course ID and Lesson ID are required",
      });
    }

    const assignments = await Assignment.find({ courseId, lessonId }).select(
      "-submissions",
    );

    res.json({ assignments });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to fetch assignments",
    });
  }
};

/**
 * Get all quizzes for a specific lesson
 * @param req - Express request with courseId and lessonId params
 * @param res - Express response
 */
export const getQuizzesByLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, lessonId } = req.params;

    if (!courseId || !lessonId) {
      return res.status(400).json({
        error: "Course ID and Lesson ID are required",
      });
    }

    const quizzes = await Quiz.find({ courseId, lessonId }).select("-attempts");

    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch quizzes",
    });
  }
};
