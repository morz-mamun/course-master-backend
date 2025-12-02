import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { courseService } from "../services/course.service";
import { courseSchema } from "../utils/validation";
import { AppError } from "../middleware/error-handler";

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const validated = courseSchema.parse(req.body);
    const course = await courseService.createCourse(validated, req.user.userId);

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 400).json({
      error: error instanceof Error ? error.message : "Failed to create course",
    });
  }
};

export const getCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { search, category, tags, sort, page, limit } = req.query;

    const result = await courseService.getCourses({
      search: search as string,
      category: category as string,
      tags: tags as string,
      sort: sort as string,
      page: page ? Number.parseInt(page as string) : 1,
      limit: limit ? Number.parseInt(limit as string) : 10,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch courses",
    });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    res.json({ course });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: error instanceof Error ? error.message : "Failed to fetch course",
    });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validated = courseSchema.parse(req.body);
    const course = await courseService.updateCourse(id, validated);

    if (!course) {
      throw new AppError("Course not found", 404);
    }

    res.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 400).json({
      error: error instanceof Error ? error.message : "Failed to update course",
    });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await courseService.deleteCourse(id);

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: error instanceof Error ? error.message : "Failed to delete course",
    });
  }
};
