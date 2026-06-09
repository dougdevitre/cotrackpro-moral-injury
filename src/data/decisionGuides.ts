import type { DecisionGuide } from "../types";

/**
 * In-the-moment ethical decision guides. Each is a short guided step-through.
 * Frameworks are real and attributed in plain language; wording is adapted to
 * the family-law context. None of this is legal advice — every guide closes by
 * pointing the user to their own ethics resource for real conduct questions.
 */
export const DECISION_GUIDES: DecisionGuide[] = [
  {
    id: "quick-check",
    title: "The 60-second ethics check",
    blurb: "Three questions for when something feels off but you have to act soon.",
    source: "Adapted from Blanchard & Peale's Ethics Check (The Power of Ethical Management, 1988).",
    steps: [
      {
        prompt: "Is it within the rules?",
        helper:
          "Would this violate a rule of professional conduct, a court order, or the law? If you are not sure, that uncertainty is itself information.",
      },
      {
        prompt: "Is it fair to everyone affected — especially the child?",
        helper:
          "Short term and long term. Does anyone get an advantage they should not? Who carries the cost?",
      },
      {
        prompt: "How would I feel if this were visible?",
        helper:
          "Would I be comfortable if the judge, my mentor, or my family saw exactly what I did and why? Would I feel proud, or would I be rationalizing?",
      },
    ],
    closing:
      "If any answer is shaky, treat that as a stop sign, not a hurdle. This check clarifies your own thinking — it is not legal advice. For a real conduct question, call a confidential ethics resource for your profession before you act.",
  },
  {
    id: "pressure-pause",
    title: "The pressure pause",
    blurb: "For when a deadline, a fee, a client, or 'winning' is pulling you somewhere you would not normally go.",
    source:
      "Grounded in research on ethical fading and bounded ethicality (Bazerman & Tenbrunsel, Blind Spots, 2011): ethics quietly erodes under incentive, competition, and loss pressure — usually without us noticing.",
    steps: [
      {
        prompt: "Name the pressure out loud.",
        helper:
          "Billing? Competition with opposing counsel? A demanding client? Fear of losing? Naming it is what stops it from operating invisibly.",
      },
      {
        prompt: "Name the value or duty it is pulling you away from.",
        helper: "Candor? Fairness? The child's wellbeing? Your own sense of who you are?",
      },
      {
        prompt: "What is the smallest fully honest next step?",
        helper:
          "Not the whole problem — just the next move you could stand behind completely.",
      },
      {
        prompt: "Can you buy time?",
        helper:
          "An hour, a night's sleep, or a quick call to a trusted colleague almost always improves the decision. Decisions made under acute pressure are the ones people most regret.",
      },
    ],
    closing:
      "The pull you felt is normal and predictable — that is exactly why pre-deciding (see Practice) protects you better than willpower in the moment.",
  },
  {
    id: "child-lens",
    title: "The child-centered lens",
    blurb: "A quick re-centering when strategy and the child's interests may have drifted apart.",
    source: "CoTrackPro's child-centered, trauma-informed orientation.",
    steps: [
      {
        prompt: "Whose need does this actually serve?",
        helper: "The child? Your client? Your position or pride? Be honest about the order.",
      },
      {
        prompt: "What would the child experience as a result?",
        helper: "Not the legal outcome — the lived experience for the kid in the middle.",
      },
      {
        prompt: "Is there a less harmful way to reach a legitimate goal?",
        helper: "Often the same legitimate end can be reached without the collateral damage.",
      },
    ],
    closing:
      "Centering the child is not the same as conceding the case. It is a check on whether the means have quietly stopped serving anyone who matters.",
  },
  {
    id: "five-lenses",
    title: "Five lenses for a genuinely hard call",
    blurb: "When there is no clean answer and you want to think it through from every angle.",
    source: "The five approaches of the Markkula Center for Applied Ethics (Santa Clara University).",
    steps: [
      { prompt: "Outcomes", helper: "Which option produces the most good and least harm, all considered?" },
      { prompt: "Rights", helper: "Which best respects the rights and dignity of everyone involved?" },
      { prompt: "Fairness", helper: "Which treats people equitably, without favoritism or hidden advantage?" },
      { prompt: "Common good", helper: "Which best serves the shared system — the court, the profession, the family?" },
      { prompt: "Virtue", helper: "Which reflects the kind of professional, and person, you want to be?" },
    ],
    closing:
      "The lenses will not always agree — that is the point. Where they conflict, you have found the real tension, and that is worth naming before you decide.",
  },
];

export function guideById(id: string): DecisionGuide | undefined {
  return DECISION_GUIDES.find((g) => g.id === id);
}
