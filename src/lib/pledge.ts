import { COMMITMENTS, commitmentById } from "../data/commitments";
import { ROLES, roleById } from "../data/roles";

/**
 * Pure, shared validation + moderation for the community pledge wall.
 *
 * PRIVACY CONTRACT: a pledge carries ONLY a chosen commitment (from the fixed
 * catalog), an optional first name, a role, and a coarse region. It NEVER
 * contains reflection answers, scores, free-form notes, or any other PII. This
 * module is the single source of truth for both the browser form and the
 * serverless endpoint, and is fully unit-tested. It is intentionally
 * dependency-free and side-effect-free (no fetch, no storage, no crypto).
 */

/** What the client submits. */
export interface PledgeInput {
  consent: boolean;
  commitmentId: string;
  name?: string;
  roleId: string;
  region?: string;
}

/** A validated, persisted/public pledge (no PII beyond an optional first name). */
export interface WallPledge {
  id: string;
  commitmentId: string;
  name: string | null;
  roleId: string;
  region: string | null;
  ts: number;
}

export const NAME_MAX = 24;

/** Coarse, fixed regions — no free-text location, so nothing to moderate. */
export const REGIONS = [
  "North America",
  "Latin America",
  "Europe",
  "Africa",
  "Middle East",
  "Asia",
  "Oceania",
  "Prefer not to say",
] as const;

export const VALID_COMMITMENT_IDS: ReadonlySet<string> = new Set(COMMITMENTS.map((c) => c.id));
export const VALID_ROLE_IDS: ReadonlySet<string> = new Set(ROLES.map((r) => r.id));
const VALID_REGIONS: ReadonlySet<string> = new Set(REGIONS);

// A deliberately small profanity stem list. The main pledge text comes from a
// fixed catalog, so the only free-text surface is the optional first name.
const PROFANITY = ["fuck", "shit", "bitch", "cunt", "asshole", "nigger", "faggot", "retard"];

export function hasProfanity(s: string): boolean {
  const lower = s.toLowerCase();
  return PROFANITY.some((w) => lower.includes(w));
}

/**
 * Normalize an optional first name: trim, collapse whitespace, keep only
 * letters/spaces/hyphens/apostrophes, cap length. Returns null when empty.
 */
export function sanitizeName(raw: string | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/[^\p{L} '-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, NAME_MAX);
  return cleaned.length > 0 ? cleaned : null;
}

export type ValidationResult =
  | { ok: true; value: Omit<WallPledge, "id" | "ts"> }
  | { ok: false; error: string };

/**
 * Validate and shape an incoming submission. Pure: callers (the edge function)
 * attach `id` and `ts`. Rejects missing consent, unknown ids, and profanity.
 */
export function validatePledgeInput(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Invalid request." };
  }
  const i = input as Record<string, unknown>;

  if (i.consent !== true) {
    return { ok: false, error: "Please confirm you understand this is public before posting." };
  }
  if (typeof i.commitmentId !== "string" || !VALID_COMMITMENT_IDS.has(i.commitmentId)) {
    return { ok: false, error: "Choose a commitment to pledge." };
  }
  if (typeof i.roleId !== "string" || !VALID_ROLE_IDS.has(i.roleId)) {
    return { ok: false, error: "Choose your role." };
  }

  const region =
    typeof i.region === "string" && i.region.length > 0
      ? i.region === "Prefer not to say"
        ? null
        : i.region
      : null;
  if (region !== null && !VALID_REGIONS.has(region)) {
    return { ok: false, error: "Choose a region from the list." };
  }

  const name = sanitizeName(typeof i.name === "string" ? i.name : undefined);
  if (name && hasProfanity(name)) {
    return { ok: false, error: "Please use a different name." };
  }

  return {
    ok: true,
    value: { commitmentId: i.commitmentId, name, roleId: i.roleId, region },
  };
}

/* ------- Label helpers for rendering (client resolves ids → labels) -------- */

export function commitmentLabel(id: string): string {
  return commitmentById(id)?.label ?? "A protective commitment";
}

export function commitmentText(id: string): string {
  return commitmentById(id)?.text ?? "";
}

export function roleLabel(id: string): string {
  return roleById(id)?.label ?? "A family-law professional";
}
