/** Response option labels by scale kind (value = array index, 0..4). */
export const EXPOSURE_OPTIONS = ["Never", "Rarely", "Sometimes", "Often", "Very often"] as const;
export const DISTRESS_OPTIONS = [
  "Not at all",
  "A little",
  "Moderately",
  "Quite a bit",
  "A great deal",
] as const;

export const MAX_VALUE = 4; // 0..4 scale

/**
 * Region-configurable crisis resource. Override at build time with:
 *   VITE_CRISIS_LABEL, VITE_CRISIS_BODY
 * Defaults to the US 988 Suicide & Crisis Lifeline.
 */
export const CRISIS = {
  label: import.meta.env.VITE_CRISIS_LABEL ?? "988 Suicide & Crisis Lifeline (U.S.)",
  body:
    import.meta.env.VITE_CRISIS_BODY ??
    "If the weight feels like too much to hold right now, please talk to someone today. In the U.S., call or text 988, any hour. Outside the U.S., contact your local crisis line or a trusted clinician.",
};

/** Distress index at/above which the crisis card is shown. */
export const CRISIS_THRESHOLD = 50;
