import Enrollment, { type IEnrollment } from "../models/Enrollment";
import Progress, { type IProgress } from "../models/Progress";
import User from "../models/User";
import Course from "../models/Course";
import { AppError } from "../middleware/error-handler";
import { calculateProgressPercentage } from "../utils/helpers";

export class StudentService {
  async enrollCourse(
    studentId: string,
    courseId: string,
    batchId: string,
  ): Promise<IEnrollment> {
    // Check if already enrolled
    const existing = await Enrollment.findOne({ studentId, courseId });
    if (existing) {
      throw new AppError("Already enrolled in this course", 400);
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    // Create enrollment
    const enrollment = new Enrollment({
      courseId,
      studentId,
      batchId,
    });

    // Add to user's enrolled courses
    await User.findByIdAndUpdate(
      studentId,
      { $push: { enrolledCourses: courseId } },
      { new: true },
    );

    // Create initial progress record
    const totalLessons = course.syllabus.length;
    const progress = new Progress({
      studentId,
      courseId,
      totalLessons,
      percentage: 0,
      completedLessonIds: [],
    });

    await progress.save();

    return enrollment.save();
  }

  async getStudentCourses(studentId: string) {
    const enrollments = await Enrollment.find({ studentId })
      .populate({
        path: "courseId",
        select: "title description category price enrollmentCount",
      })
      .lean();

    const progress = await Progress.find({ studentId }).lean();

    const coursesWithProgress = enrollments.map((enrollment) => {
      const courseProgress = progress.find(
        (p) => p.courseId.toString() === enrollment.courseId._id.toString(),
      );

      return {
        ...enrollment,
        progress: courseProgress || null,
      };
    });

    return coursesWithProgress;
  }

  async updateProgress(
    studentId: string,
    courseId: string,
    lessonId: string,
  ): Promise<IProgress> {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }

    let progress = await Progress.findOne({ studentId, courseId });
    if (!progress) {
      throw new AppError("Progress record not found", 404);
    }

    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);
      progress.lessonsCompleted = progress.completedLessonIds.length;
      progress.percentage = calculateProgressPercentage(
        progress.lessonsCompleted,
        progress.totalLessons,
      );

      if (progress.percentage === 100) {
        progress.completedAt = new Date();
      }

      progress = await progress.save();
    }

    return progress;
  }
}

export const studentService = new StudentService();
