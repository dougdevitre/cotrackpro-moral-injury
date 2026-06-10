/**
 * Server-only helpers for the pledge-wall endpoints (Vercel Edge runtime).
 *
 * Storage is Vercel KV via its Upstash-compatible REST API, reached with plain
 * `fetch` so we add NO dependency. When the KV env vars are absent (e.g. a
 * preview without the store provisioned) `isConfigured()` is false and the
 * endpoints respond gracefully instead of crashing. Files prefixed with `_`
 * are treated by Vercel as shared modules, not routes.
 */

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
// Optional salt so a hashed IP can't be reversed via a rainbow table.
const IP_SALT = process.env.PLEDGE_IP_SALT ?? "cotrackpro-mi-pledge";

export const KEYS = {
  list: "mi:pledges",
  hidden: "mi:hidden",
  reports: "mi:reports",
  rate: (h: string) => `mi:rl:${h}`,
} as const;

export const LIST_CAP = 5000;

export function isConfigured(): boolean {
  return Boolean(KV_URL && KV_TOKEN);
}

/** Run one Redis command through the KV REST API. */
export async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(KV_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) {
    throw new Error(`KV error ${res.status}`);
  }
  const data = (await res.json()) as { result: T; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** A salted SHA-256 hash of the caller IP — used only as an ephemeral rate-limit key. */
export async function clientIpHash(req: Request): Promise<string> {
  const fwd = req.headers.get("x-forwarded-for") ?? "unknown";
  const ip = fwd.split(",")[0].trim();
  const bytes = new TextEncoder().encode(`${IP_SALT}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);
}

/** Sliding fixed-window limiter. Returns true if the request is within budget. */
export async function rateLimit(ipHash: string, limit: number, windowSec: number): Promise<boolean> {
  const key = KEYS.rate(ipHash);
  const n = await redis<number>(["INCR", key]);
  if (n === 1) {
    await redis(["EXPIRE", key, windowSec]);
  }
  return n <= limit;
}
