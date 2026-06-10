import { validatePledgeInput, type WallPledge } from "../src/lib/pledge";
import {
  clientIpHash,
  isConfigured,
  json,
  listPledges,
  putPledge,
  randomUUID,
  rateLimit,
} from "./_lib";

const PAGE = 20;
// Per-IP budgets within a rolling hour.
const POST_LIMIT = 5;
const WINDOW = 3600;

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "GET") return getPledges(req);
  if (req.method === "POST") return addPledge(req);
  return json({ error: "Method not allowed" }, 405);
}

async function getPledges(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return json({ configured: false, pledges: [], total: 0, nextCursor: null });
  }
  const cursor = new URL(req.url).searchParams.get("cursor");
  const { pledges, total, nextCursor } = await listPledges(cursor, PAGE);
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

  const ipHash = clientIpHash(req);
  if (!(await rateLimit(ipHash, POST_LIMIT, WINDOW))) {
    return json({ ok: false, error: "You've posted a few times recently — please try again later." }, 429);
  }

  const pledge: WallPledge = { id: randomUUID(), ...result.value, ts: Date.now() };
  await putPledge(pledge);

  return json({ ok: true, pledge }, 201);
}
