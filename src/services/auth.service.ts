import User, { type IUser } from "../models/User";
import { hashPassword, comparePassword } from "../utils/helpers";
import { AppError } from "../middleware/error-handler";

/**
 * Service class for handling user authentication operations
 */
export class AuthService {
  /**
   * Registers a new user in the system
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's password (will be hashed)
   * @param role - User role (student or admin)
   * @returns Promise resolving to the created user
   */
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

  /**
   * Authenticates a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to the authenticated user
   */
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

  /**
   * Retrieves a user by their ID
   * @param userId - User's unique identifier
   * @returns Promise resolving to the user or null if not found
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).lean();
  }
}

export const authService = new AuthService();
