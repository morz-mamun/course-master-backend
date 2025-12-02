import express from "express";
import {
  enrollCourse,
  getStudentCourses,
  updateProgress,
  submitAssignment,
  submitQuiz,
} from "../controllers/student.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Protected routes
router.post("/enroll", authMiddleware, enrollCourse);
router.get("/student/courses", authMiddleware, getStudentCourses);
router.post("/progress", authMiddleware, updateProgress);
router.post("/assignments", authMiddleware, submitAssignment);
router.post("/quiz/submit", authMiddleware, submitQuiz);

export default router;
