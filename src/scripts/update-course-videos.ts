import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course";
import path from "path";

// Load env vars
dotenv.config({ path: path.join(process.cwd(), ".env") });

const COURSE_ID = "692f5ba4535cff2717e7b54a";

const VIDEOS = [
  "https://www.youtube.com/embed/zofMnllkVfI?si=tjlDDCvzS-_d6VP7",
  "https://www.youtube.com/embed/7xStNKTM3bE?si=lLUDzs6BnCE7T0Zq",
  "https://www.youtube.com/embed/xgZ62PefYE8?si=eYSyDx17pYo7htRY",
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || "");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    process.exit(1);
  }
};

const updateCourse = async () => {
  await connectDB();

  try {
    const course = await Course.findById(COURSE_ID);

    if (!course) {
      console.error(`Course with ID ${COURSE_ID} not found`);
      process.exit(1);
    }

    console.log(`Found course: ${course.title}`);

    // Create 3 lessons with the videos
    const newSyllabus = [
      {
        lessonId: "lesson-1",
        title: "Introduction to Course",
        duration: 15,
        videoUrl: VIDEOS[0],
        description:
          "An introduction to the course concepts and what you will learn.",
      },
      {
        lessonId: "lesson-2",
        title: "Core Concepts",
        duration: 25,
        videoUrl: VIDEOS[1],
        description: "Deep dive into the core concepts and fundamentals.",
      },
      {
        lessonId: "lesson-3",
        title: "Advanced Topics",
        duration: 30,
        videoUrl: VIDEOS[2],
        description: "Exploring advanced topics and real-world applications.",
      },
    ];

    course.syllabus = newSyllabus;
    await course.save();

    console.log("Course syllabus updated successfully with new videos");
    process.exit(0);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    process.exit(1);
  }
};

updateCourse();
