import express from "express";
import {
  enrollCourse,
  getStudentCourses,
  updateProgress,
  submitAssignment,
  submitQuiz,
  getAllEnrollments,
  getAllSubmissions,
  getLessonMaterials,
} from "../controllers/student.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Protected routes
router.post("/enroll", authMiddleware, enrollCourse);
router.get("/student/courses", authMiddleware, getStudentCourses);
router.get("/materials", authMiddleware, getLessonMaterials);
router.post("/progress", authMiddleware, updateProgress);
router.post("/assignments", authMiddleware, submitAssignment);
router.post("/quiz/submit", authMiddleware, submitQuiz);

// Admin routes
router.get(
  "/admin/enrollments",
  authMiddleware,
  adminMiddleware,
  getAllEnrollments,
);
router.get(
  "/admin/submissions",
  authMiddleware,
  adminMiddleware,
  getAllSubmissions,
);

console.log("✅ Student routes registered, including /materials endpoint");

export default router;
