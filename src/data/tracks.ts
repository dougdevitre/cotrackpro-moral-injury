import type { CourseTrack } from "../types";

/**
 * Role-specific course tracks. Each role answers to a different accrediting
 * world, so each gets tailored objectives, credit context, and post-test items.
 *
 * Accuracy note: accrediting bodies are named as they TYPICALLY apply, always
 * with the governing caveat that the licensee's own board is the final
 * authority on whether a course is accepted. Nothing here asserts approval.
 */
export const TRACKS: CourseTrack[] = [
  {
    roleId: "attorney",
    label: "Attorney CLE",
    creditContext: "Attorney continuing legal education (CLE)",
    bodies:
      "Your state bar / mandatory CLE (MCLE) board. Content commonly fits ethics or professionalism credit (usually requested separately on the application); some states also have an attorney-wellness or mental-health category. The board is the final authority.",
    objective:
      "Map specific family-law conduct concerns to the applicable Rules of Professional Conduct and locate the confidential ethics resources available to you.",
    questionIds: ["rq_ethics_sep"],
  },
  {
    roleId: "judge",
    label: "Judicial education",
    creditContext: "Judicial continuing education (CJE)",
    bodies:
      "Your state's judicial-education authority or judicial college — separate from attorney CLE, with its own categories and hours. The authority is the final arbiter.",
    objective:
      "Identify how docket-management and demeanor decisions act as leverage points for children's stability, consistent with judicial-conduct expectations.",
    questionIds: ["rq_judicial"],
  },
  {
    roleId: "gal",
    label: "GAL / child's attorney",
    creditContext: "Attorney CLE and/or GAL certification CE",
    bodies:
      "If you are a lawyer, your state bar CLE applies; many states also maintain separate guardian ad litem certification or training requirements. Submit to whichever governs your GAL role.",
    objective:
      "Center the child's voice and best interests while weighing the long-term impact of your recommendations.",
    questionIds: ["rq_childvoice"],
  },
  {
    roleId: "evaluator",
    label: "Forensic / psychology CE",
    creditContext: "Continuing education for your clinical license",
    bodies:
      "Custody evaluators are typically licensed clinicians; CE is governed by your clinical board (e.g., psychology via APA-approved sponsors, or your state board). AFCC offers relevant training. Your board is the final authority.",
    objective:
      "Apply child-development and conflict-exposure findings to reduce avoidable harm in assessment and recommendations.",
    questionIds: ["rq_clinical"],
  },
  {
    roleId: "mediator",
    label: "Mediator / ADR CE",
    creditContext: "Mediator / court-ADR continuing education",
    bodies:
      "Mediator CE varies widely by state court ADR programs and mediator-certification rules; some states require continuing mediator education. Submit to your certifying authority.",
    objective: "Use de-escalation and child-centered framing to lower interparental conflict during mediation.",
    questionIds: ["rq_mediator"],
  },
  {
    roleId: "pc",
    label: "Parenting coordinator CE",
    creditContext: "CE tied to your underlying license + state PC rules",
    bodies:
      "Parenting-coordinator CE usually follows your underlying professional license (legal or mental-health) plus any state PC qualification requirements. Submit to the governing board.",
    objective: "De-escalate high-conflict co-parenting using child-centered, conflict-reducing techniques.",
    questionIds: ["rq_clinical"],
  },
  {
    roleId: "therapist",
    label: "Behavioral-health CE",
    creditContext: "Counseling / social work / psychology CE",
    bodies:
      "Depending on your license, CE is typically approved via NBCC (ACEP, for counselors), ASWB ACE (for social workers), or APA (for psychologists), then accepted at your state board's discretion. The board is the final authority.",
    objective:
      "Recognize moral distress in your own practice and apply implementation-intention plans that protect therapeutic boundaries.",
    questionIds: ["rq_clinical"],
  },
  {
    roleId: "caseworker",
    label: "Social work CE",
    creditContext: "Social work continuing education",
    bodies:
      "Social work CE is typically offered through ASWB ACE-approved providers and accepted at your state social work board's discretion (note: some states, e.g., New York, do not accept ACE). The board is the final authority.",
    objective:
      "Identify safety-related leverage points and the protective value of stability and a consistent caring adult.",
    questionIds: ["rq_clinical"],
  },
  {
    roleId: "court",
    label: "Court professional development",
    creditContext: "Court-staff professional development",
    bodies:
      "Court-staff CE is usually administered through your court system or associations such as NACM; requirements vary. Submit to your court's professional-development authority.",
    objective: "Recognize how procedural timeliness and tone affect families and children.",
    questionIds: [],
  },
  {
    roleId: "advocate",
    label: "Paralegal / advocate CE",
    creditContext: "Paralegal CLE or advocate training standards",
    bodies:
      "Paralegal CE is typically tracked through associations such as NALA or NFPA; family/victim advocates follow their program's training standards. Submit to the relevant authority.",
    objective: "Support families with trauma-informed, non-accusatory documentation and communication.",
    questionIds: [],
  },
  {
    roleId: "other",
    label: "Other licensed professional",
    creditContext: "Your licensing board",
    bodies:
      "Submit to the board that licenses your role; it determines eligibility, category, and hours.",
    questionIds: [],
  },
];

export function trackByRole(roleId: string): CourseTrack {
  return TRACKS.find((t) => t.roleId === roleId) ?? TRACKS[TRACKS.length - 1];
}
