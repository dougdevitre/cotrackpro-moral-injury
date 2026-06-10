import type { CommitmentItem } from "../types";

/**
 * The moral-injury-prevention declaration. Each pledge is a first-person
 * implementation intention mapped to one of the four protective tiers the
 * reflection uses (support · ethics · repair · systems). These are protective
 * practices, not a diagnosis or a guarantee.
 */
export const COMMITMENTS: CommitmentItem[] = [
  {
    id: "notice",
    tier: "support",
    label: "Notice the weight",
    text: "I will treat moral distress as information, not weakness — noticing it early instead of pushing it down.",
  },
  {
    id: "support",
    tier: "support",
    label: "Not carry it alone",
    text: "When the work weighs on me, I will reach for support and consultation rather than carrying it alone.",
  },
  {
    id: "pause",
    tier: "ethics",
    label: "Pause under pressure",
    text: "When a deadline, a fee, a client, or 'winning' pulls me somewhere I would not normally go, I will pause and check the choice against my values before I act.",
  },
  {
    id: "child",
    tier: "ethics",
    label: "Keep the child central",
    text: "I will keep the wellbeing of the child at the center of the calls I make.",
  },
  {
    id: "repair",
    tier: "repair",
    label: "Repair when I fall short",
    text: "When I fall short of my own standards, I will name it honestly and take a concrete step to repair, rather than rationalize it.",
  },
  {
    id: "recover",
    tier: "repair",
    label: "Stay whole",
    text: "I will protect time to recover and stay connected, treating my own wellbeing as part of doing this work well.",
  },
  {
    id: "systems",
    tier: "systems",
    label: "Name what the system forces",
    text: "When a constraint forces a choice that harms the people I serve, I will document it and raise it through the proper channel rather than absorb it in silence.",
  },
];
