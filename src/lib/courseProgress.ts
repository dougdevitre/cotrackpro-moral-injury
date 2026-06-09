import type { TestQuestion, TestResult } from "../types";

/** Grades the post-test against an answer map (questionId -> selected index). */
export function gradeTest(
  questions: TestQuestion[],
  answers: Record<string, number>,
  threshold: number
): TestResult {
  const total = questions.length;
  const correct = questions.reduce(
    (n, q) => (answers[q.id] === q.correctIndex ? n + 1 : n),
    0
  );
  const pct = total === 0 ? 0 : correct / total;
  return { correct, total, pct, passed: pct >= threshold };
}

export interface CompletionState {
  modulesAffirmed: boolean;
  testPassed: boolean;
  evaluationDone: boolean;
  timeAttested: boolean;
  name: string;
  jurisdiction: string;
}

/** All conditions that must hold before a certificate may be issued. */
export function completionEligible(s: CompletionState): boolean {
  return (
    s.modulesAffirmed &&
    s.testPassed &&
    s.evaluationDone &&
    s.timeAttested &&
    s.name.trim().length > 0 &&
    s.jurisdiction.trim().length > 0
  );
}

/** Human-readable initials for the completion id. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "XX";
  const first = parts[0][0] ?? "X";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0][1] ?? "X");
  return (first + last).toUpperCase();
}

/**
 * Builds a unique, readable completion id. `seed` (a timestamp) is injectable
 * for deterministic tests. Format: <COURSEID>-<base36 time>-<INITIALS>.
 */
export function makeCompletionId(courseId: string, name: string, seed: number): string {
  return `${courseId}-${seed.toString(36).toUpperCase()}-${initials(name)}`;
}
