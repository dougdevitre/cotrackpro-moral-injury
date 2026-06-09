import type { TestQuestion } from "../types";

/**
 * Post-test: single-best-answer questions that demonstrate understanding of the
 * course material (a common self-study participation-verification method).
 * Each carries an explanation shown after grading.
 */
export const TEST_QUESTIONS: TestQuestion[] = [
  {
    id: "q1",
    prompt: "Moral injury is best distinguished from ordinary burnout because it specifically involves:",
    options: [
      "Physical exhaustion from long hours",
      "A transgression of one's own deeply held moral beliefs — by acting, failing to prevent, or witnessing",
      "Dissatisfaction with pay or workload",
      "A diagnosable mood disorder",
    ],
    correctIndex: 1,
    explanation:
      "Moral injury concerns the violation of moral beliefs (perpetrating, failing to prevent, or witnessing), which is distinct from the depletion model of burnout.",
  },
  {
    id: "q2",
    prompt: "The course deliberately separates two indices in the reflection. They are:",
    options: [
      "Guilt and shame",
      "Competence and diligence",
      "Exposure (events encountered) and distress (impact on the person)",
      "Short-term and long-term harm",
    ],
    correctIndex: 2,
    explanation:
      "Conflating exposure to morally injurious events with the harm outcome is a known measurement error; the tool keeps them separate.",
  },
  {
    id: "q3",
    prompt: "Jameton's concept of moral distress refers to:",
    options: [
      "Knowing the right thing to do but being constrained from doing it",
      "Intentionally acting unethically for gain",
      "Any negative emotion at work",
      "A lawyer's duty of candor",
    ],
    correctIndex: 0,
    explanation:
      "Moral distress arises when institutional constraints make it nearly impossible to pursue the course one believes is right.",
  },
  {
    id: "q4",
    prompt: "Research on children of separation indicates that the strongest driver of harm is usually:",
    options: [
      "The divorce itself",
      "High interparental conflict",
      "The child's age at separation",
      "Which parent has primary custody",
    ],
    correctIndex: 1,
    explanation:
      "It is high interparental conflict — not the separation per se — that most strongly threatens children's emotional security and adjustment.",
  },
  {
    id: "q5",
    prompt: "The 'dose-response' finding from the ACE study means that:",
    options: [
      "A single adverse event always causes lifelong harm",
      "Adversity has no measurable long-term effect",
      "As cumulative childhood adversity rises, associated lifelong risk rises with it",
      "Only physical abuse affects adult health",
    ],
    correctIndex: 2,
    explanation:
      "The ACE study found a graded, dose-response relationship between cumulative adversity and adult health and social outcomes — probabilistic, not deterministic.",
  },
  {
    id: "q6",
    prompt: "According to toxic-stress science, the single most powerful buffer for a child facing adversity is:",
    options: [
      "A higher household income",
      "A stable, responsive relationship with at least one caring adult",
      "Avoiding all stress entirely",
      "A change of school",
    ],
    correctIndex: 1,
    explanation:
      "A stable, responsive adult relationship can turn toxic stress into tolerable stress — the protective factor professionals are often positioned to support.",
  },
  {
    id: "q7",
    prompt: "An implementation intention is most accurately described as:",
    options: [
      "A general goal to 'be more ethical'",
      "A pre-decided 'if/when [cue], then I will [specific action]' plan",
      "A disciplinary rule",
      "A relaxation technique",
    ],
    correctIndex: 1,
    explanation:
      "Implementation intentions link a specific situational cue to a concrete action, and work best precisely when self-regulation is under pressure.",
  },
  {
    id: "q8",
    prompt: "Why does the course favor pre-deciding (if-then plans) over relying on willpower in the moment?",
    options: [
      "Willpower is unlimited",
      "Ethics rules require it",
      "Ethical 'fading' tends to occur under pressure and often goes unnoticed",
      "Pre-deciding is faster to bill",
    ],
    correctIndex: 2,
    explanation:
      "Bounded ethicality and ethical fading mean ethics slips under incentive, competition, and load — usually without awareness — so pre-deciding protects better than in-the-moment resolve.",
  },
  {
    id: "q9",
    prompt: "An attorney who lets a court rely on a statement they know is false most directly implicates which duty?",
    options: [
      "Candor toward the tribunal (Rule 3.3)",
      "Safekeeping property (Rule 1.15)",
      "Fees (Rule 1.5)",
      "Communications (Rule 1.4)",
    ],
    correctIndex: 0,
    explanation:
      "Rule 3.3 prohibits knowingly making or failing to correct false statements of fact or law to a tribunal. (Model Rule; verify your jurisdiction's adopted version.)",
  },
  {
    id: "q10",
    prompt: "Which statement reflects the course's framing of a professional's role in a child's outcome?",
    options: [
      "A single action determines a child's whole life",
      "Professionals have no real influence on outcomes",
      "The same decision can add adversity or add protection; outcomes are probabilistic and bufferable",
      "Only parents affect child outcomes",
    ],
    correctIndex: 2,
    explanation:
      "Professionals sit at leverage points: their choices can add a dose of adversity or a layer of protection. Outcomes are probabilistic, not predetermined.",
  },
];

