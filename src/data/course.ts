import type { AgendaItem } from "../types";
import { trackByRole } from "./tracks";

export const COURSE = {
  id: "CTP-MIR-101",
  title: "Moral Injury, Ethics, and the Child: A Reflective Practicum for the Family-Law Ecosystem",
  version: "1.0",
  productionDate: "2026-06",
  instructionalMethod: "On-demand, interactive self-study (web-based)",
  description:
    "An interactive self-study course for professionals across the family-law system. Participants examine moral injury and moral distress in their work, apply structured ethical decision-making frameworks, study how cumulative childhood adversity and interparental conflict affect children across the lifespan, map common conduct concerns to the rules of professional conduct, and build personal implementation-intention plans to sustain ethical practice under pressure.",
  passThreshold: 0.8,
};

export const LEARNING_OBJECTIVES: string[] = [
  "Distinguish moral injury from burnout and identify its sources — self-transgression, witnessing, and betrayal or constraint — in family-law practice.",
  "Apply at least two structured ethical decision-making frameworks to a practice dilemma.",
  "Explain, in accurate and probabilistic terms, how cumulative childhood adversity and interparental conflict relate to lifelong outcomes for children.",
  "Identify the protective factors — reduced conflict, stability, and a stable caring adult relationship — that a professional is positioned to influence.",
  "Map common family-law conduct concerns to the relevant rules of professional conduct.",
  "Construct personal implementation-intention ('if-then') plans to maintain ethical practice under pressure.",
];

export const AGENDA: AgendaItem[] = [
  { label: "Orientation & learning objectives", minutes: 5 },
  { label: "Module 1 — Moral injury in family-law practice", minutes: 15, view: "reflect", summary: "Self-reflection: exposure vs. distress, and the sources of moral injury." },
  { label: "Module 2 — How today lands on a child", minutes: 15, view: "longview", summary: "Short- and long-term developmental impact; leverage points." },
  { label: "Module 3 — Professional-conduct standards", minutes: 10, view: "standards", summary: "Family-law-relevant rules of professional conduct." },
  { label: "Module 4 — Deciding well under pressure", minutes: 10, view: "decide", summary: "Structured ethical decision-making frameworks." },
  { label: "Module 5 — Building protective habits", minutes: 10, view: "practice", summary: "Implementation-intention plans and reminders." },
  { label: "Knowledge check (post-test)", minutes: 10 },
  { label: "Course evaluation & reflection", minutes: 5 },
];

export const TOTAL_MINUTES = AGENDA.reduce((n, a) => n + a.minutes, 0);

/** Estimated instructional time, formatted at the common 60-minute hour. */
export function estimatedHours(minutes = TOTAL_MINUTES): string {
  return (minutes / 60).toFixed(1);
}

/** Core objectives plus the role-specific objective for a track (if any). */
export function objectivesForRole(roleId: string): string[] {
  const t = trackByRole(roleId);
  return t.objective ? [...LEARNING_OBJECTIVES, t.objective] : [...LEARNING_OBJECTIVES];
}

export const ACCREDITATION_DISCLAIMER =
  "This course is NOT pre-accredited. CLE/CE accreditation, credit categories, and credit-hour values are determined by each jurisdiction's bar, MCLE board, judicial-education authority, or professional licensing board — not by this tool or its author. Accreditation is the responsibility of the provider (who must typically hold a board-issued provider number) and, where applicable, the individual licensee. Self-study may be capped or excluded in some jurisdictions, and ethics credit is usually requested separately. Verify all requirements with the relevant board before offering this course or claiming credit. Estimated instructional time is provided to support an application; it is not a representation of approved credit.";

export const PARTICIPATION_NOTE =
  "Participation verification: completion requires affirming review of each module, passing the post-test (demonstrating understanding of the material), completing the evaluation, and attesting to time spent. Providers remain responsible for any additional identity- and time-verification their jurisdiction requires.";
