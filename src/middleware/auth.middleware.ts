import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JWTPayload } from "../config/jwt";
import { AppError } from "./error-handler";

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    if (req.user.role !== "admin") {
      throw new AppError("Admin access required", 403);
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  }
};