/**
 * Role-specific post-test questions, added to the core set per track
 * (track.questionIds). Each tests a point relevant to that role's
 * accrediting context or practice.
 */
export const ROLE_QUESTIONS: TestQuestion[] = [
  {
    id: "rq_ethics_sep",
    prompt: "For attorneys, ethics/professionalism CLE credit for content like this is usually:",
    options: [
      "Automatically granted with any CLE",
      "Requested separately on the accreditation application and determined by the board",
      "Never available for self-study",
      "Decided by the course author",
    ],
    correctIndex: 1,
    explanation:
      "Ethics credit is typically requested separately, and the state bar / MCLE board makes the determination.",
  },
  {
    id: "rq_judicial",
    prompt: "Continuing education credit for judges is generally:",
    options: [
      "Identical to and interchangeable with attorney CLE",
      "Administered separately by a judicial-education authority with its own rules",
      "Not required for sitting judges",
      "Granted automatically on completion of any course",
    ],
    correctIndex: 1,
    explanation:
      "Judicial education is administered separately from attorney CLE, with its own categories, hours, and authority.",
  },
  {
    id: "rq_clinical",
    prompt: "For licensed clinicians, continuing education for this content is typically approved through:",
    options: [
      "The state bar",
      "National bodies such as ASWB, APA, or NBCC, then accepted at the state board's discretion",
      "The court that hears the case",
      "No body — clinicians have no CE",
    ],
    correctIndex: 1,
    explanation:
      "Clinical CE commonly runs through ASWB (social work), APA (psychology), or NBCC (counseling); the state licensing board remains the final authority.",
  },
  {
    id: "rq_mediator",
    prompt: "In mediation, the most protective move for the children involved is usually to:",
    options: [
      "Reach any agreement as fast as possible",
      "Reduce interparental conflict and keep the framing child-centered",
      "Side with the more cooperative parent",
      "Avoid discussing the children",
    ],
    correctIndex: 1,
    explanation:
      "Because interparental conflict is the strongest driver of harm, de-escalation and child-centered framing are the most protective.",
  },
  {
    id: "rq_childvoice",
    prompt: "A guardian ad litem best serves a child by:",
    options: [
      "Advancing whichever parent retained more sympathy",
      "Centering the child's voice and best interests and weighing long-term impact",
      "Minimizing contact with the child to stay objective",
      "Deferring entirely to the attorneys",
    ],
    correctIndex: 1,
    explanation:
      "The GAL role centers the child's voice and best interests, including the long-term developmental impact of recommendations.",
  },
];

/** Assembles the post-test for a track: core questions plus its role-specific items. */
export function assembleTest(questionIds: string[]): TestQuestion[] {
  const extras = ROLE_QUESTIONS.filter((q) => questionIds.includes(q.id));
  return [...TEST_QUESTIONS, ...extras];
}
