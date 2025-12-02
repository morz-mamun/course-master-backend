import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
  error: Error | ZodError | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return res.status(400).json({
      error: "Validation error",
      details: formattedErrors,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
};
