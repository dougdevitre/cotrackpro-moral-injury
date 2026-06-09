export type Subscale = "SELF" | "WITNESS" | "BETRAYAL" | "DISTRESS";

export type ScaleKind = "exposure" | "distress";

export interface Item {
  id: string;
  sub: Subscale;
  text: string;
  /** Optional: only shown for these role ids. Undefined = shown to all roles. */
  roles?: string[];
  /** Optional: related ABA Model Rule id (e.g. "3.3"). */
  ruleId?: string;
}

export interface Role {
  id: string;
  label: string;
  /** Short framing phrase: "As someone {lens}, ..." */
  lens: string;
}

export type Answers = Record<string, number>;

export interface Scores {
  sub: Record<Subscale, number>;
  exposure: number;
  distress: number;
}

export interface Band {
  key: "minimal" | "emerging" | "significant" | "severe";
  label: string;
  rank: 0 | 1 | 2 | 3;
}

export type TriageTier = "support" | "ethics" | "repair" | "systems";

export interface TriageCard {
  tier: TriageTier;
  title: string;
  body: string;
}

export interface Reading {
  lead: string;
  driver: string;
  eBand: Band;
  dBand: Band;
}

export type Stage = "intro" | "role" | "assess" | "results";

/* ----------------------- Decide & Practice modules ------------------------ */

export type View =
  | "home"
  | "course"
  | "reflect"
  | "decide"
  | "practice"
  | "standards"
  | "longview"
  | "about";

export interface GuideStep {
  prompt: string;
  helper?: string;
}

export interface DecisionGuide {
  id: string;
  title: string;
  blurb: string;
  /** Plain-language attribution for the underlying framework. */
  source: string;
  steps: GuideStep[];
  /** Closing, non-advice reminder shown at the end of the guide. */
  closing: string;
}

/** An ethical "if-then" habit (implementation intention). */
export interface Habit {
  id: string;
  /** The cue: "If/When ..." (the situation that puts ethics under pressure). */
  cue: string;
  /** The response: "then I will ..." (a concrete, small action). */
  then: string;
  /** Why this works / what risk it guards against. */
  why: string;
  /** Which risk profile(s) this targets; "all" = relevant to everyone. */
  tags: (Subscale | "all")[];
  /** Optional role scoping. */
  roles?: string[];
}

export interface CustomHabit {
  cue: string;
  then: string;
}

export interface PracticePlan {
  commitments: string[];
  habitIds: string[];
  customHabits: CustomHabit[];
}

/** Lightweight snapshot of a completed reflection, used to tailor Practice. */
export interface ScoreProfile {
  scores: Scores;
  roleId: string | null;
}

/* ----------------------------- Long view module --------------------------- */

export interface EvidenceItem {
  label: string;
  cite: string;
  url: string;
}

export interface LongViewPathway {
  id: string;
  /** The professional action or inaction. */
  action: string;
  /** Optional related ABA Model Rule id. */
  ruleId?: string;
  /** Short-term: the child's immediate experience (days–weeks). */
  shortTerm: string;
  /** Why it lands: the named developmental mechanism. */
  mechanism: string;
  /** Over a lifetime: increased-risk domains (probabilistic). */
  longTerm: string;
  /** The protective counter-move within the professional's control. */
  leverage: string;
  /** A clean if-then habit derived from the leverage, addable to the practice plan. */
  habit: CustomHabit;
}

/* ------------------------------- CLE course ------------------------------- */

export interface AgendaItem {
  label: string;
  minutes: number;
  summary?: string;
  /** Optional view this agenda item maps to, for the module checklist. */
  view?: View;
}

export interface TestQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TestResult {
  correct: number;
  total: number;
  pct: number;
  passed: boolean;
}

export interface RoleCreditGuidance {
  id: "attorney" | "judge" | "other";
  label: string;
  guidance: string;
}

export interface CertificateInput {
  name: string;
  roleCategory: string;
  jurisdiction: string;
  dateISO: string;
}

export interface CertificateData extends CertificateInput {
  courseTitle: string;
  courseId: string;
  completionId: string;
  minutes: number;
  hours: string; // formatted, e.g. "1.3"
  instructionalMethod: string;
  productionDate: string;
  provider: string;
  providerNumber: string;
  author: string;
  disclaimer: string;
}

/** A role-specific course track (objectives, credit context, post-test add-ons). */
export interface CourseTrack {
  roleId: string;
  label: string;
  /** Short credit-context heading, e.g. "Attorney CLE". */
  creditContext: string;
  /** Typical accrediting bodies + the "your board is final authority" caveat. */
  bodies: string;
  /** Optional role-specific learning objective appended to the core set. */
  objective?: string;
  /** Ids of role-specific post-test questions to add for this track. */
  questionIds: string[];
}
