import { z } from "zod";
import type { Reading, Role, Scores } from "../types";

export const resultSchema = z.object({
  tool: z.literal("cotrackpro.moral-injury-reflection"),
  version: z.string(),
  role: z.string().optional(),
  completedAt: z.string(),
  indices: z.object({
    exposure: z.number().int().min(0).max(100),
    distress: z.number().int().min(0).max(100),
  }),
  subscales: z.object({
    SELF: z.number().int().min(0).max(100),
    WITNESS: z.number().int().min(0).max(100),
    BETRAYAL: z.number().int().min(0).max(100),
    DISTRESS: z.number().int().min(0).max(100),
  }),
  bands: z.object({
    exposure: z.string(),
    distress: z.string(),
  }),
  note: z.string(),
});

export type ResultPayload = z.infer<typeof resultSchema>;

export function buildResultPayload(
  scores: Scores,
  reading: Reading,
  role: Role | null
): ResultPayload {
  return {
    tool: "cotrackpro.moral-injury-reflection",
    version: "1.0",
    role: role?.id,
    completedAt: new Date().toISOString(),
    indices: { exposure: scores.exposure, distress: scores.distress },
    subscales: scores.sub,
    bands: { exposure: reading.eBand.label, distress: reading.dBand.label },
    note: "Self-reflection screener. Not a clinical diagnosis or legal assessment.",
  };
}
