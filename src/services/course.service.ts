/* eslint-disable @typescript-eslint/no-explicit-any */
import Course, { type ICourse } from "../models/Course";

export interface QueryOptions {
  search?: string;
  category?: string;
  tags?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export class CourseService {
  async createCourse(data: any, instructorId: string): Promise<ICourse> {
    const course = new Course({
      ...data,
      instructor: instructorId,
    });
    return course.save();
  }

  async getCourses(options: QueryOptions) {
    const {
      search,
      category,
      tags,
      sort = "createdAt_desc",
      page = 1,
      limit = 10,
    } = options;

    const filter: any = {};

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim());
      filter.tags = { $in: tagArray };
    }

    // Sort
    let sortObj: any = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "newest") sortObj = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const courses = await Course.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean()
      .select("-syllabus -batches"); // Exclude detailed fields for list view

    const total = await Course.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getCourseById(courseId: string): Promise<ICourse | null> {
    return Course.findById(courseId)
      .populate("instructor", "name email")
      .lean();
  }

  async updateCourse(courseId: string, data: any): Promise<ICourse | null> {
    return Course.findByIdAndUpdate(courseId, data, {
      new: true,
      runValidators: true,
    });
  }

  async deleteCourse(courseId: string): Promise<void> {
    await Course.findByIdAndDelete(courseId);
  }
}

export const courseService = new CourseService();
