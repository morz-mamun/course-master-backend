import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";
import {
  getDashboardStats,
  gradeAssignment,
  getAllUsers,
  getAllEnrollments,
  getAllSubmissions,
  getAllQuizAttempts,
  createAssignment,
  createQuiz,
  getAssignmentsByLesson,
  getQuizzesByLesson,
} from "../controllers/admin.controller";

const router = Router();

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Admin only
 */
router.get("/stats", authMiddleware, adminMiddleware, getDashboardStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Admin only
 */
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

/**
 * @route   GET /api/admin/enrollments
 * @desc    Get all enrollments
 * @access  Admin only
 */
router.get("/enrollments", authMiddleware, adminMiddleware, getAllEnrollments);

/**
 * @route   GET /api/admin/submissions
 * @desc    Get all assignment submissions
 * @access  Admin only
 */
router.get("/submissions", authMiddleware, adminMiddleware, getAllSubmissions);

/**
 * @route   GET /api/admin/quizzes/attempts
 * @desc    Get all quiz attempts
 * @access  Admin only
 */
router.get(
  "/quizzes/attempts",
  authMiddleware,
  adminMiddleware,
  getAllQuizAttempts,
);

/**
 * @route   POST /api/admin/grade
 * @desc    Grade a student assignment submission
 * @access  Admin only
 */
router.post("/grade", authMiddleware, adminMiddleware, gradeAssignment);

/**
 * @route   POST /api/admin/assignments
 * @desc    Create a new assignment for a lesson
 * @access  Admin only
 */
router.post("/assignments", authMiddleware, adminMiddleware, createAssignment);

/**
 * @route   POST /api/admin/quizzes
 * @desc    Create a new quiz for a lesson
 * @access  Admin only
 */
router.post("/quizzes", authMiddleware, adminMiddleware, createQuiz);

/**
 * @route   GET /api/admin/assignments/:courseId/:lessonId
 * @desc    Get all assignments for a specific lesson
 * @access  Admin only
 */
router.get(
  "/assignments/:courseId/:lessonId",
  authMiddleware,
  adminMiddleware,
  getAssignmentsByLesson,
);

/**
 * @route   GET /api/admin/quizzes/:courseId/:lessonId
 * @desc    Get all quizzes for a specific lesson
 * @access  Admin only
 */
router.get(
  "/quizzes/:courseId/:lessonId",
  authMiddleware,
  adminMiddleware,
  getQuizzesByLesson,
);

export default router;
