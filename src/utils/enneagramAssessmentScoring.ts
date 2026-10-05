import {
  scoreEnneagram,
  type EnneagramResult,
} from "./enneagramScoring";
import {
  scoreInstincts,
  type InstinctResult,
} from "./enneagramInstinctScoring";
import type { EnneagramRawAnswers } from "../data/enneagramQuestions";
import type { InstinctRawAnswers } from "../data/enneagramInstinctQuestions";

export interface EnneagramAssessmentResult
  extends EnneagramResult,
    InstinctResult {}

export type EnneagramAssessmentAnswers =
  EnneagramRawAnswers & InstinctRawAnswers;

export function scoreEnneagramAssessment(
  answers: EnneagramAssessmentAnswers,
): EnneagramAssessmentResult | { errors: string[] } {
  const coreResult = scoreEnneagram(answers);
  const instinctResult = scoreInstincts(answers);

  const errors: string[] = [];

  if ("errors" in coreResult) {
    errors.push(...coreResult.errors);
  }

  if ("errors" in instinctResult) {
    errors.push(...instinctResult.errors);
  }

  if (errors.length > 0) {
    return { errors };
  }

  return {
    ...coreResult,
    ...instinctResult,
  };
}
