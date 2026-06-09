import type { Item } from "../types";

/**
 * Core items shown to ALL roles.
 * Exposure index = SELF + WITNESS + BETRAYAL. Distress index = DISTRESS only.
 * Keep these phrased in the first person and non-accusatory.
 */
export const CORE_ITEMS: Item[] = [
  { id: "s1", sub: "SELF", text: "I took actions in my work that went against my own sense of right and wrong." },
  { id: "s2", sub: "SELF", text: "I advanced a position or outcome I believed was harmful to a child or family." },
  { id: "s3", sub: "SELF", text: "I stayed silent when I believed something unfair or untrue was happening." },
  { id: "s4", sub: "SELF", text: "I let winning, billing, or expedience outweigh what I believed was right." },

  { id: "w1", sub: "WITNESS", text: "I saw colleagues or other professionals act in ways I considered unethical." },
  { id: "w2", sub: "WITNESS", text: "I witnessed a child or family treated unfairly and could not stop it." },
  { id: "w3", sub: "WITNESS", text: "I saw the process reward manipulation, posturing, or bad-faith tactics." },
  { id: "w4", sub: "WITNESS", text: "I watched decisions get made on incomplete, biased, or misleading information." },

  { id: "b1", sub: "BETRAYAL", text: "People or institutions I trusted to do right let the families down." },
  {
    id: "b2",
    sub: "BETRAYAL",
    text: "I knew the right thing to do, but rules, caseloads, or pressure made it nearly impossible.",
  },
  { id: "b3", sub: "BETRAYAL", text: "The system often seemed built to prolong conflict rather than resolve it." },
  { id: "b4", sub: "BETRAYAL", text: "Leadership or institutions failed to act on problems I raised." },

  { id: "d1", sub: "DISTRESS", text: "I feel guilt or shame about things I did, or failed to do, in this work." },
  { id: "d2", sub: "DISTRESS", text: "I have lost trust in the fairness of the system I work within." },
  { id: "d3", sub: "DISTRESS", text: "I question whether my work has done more harm than good." },
  { id: "d4", sub: "DISTRESS", text: "I feel disconnected from the values that brought me into this profession." },
  { id: "d5", sub: "DISTRESS", text: "Thoughts about cases or families intrude when I am trying to rest." },
  { id: "d6", sub: "DISTRESS", text: "I have struggled spiritually or morally because of what I have seen or done." },
];
