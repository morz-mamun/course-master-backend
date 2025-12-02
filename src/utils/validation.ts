import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "admin"]).optional().default("student"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const courseSchema = z.object({
  title: z.string().min(3, "Course title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be non-negative"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  syllabus: z
    .array(
      z.object({
        lessonId: z.string(),
        title: z.string(),
        duration: z.number(),
        videoUrl: z.string().url(),
        description: z.string(),
      }),
    )
    .optional(),
  batches: z
    .array(
      z.object({
        batchId: z.string(),
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        capacity: z.number().positive(),
      }),
    )
    .optional(),
});

export const enrollmentSchema = z.object({
  courseId: z.string(),
  batchId: z.string(),
});

export const progressSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
});

export const assignmentSubmissionSchema = z
  .object({
    assignmentId: z.string(),
    submissionText: z.string().optional(),
    submissionLink: z.string().url().optional(),
  })
  .refine(
    (data) => data.submissionText || data.submissionLink,
    "Either submission text or link must be provided",
  );

export const quizSubmissionSchema = z.object({
  quizId: z.string(),
  answers: z.array(z.number()),
  timeTaken: z.number().positive(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type ProgressInput = z.infer<typeof progressSchema>;
export type AssignmentSubmissionInput = z.infer<
  typeof assignmentSubmissionSchema
>;
export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;
