import type { Role } from "../types";

export const ROLES: Role[] = [
  { id: "attorney", label: "Family law attorney", lens: "advocating inside an adversarial system" },
  {
    id: "gal",
    label: "Guardian ad litem / child's attorney",
    lens: "tasked with speaking for a child's interests",
  },
  {
    id: "evaluator",
    label: "Custody evaluator / forensic clinician",
    lens: "producing assessments the court relies on",
  },
  { id: "judge", label: "Judge, commissioner, or referee", lens: "deciding outcomes for families" },
  { id: "mediator", label: "Mediator", lens: "helping parties reach agreement" },
  { id: "pc", label: "Parenting coordinator", lens: "managing high-conflict co-parenting" },
  { id: "therapist", label: "Therapist or counselor", lens: "supporting clients through the process" },
  {
    id: "caseworker",
    label: "Caseworker / child protection / social worker",
    lens: "working at the front line of child welfare",
  },
  { id: "court", label: "Court staff or clerk", lens: "keeping the machinery of the court running" },
  { id: "advocate", label: "Advocate or paralegal", lens: "supporting families through proceedings" },
  {
    id: "other",
    label: "Other ecosystem professional",
    lens: "working within the family-law system",
  },
];

export function roleById(id: string | null | undefined): Role | null {
  if (!id) return null;
  return ROLES.find((r) => r.id === id) ?? null;
}
