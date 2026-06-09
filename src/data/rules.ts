/**
 * A curated subset of the ABA Model Rules of Professional Conduct most relevant
 * to family-law practice.
 *
 * IMPORTANT:
 *  - `summary` is a PLAIN-LANGUAGE PARAPHRASE in our own words, not the ABA's text.
 *    The rule text and comments are © American Bar Association and are not reproduced.
 *  - These are MODEL rules. Your jurisdiction's adopted rules govern and may differ
 *    in number, wording, or substance. Always check your state's rules.
 *  - Titles, numbers, and URLs verified against americanbar.org (2026-06).
 */

export type RuleCategory = "client" | "counsel" | "court" | "others" | "integrity";

export interface Rule {
  id: string; // e.g. "3.3"
  title: string; // official ABA title
  category: RuleCategory;
  summary: string; // our plain-language paraphrase
  url: string; // official ABA page
}

const BASE =
  "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/";

export const CATEGORY_LABELS: Record<RuleCategory, string> = {
  client: "Duties to the client",
  counsel: "Counseling",
  court: "Duties to the court & the process",
  others: "Dealings with others",
  integrity: "Integrity of the profession",
};

export const CATEGORY_ORDER: RuleCategory[] = ["client", "counsel", "court", "others", "integrity"];

export const RULES: Rule[] = [
  {
    id: "1.1",
    title: "Competence",
    category: "client",
    summary:
      "Handle a matter with the knowledge, skill, and preparation it requires — or associate with someone who can, or decline it.",
    url: BASE + "rule_1_1_competence/",
  },
  {
    id: "1.3",
    title: "Diligence",
    category: "client",
    summary: "Act with reasonable promptness and follow through; do not let a client's matter languish.",
    url: BASE + "rule_1_3_diligence/",
  },
  {
    id: "1.4",
    title: "Communications",
    category: "client",
    summary:
      "Keep the client reasonably informed and explain things enough for them to make informed decisions.",
    url: BASE + "rule_1_4_communications/",
  },
  {
    id: "1.5",
    title: "Fees",
    category: "client",
    summary: "Charge fees and expenses that are reasonable, and be clear about how they are calculated.",
    url: BASE + "rule_1_5_fees/",
  },
  {
    id: "1.6",
    title: "Confidentiality of Information",
    category: "client",
    summary: "Protect information relating to the representation; reveal it only where the rules permit.",
    url: BASE + "rule_1_6_confidentiality_of_information/",
  },
  {
    id: "1.7",
    title: "Conflict of Interest: Current Clients",
    category: "client",
    summary:
      "Do not represent competing interests unless you reasonably believe you can be fair to each and they give informed consent.",
    url: BASE + "rule_1_7_conflict_of_interest_current_clients/",
  },
  {
    id: "1.15",
    title: "Safekeeping Property",
    category: "client",
    summary: "Keep client and third-party funds and property separate from your own and properly accounted for.",
    url: BASE + "rule_1_15_safekeeping_property/",
  },
  {
    id: "2.1",
    title: "Advisor",
    category: "counsel",
    summary:
      "Exercise independent professional judgment and give candid advice — even when it is not what the client hopes to hear.",
    url: BASE + "rule_2_1_advisor/",
  },
  {
    id: "3.1",
    title: "Meritorious Claims and Contentions",
    category: "court",
    summary: "Do not bring or defend a position without a good-faith basis in law and fact.",
    url: BASE + "rule_3_1_meritorious_claims_and_contentions/",
  },
  {
    id: "3.2",
    title: "Expediting Litigation",
    category: "court",
    summary: "Make reasonable efforts to move a matter along; do not use delay as a tactic.",
    url: BASE + "rule_3_2_expediting_litigation/",
  },
  {
    id: "3.3",
    title: "Candor Toward the Tribunal",
    category: "court",
    summary:
      "Do not knowingly mislead the court with false statements of law or fact or false evidence — and correct them if it happens.",
    url: BASE + "rule_3_3_candor_toward_the_tribunal/",
  },
  {
    id: "3.4",
    title: "Fairness to Opposing Party and Counsel",
    category: "court",
    summary:
      "Do not obstruct access to evidence, falsify it, or abuse procedure to gain an unfair advantage.",
    url: BASE + "rule_3_4_fairness_to_opposing_party_and_counsel/",
  },
  {
    id: "4.1",
    title: "Truthfulness in Statements to Others",
    category: "others",
    summary:
      "Do not knowingly make a false statement of material fact or law to others in the course of representing a client.",
    url: BASE + "rule_4_1_truthfulness_in_statements_to_others/",
  },
  {
    id: "4.4",
    title: "Respect for Rights of Third Persons",
    category: "others",
    summary:
      "Do not use means that have no substantial purpose other than to embarrass, delay, or burden a third person.",
    url: BASE + "rule_4_4_respect_for_rights_of_third_persons/",
  },
  {
    id: "8.4",
    title: "Misconduct",
    category: "integrity",
    summary:
      "Dishonesty, fraud, deceit, or misrepresentation — or conduct prejudicial to the administration of justice — is professional misconduct.",
    url: BASE + "rule_8_4_misconduct/",
  },
];

export const RULES_TOC_URL = BASE + "model_rules_of_professional_conduct_table_of_contents/";

export const ABA_DISCLAIMER =
  "Plain-language summaries of the ABA Model Rules — not the official text. The Model Rules are a template; your jurisdiction's adopted rules govern and may differ. Check your state's rules and consult a confidential ethics resource for real questions. Rule text and comments © American Bar Association.";

export function ruleById(id: string | undefined): Rule | undefined {
  if (!id) return undefined;
  return RULES.find((r) => r.id === id);
}

export function rulesByCategory(category: RuleCategory): Rule[] {
  return RULES.filter((r) => r.category === category);
}
