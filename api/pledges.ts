import { validatePledgeInput, type WallPledge } from "../src/lib/pledge";
import { isConfigured, json, redis, clientIpHash, rateLimit, KEYS, LIST_CAP } from "./_lib";

export const config = { runtime: "edge" };

const PAGE = 20;
// Per-IP budgets within a rolling hour.
const POST_LIMIT = 5;
const GET_LIMIT = 120;
const WINDOW = 3600;

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "GET") return listPledges(req);
  if (req.method === "POST") return addPledge(req);
  return json({ error: "Method not allowed" }, 405);
}

async function listPledges(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return json({ configured: false, pledges: [], total: 0, nextCursor: null });
  }
  const url = new URL(req.url);
  const cursor = Math.max(0, Number(url.searchParams.get("cursor") ?? "0") | 0);

  const [total, raw, hidden] = await Promise.all([
    redis<number>(["LLEN", KEYS.list]),
    redis<string[]>(["LRANGE", KEYS.list, cursor, cursor + PAGE - 1]),
    redis<string[]>(["SMEMBERS", KEYS.hidden]),
  ]);

  const hiddenSet = new Set(hidden ?? []);
  const pledges = (raw ?? [])
    .map((s) => {
      try {
        return JSON.parse(s) as WallPledge;
      } catch {
        return null;
      }
    })
    .filter((p): p is WallPledge => p !== null && !hiddenSet.has(p.id));

  const nextCursor = cursor + PAGE < total ? cursor + PAGE : null;
  return json({ configured: true, pledges, total, nextCursor });
}

async function addPledge(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return json({ ok: false, error: "The wall is not enabled yet." }, 503);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const result = validatePledgeInput(body);
  if (!result.ok) {
    return json({ ok: false, error: result.error }, 400);
  }

  const ipHash = await clientIpHash(req);
  if (!(await rateLimit(ipHash, POST_LIMIT, WINDOW))) {
    return json({ ok: false, error: "You've posted a few times recently — please try again later." }, 429);
  }
  // Light read-side abuse guard so a hot loop can't drain the list.
  await rateLimit(`get:${ipHash}`, GET_LIMIT, WINDOW);

  const pledge: WallPledge = {
    id: crypto.randomUUID(),
    ...result.value,
    ts: Date.now(),
  };

  await redis(["LPUSH", KEYS.list, JSON.stringify(pledge)]);
  await redis(["LTRIM", KEYS.list, 0, LIST_CAP - 1]);

  return json({ ok: true, pledge }, 201);
}
