import { clientIpHash, isConfigured, json, rateLimit, reportPledge } from "./_lib";

const REPORT_LIMIT = 20;
const WINDOW = 3600;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!isConfigured()) return json({ ok: false, error: "The wall is not enabled yet." }, 503);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const id = (body as { id?: unknown })?.id;
  if (typeof id !== "string" || id.length === 0 || id.length > 64) {
    return json({ ok: false, error: "Invalid pledge id." }, 400);
  }

  const ipHash = clientIpHash(req);
  if (!(await rateLimit(`report:${ipHash}`, REPORT_LIMIT, WINDOW))) {
    return json({ ok: false, error: "Too many reports — please try again later." }, 429);
  }

  await reportPledge(id);
  return json({ ok: true });
}
