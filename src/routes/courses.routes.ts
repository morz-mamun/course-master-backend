import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Public routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Admin routes
router.post("/admin/create", authMiddleware, adminMiddleware, createCourse);
router.put("/admin/:id", authMiddleware, adminMiddleware, updateCourse);
router.delete("/admin/:id", authMiddleware, adminMiddleware, deleteCourse);

export default router;
