import type { PledgeInput, WallPledge } from "./pledge";

/**
 * Thin client for the pledge-wall endpoints. Same-origin only (covered by the
 * existing `connect-src 'self'` CSP). `configured: false` means the wall's
 * datastore isn't provisioned yet, so the UI shows a "coming soon" state.
 */

export interface WallList {
  configured: boolean;
  pledges: WallPledge[];
  total: number;
  /** Opaque pagination token; null when there are no more pages. */
  nextCursor: string | null;
}

export type SubmitResult = { ok: true; pledge: WallPledge } | { ok: false; error: string };

export async function fetchPledges(cursor: string | null = null): Promise<WallList> {
  try {
    const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    const res = await fetch(`/api/pledges${qs}`, {
      headers: { Accept: "application/json" },
    });
    const data = (await res.json()) as Partial<WallList>;
    return {
      configured: Boolean(data.configured),
      pledges: Array.isArray(data.pledges) ? data.pledges : [],
      total: typeof data.total === "number" ? data.total : 0,
      nextCursor: typeof data.nextCursor === "string" ? data.nextCursor : null,
    };
  } catch {
    return { configured: false, pledges: [], total: 0, nextCursor: null };
  }
}

export async function submitPledge(input: PledgeInput): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/pledges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json()) as SubmitResult;
    if (res.ok && data.ok) return data;
    return { ok: false, error: ("error" in data && data.error) || "Something went wrong. Please try again." };
  } catch {
    return { ok: false, error: "Couldn't reach the wall. Please check your connection." };
  }
}

export async function reportPledge(id: string): Promise<boolean> {
  try {
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
