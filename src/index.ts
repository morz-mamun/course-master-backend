/* eslint-disable @typescript-eslint/no-explicit-any */

import express, { Application, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/database";
import config from "./config";
import { errorHandler } from "./middleware/error-handler";
import authRoutes from "./routes/auth.routes";
import coursesRoutes from "./routes/courses.routes";
import studentRoutes from "./routes/student.routes";

const app: Application = express();
const PORT = config?.port || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: config.frontend_url || "http://localhost:3000",
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api", studentRoutes);

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Course Master server running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  });

export default app;
