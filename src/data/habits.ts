import type { Habit } from "../types";

/**
 * Starter library of ethical "if-then" habits (implementation intentions;
 * Gollwitzer, 1999). Each links a high-pressure CUE to a concrete RESPONSE.
 * Tags map to assessment subscales so Practice can surface the most relevant
 * ones for a given reflection profile.
 */
export const HABITS: Habit[] = [
  {
    id: "h-reread",
    cue: "When I am about to send a sharp or aggressive message",
    then: "I will wait one hour and reread it as if the judge will see it",
    why: "Aggression under adversarial pressure is a classic ethical-fading trigger; a cooling delay restores judgment.",
    tags: ["SELF"],
  },
  {
    id: "h-child-sentence",
    cue: "When I open a new matter",
    then: "I will write one sentence on what outcome actually serves the child",
    why: "An explicit child-centered anchor at intake counters drift toward pure position-advancement.",
    tags: ["SELF", "all"],
  },
  {
    id: "h-name-pressure",
    cue: "When I notice I want to win more than I want to be fair",
    then: "I will name the pressure (fee, competition, ego) before I act",
    why: "Naming the incentive interrupts bounded ethicality, which operates invisibly (Bazerman & Tenbrunsel).",
    tags: ["SELF"],
  },
  {
    id: "h-filing-basis",
    cue: "Before I file or sign something",
    then: "I will state, in one line, the good-faith basis for it",
    why: "Forces a candor and meritoriousness check at the exact moment it matters.",
    tags: ["SELF"],
  },
  {
    id: "h-speak-up",
    cue: "When I see another professional do something I believe is wrong",
    then: "I will write down what I saw the same day, factually and without labels",
    why: "Witnessing harm is itself injurious; documenting restores a sense of agency and creates a record.",
    tags: ["WITNESS"],
  },
  {
    id: "h-raise-channel",
    cue: "When a pattern of unfairness repeats",
    then: "I will identify one legitimate channel to raise it within a week",
    why: "Converts helpless witnessing into a concrete, bounded action.",
    tags: ["WITNESS", "BETRAYAL"],
  },
  {
    id: "h-not-my-fault",
    cue: "When I catch myself carrying the whole system's failure as personal guilt",
    then: "I will separate what was my choice from what was a constraint placed on me",
    why: "Moral injury from constraint is an etiology of broken systems, not a personal verdict (Talbot & Dean).",
    tags: ["BETRAYAL"],
  },
  {
    id: "h-peer-check",
    cue: "When a case is sitting heavily on me",
    then: "I will say it out loud to a trusted peer instead of carrying it alone",
    why: "Isolation deepens moral injury; connection blunts it.",
    tags: ["DISTRESS", "all"],
  },
  {
    id: "h-weekly-review",
    cue: "At the end of each work week",
    then: "I will note one moment I am proud of and one I would do differently",
    why: "A brief, regular reckoning metabolizes moral weight instead of letting it accumulate.",
    tags: ["DISTRESS", "all"],
  },
  {
    id: "h-values-touchstone",
    cue: "Before a hearing or a hard conversation",
    then: "I will reread my one-line reason I do this work",
    why: "Reconnecting to purpose under stress narrows the gap between values and action.",
    tags: ["all"],
  },
  {
    id: "h-decline-script",
    cue: "When a client pushes me toward something over the line",
    then: "I will use a prepared, calm script that declines without escalating",
    why: "Pre-written language removes the in-the-moment willpower tax of saying no.",
    tags: ["SELF"],
  },
  {
    id: "h-sleep-on-it",
    cue: "When a decision feels urgent and high-stakes",
    then: "I will sleep on it unless a genuine deadline makes that impossible",
    why: "Acute pressure is when regret-producing choices are made; delay is cheap insurance.",
    tags: ["SELF", "all"],
  },
];

export function habitById(id: string): Habit | undefined {
  return HABITS.find((h) => h.id === id);
}

/** Common family-law pressure cues offered in the if-then builder. */
export const CUE_SUGGESTIONS: string[] = [
  "When billing pressure tempts me to prolong a matter",
  "When opposing counsel is being aggressive",
  "When a client demands something I am uncomfortable with",
  "When I am tired and want to cut a corner",
  "When 'winning' starts to matter more than the child",
  "When I am asked to soften or shade the truth",
];
