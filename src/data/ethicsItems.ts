import type { Item } from "../types";

/* ============================================================================
 * Attorney path — ethics-grounded item bank.
 * ============================================================================
 *
 * Each SELF/WITNESS item is, where applicable, tied to an ABA Model Rule via
 * `ruleId` (resolved against src/data/rules.ts). Rule references are verified
 * MODEL-rule numbers/titles — your jurisdiction's adopted rules govern and may
 * differ. Practice-pattern items have no single rule and intentionally omit a
 * ruleId.
 *
 * This remains a starter set. To wire in the canonical list from
 * track.cotrackpro.com, reword each entry into a first-person reflection
 * (the source list spots wrongdoing; this tool is for self-reflection), map it
 * to SELF or WITNESS, set roles: ["attorney"], and attach a ruleId if one fits.
 * ==========================================================================*/

export const ETHICS_ITEMS: Item[] = [
  // --- Duties to the client ---
  { id: "e_competence", sub: "SELF", roles: ["attorney"], ruleId: "1.1", text: "I handled a matter I was not prepared to handle competently." },
  { id: "e_diligence", sub: "SELF", roles: ["attorney"], ruleId: "1.3", text: "I let a client's matter languish in a way that harmed the family." },
  { id: "e_fees", sub: "SELF", roles: ["attorney"], ruleId: "1.5", text: "I inflated or prolonged work in a way that served billing over the family." },

  // --- Duties to the tribunal & opponents ---
  { id: "e_meritorious", sub: "SELF", roles: ["attorney"], ruleId: "3.1", text: "I filed something I knew lacked a good-faith basis." },
  { id: "e_candor", sub: "SELF", roles: ["attorney"], ruleId: "3.3", text: "I let the court rely on something I knew was false or misleading." },
  { id: "e_fairness", sub: "SELF", roles: ["attorney"], ruleId: "3.4", text: "I obstructed, concealed, or shaped evidence or testimony." },
  { id: "e_misconduct", sub: "SELF", roles: ["attorney"], ruleId: "8.4", text: "I engaged in conduct involving dishonesty or deceit." },

  // --- Family-law practice patterns (no single rule) ---
  { id: "e_leverage", sub: "SELF", roles: ["attorney"], text: "I used custody as leverage rather than centering the child." },
  { id: "e_inflame", sub: "SELF", roles: ["attorney"], text: "I escalated conflict when de-escalation would have served the family better." },

  // --- Witnessed variants ---
  { id: "e_w_frivolous", sub: "WITNESS", roles: ["attorney"], ruleId: "3.1", text: "I watched frivolous filings used to exhaust the other side." },
  { id: "e_w_misled", sub: "WITNESS", roles: ["attorney"], ruleId: "3.3", text: "I saw the court misled and stayed silent." },
  { id: "e_w_leverage", sub: "WITNESS", roles: ["attorney"], text: "I saw children used as bargaining chips." },
];
