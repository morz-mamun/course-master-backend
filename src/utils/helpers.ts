/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const calculateProgressPercentage = (
  completed: number,
  total: number,
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

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
