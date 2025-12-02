import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { authService } from "../services/auth.service";
import { generateToken } from "../config/jwt";
import { loginSchema, registerSchema } from "../utils/validation";
import { AppError } from "../middleware/error-handler";

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);

    const user = await authService.register(
      validated.name,
      validated.email,
      validated.password,
      validated.role,
    );

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as "student" | "admin",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 400).json({
      error: error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await authService.login(validated.email, validated.password);

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role as "student" | "admin",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 401).json({
      error: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const logout = (req: AuthRequest, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      throw new AppError("Not authenticated", 401);
    }

    const user = await authService.getUserById(req.user.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(error instanceof AppError ? error.statusCode : 500).json({
      error: error instanceof Error ? error.message : "Failed to fetch user",
    });
  }
};
