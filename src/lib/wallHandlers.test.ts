import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import pledgesHandler from "../../api/pledges";
import reportHandler from "../../api/report";
import type { WallPledge } from "../lib/pledge";

/**
 * Integration-style tests for the pledge-wall edge handlers. They run the real
 * handlers against an in-memory mock of the Vercel KV REST API (the only
 * external dependency), so validation, rate-limiting, and the report→hide flow
 * are exercised end to end without a live datastore.
 */

const KV_URL = "https://kv.test";

/** A tiny in-memory Redis supporting just the commands the handlers use. */
class FakeKV {
  nums = new Map<string, number>();
  lists = new Map<string, string[]>();
  sets = new Map<string, Set<string>>();
  hashes = new Map<string, Map<string, number>>();

  exec(cmd: (string | number)[]): unknown {
    const [verb, key, ...args] = cmd as [string, string, ...(string | number)[]];
    switch (verb) {
      case "INCR": {
        const n = (this.nums.get(key) ?? 0) + 1;
        this.nums.set(key, n);
        return n;
      }
      case "EXPIRE":
        return 1;
      case "LPUSH": {
        const list = this.lists.get(key) ?? [];
        list.unshift(String(args[0]));
        this.lists.set(key, list);
        return list.length;
      }
      case "LLEN":
        return this.lists.get(key)?.length ?? 0;
      case "LRANGE": {
        const list = this.lists.get(key) ?? [];
        const start = Number(args[0]);
        const stop = Number(args[1]);
        return list.slice(start, stop + 1);
      }
      case "LTRIM": {
        const list = this.lists.get(key) ?? [];
        this.lists.set(key, list.slice(Number(args[0]), Number(args[1]) + 1));
        return "OK";
      }
      case "SMEMBERS":
        return Array.from(this.sets.get(key) ?? []);
      case "SADD": {
        const set = this.sets.get(key) ?? new Set<string>();
        set.add(String(args[0]));
        this.sets.set(key, set);
        return 1;
      }
      case "HINCRBY": {
        const hash = this.hashes.get(key) ?? new Map<string, number>();
        const field = String(args[0]);
        const n = (hash.get(field) ?? 0) + Number(args[1]);
        hash.set(field, n);
        this.hashes.set(key, hash);
        return n;
      }
      default:
        throw new Error(`unmocked command ${verb}`);
    }
  }
}

let kv: FakeKV;

function mockFetch(): typeof fetch {
  return vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
    const cmd = JSON.parse(String(init?.body)) as (string | number)[];
    return new Response(JSON.stringify({ result: kv.exec(cmd) }), { status: 200 });
  }) as unknown as typeof fetch;
}

function req(method: string, body?: unknown, ip = "1.2.3.4", query = ""): Request {
  return new Request(`https://app.test/api/pledges${query}`, {
    method,
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

const validPledge = { consent: true, commitmentId: "pause", name: "Sam", roleId: "attorney", region: "Europe" };

beforeEach(() => {
  kv = new FakeKV();
  process.env.KV_REST_API_URL = KV_URL;
  process.env.KV_REST_API_TOKEN = "token";
  vi.stubGlobal("fetch", mockFetch());
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_TOKEN;
});

describe("GET /api/pledges", () => {
  it("reports not-configured when KV env is absent", async () => {
    delete process.env.KV_REST_API_URL;
    const res = await pledgesHandler(req("GET"));
    const data = await res.json();
    expect(data.configured).toBe(false);
    expect(data.pledges).toEqual([]);
  });

  it("returns an empty configured wall", async () => {
    const res = await pledgesHandler(req("GET"));
    const data = await res.json();
    expect(data.configured).toBe(true);
    expect(data.total).toBe(0);
  });
});

describe("POST /api/pledges", () => {
  it("accepts a valid pledge and surfaces it on the wall", async () => {
    const post = await pledgesHandler(req("POST", validPledge));
    expect(post.status).toBe(201);
    const created = (await post.json()).pledge as WallPledge;
    expect(created.commitmentId).toBe("pause");
    expect(created.id).toBeTruthy();

    const list = await (await pledgesHandler(req("GET"))).json();
    expect(list.total).toBe(1);
    expect(list.pledges[0].id).toBe(created.id);
  });

  it("rejects a submission without consent", async () => {
    const res = await pledgesHandler(req("POST", { ...validPledge, consent: false }));
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON", async () => {
    const bad = new Request("https://app.test/api/pledges", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" },
      body: "{ not json",
    });
    expect((await pledgesHandler(bad)).status).toBe(400);
  });

  it("rate-limits a noisy IP after the per-hour budget", async () => {
    for (let i = 0; i < 5; i++) {
      expect((await pledgesHandler(req("POST", validPledge, "5.5.5.5"))).status).toBe(201);
    }
    const sixth = await pledgesHandler(req("POST", validPledge, "5.5.5.5"));
    expect(sixth.status).toBe(429);
  });

  it("rejects unsupported methods", async () => {
    expect((await pledgesHandler(req("DELETE"))).status).toBe(405);
  });
});

describe("POST /api/report", () => {
  it("auto-hides a pledge after three reports", async () => {
    const created = (await (await pledgesHandler(req("POST", validPledge))).json()).pledge as WallPledge;

    for (let i = 0; i < 3; i++) {
      const r = await reportHandler(
        new Request("https://app.test/api/report", {
          method: "POST",
          headers: { "content-type": "application/json", "x-forwarded-for": `7.7.7.${i}` },
          body: JSON.stringify({ id: created.id }),
        })
      );
      expect(r.status).toBe(200);
    }

    const list = await (await pledgesHandler(req("GET"))).json();
    expect(list.pledges.find((p: WallPledge) => p.id === created.id)).toBeUndefined();
  });

  it("rejects a report with a missing id", async () => {
    const r = await reportHandler(
      new Request("https://app.test/api/report", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "8.8.8.8" },
        body: JSON.stringify({}),
      })
    );
    expect(r.status).toBe(400);
  });
});
