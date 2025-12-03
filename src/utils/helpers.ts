/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

/**
 * Hashes a password using bcrypt
 * @param password - Plain text password
 * @returns Promise resolving to hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain text password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns Promise resolving to true if passwords match
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Calculates progress percentage
 * @param completed - Number of completed items
 * @param total - Total number of items
 * @returns Progress percentage (0-100)
 */
export const calculateProgressPercentage = (
  completed: number,
  total: number,
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Calculates quiz score based on correct answers
 * @param answers - Array of answer indices selected by student
 * @param questions - Array of quiz questions with correct answers
 * @returns Quiz score as percentage (0-100)
 */
export const calculateQuizScore = (
  answers: number[],
  questions: any[],
): number => {
  let correctCount = 0;

  answers.forEach((answerIndex, questionIndex) => {
    const question = questions[questionIndex];
    if (question && question.options[answerIndex]?.isCorrect) {
      correctCount++;
    }
  });

  return Math.round((correctCount / questions.length) * 100);
};
