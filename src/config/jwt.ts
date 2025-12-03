import jwt, { SignOptions } from "jsonwebtoken";
import config from ".";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "student" | "admin";
}

/**
 * Generates a JWT token for user authentication
 * @param payload - Token payload containing user information
 * @returns Signed JWT token string
 */
export const generateToken = (payload: JWTPayload): string => {
  const secret = config.jwt_secret;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: config.jwt_expire,
  };

  return jwt.sign(payload, secret as jwt.Secret, options);
};

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): JWTPayload => {
  const secret = config.jwt_secret;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, secret as jwt.Secret) as JWTPayload;
};
