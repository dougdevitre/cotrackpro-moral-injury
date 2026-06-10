/**
 * Server-only helpers for the pledge-wall endpoints (Vercel Node runtime).
 *
 * Storage is **DynamoDB** (single table, on-demand). When the required env vars
 * are absent (e.g. a preview without the table/credentials wired up)
 * `isConfigured()` is false and the endpoints respond gracefully instead of
 * crashing. Files prefixed with `_` are shared modules, not routes.
 *
 * Single-table design (string `pk` / `sk`):
 *   pk="PLEDGE"  sk=`${paddedTs}#${id}`   → a public pledge (newest first)
 *   pk="META"    sk="COUNT"  n            → running total of submissions
 *   pk="REPORT"  sk=id       reports      → per-pledge report counter
 *   pk="HIDDEN"  sk=id                    → marker; pledge filtered from the wall
 *   pk="RL"      sk=`${ipHash}#${window}` n, expireAt → rate-limit bucket (TTL)
 *
 * The table's TTL attribute should be set to `expireAt` so rate-limit rows
 * self-clean. Credentials come from the SDK's default chain (static
 * AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY).
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { createHash, randomUUID } from "node:crypto";
import type { WallPledge } from "../src/lib/pledge.js";

function tableName(): string | undefined {
  return process.env.PLEDGE_DDB_TABLE;
}
function region(): string | undefined {
  return process.env.AWS_REGION;
}
function ipSalt(): string {
  return process.env.PLEDGE_IP_SALT ?? "cotrackpro-mi-pledge";
}

export function isConfigured(): boolean {
  return Boolean(
    tableName() && region() && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  );
}

export const HIDE_THRESHOLD = 3;

// Lazy singleton so the client is only built once the env is present.
let docClient: DynamoDBDocumentClient | null = null;
function doc(): DynamoDBDocumentClient {
  if (!docClient) {
    docClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: region() }), {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return docClient;
}

const PK = { pledge: "PLEDGE", meta: "META", report: "REPORT", hidden: "HIDDEN", rl: "RL" } as const;

// Fixed-width timestamp so the sort key orders chronologically as a string.
function pledgeSk(ts: number, id: string): string {
  return `${String(ts).padStart(15, "0")}#${id}`;
}

type Cursor = Record<string, unknown>;

function encodeCursor(key: Cursor): string {
  return Buffer.from(JSON.stringify(key), "utf8").toString("base64url");
}
function decodeCursor(token: string | null): Cursor | undefined {
  if (!token) return undefined;
  try {
    return JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as Cursor;
  } catch {
    return undefined;
  }
}

function toPublic(item: Record<string, unknown>): WallPledge {
  return {
    id: item.id as string,
    commitmentId: item.commitmentId as string,
    name: (item.name as string | null) ?? null,
    roleId: item.roleId as string,
    region: (item.region as string | null) ?? null,
    ts: item.ts as number,
  };
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** A salted SHA-256 hash of the caller IP — used only as an ephemeral rate-limit key. */
export function clientIpHash(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "unknown";
  const ip = fwd.split(",")[0].trim();
  return createHash("sha256").update(`${ipSalt()}:${ip}`).digest("hex").slice(0, 24);
}

/** Fixed-window limiter backed by an atomic counter with a TTL. */
export async function rateLimit(ipHash: string, limit: number, windowSec: number): Promise<boolean> {
  const windowStart = Math.floor(Date.now() / 1000 / windowSec) * windowSec;
  const res = await doc().send(
    new UpdateCommand({
      TableName: tableName(),
      Key: { pk: PK.rl, sk: `${ipHash}#${windowStart}` },
      UpdateExpression: "ADD n :one SET expireAt = if_not_exists(expireAt, :ttl)",
      ExpressionAttributeValues: { ":one": 1, ":ttl": windowStart + windowSec },
      ReturnValues: "UPDATED_NEW",
    })
  );
  const n = (res.Attributes?.n as number | undefined) ?? 1;
  return n <= limit;
}

/** Persist a pledge and bump the running total. */
export async function putPledge(pledge: WallPledge): Promise<void> {
  await doc().send(
    new PutCommand({
      TableName: tableName(),
      Item: { pk: PK.pledge, sk: pledgeSk(pledge.ts, pledge.id), ...pledge },
    })
  );
  await doc().send(
    new UpdateCommand({
      TableName: tableName(),
      Key: { pk: PK.meta, sk: "COUNT" },
      UpdateExpression: "ADD n :one",
      ExpressionAttributeValues: { ":one": 1 },
    })
  );
}

export interface PledgePage {
  pledges: WallPledge[];
  total: number;
  nextCursor: string | null;
}

/** A page of the public wall, newest first, with hidden pledges filtered out. */
export async function listPledges(cursor: string | null, limit: number): Promise<PledgePage> {
  const res = await doc().send(
    new QueryCommand({
      TableName: tableName(),
      KeyConditionExpression: "pk = :p",
      ExpressionAttributeValues: { ":p": PK.pledge },
      ScanIndexForward: false,
      Limit: limit,
      ExclusiveStartKey: decodeCursor(cursor),
    })
  );
  const items = (res.Items ?? []) as Record<string, unknown>[];

  const hiddenRes = await doc().send(
    new QueryCommand({
      TableName: tableName(),
      KeyConditionExpression: "pk = :h",
      ExpressionAttributeValues: { ":h": PK.hidden },
      ProjectionExpression: "sk",
    })
  );
  const hidden = new Set((hiddenRes.Items ?? []).map((i) => i.sk as string));

  const meta = await doc().send(
    new GetCommand({ TableName: tableName(), Key: { pk: PK.meta, sk: "COUNT" } })
  );
  const total = (meta.Item?.n as number | undefined) ?? 0;

  const pledges = items.filter((i) => !hidden.has(i.id as string)).map(toPublic);
  const nextCursor = res.LastEvaluatedKey ? encodeCursor(res.LastEvaluatedKey) : null;
  return { pledges, total, nextCursor };
}

/** Record a report; returns the new count and hides the pledge past the threshold. */
export async function reportPledge(id: string): Promise<number> {
  const res = await doc().send(
    new UpdateCommand({
      TableName: tableName(),
      Key: { pk: PK.report, sk: id },
      UpdateExpression: "ADD reports :one",
      ExpressionAttributeValues: { ":one": 1 },
      ReturnValues: "UPDATED_NEW",
    })
  );
  const count = (res.Attributes?.reports as number | undefined) ?? 0;
  if (count >= HIDE_THRESHOLD) {
    await doc().send(
      new PutCommand({ TableName: tableName(), Item: { pk: PK.hidden, sk: id, ts: Date.now() } })
    );
  }
  return count;
}

export { randomUUID };
