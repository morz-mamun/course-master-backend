import User, { type IUser } from "../models/User";
import { hashPassword, comparePassword } from "../utils/helpers";
import { AppError } from "../middleware/error-handler";

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
    role = "student",
  ): Promise<IUser> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    return user.save();
  }

  async login(email: string, password: string): Promise<IUser> {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    return user;
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).lean();
  }
}

export const authService = new AuthService();
