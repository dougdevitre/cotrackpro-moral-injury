import { describe, it, expect } from "vitest";
import type { Answers, Item } from "../types";
import { bandOf, computeScores } from "./scoring";
import { interpret } from "./interpret";
import { buildTriage } from "./triage";
import { buildResultPayload, resultSchema } from "./schema";
import { roleById } from "../data/roles";
import { itemsForRole } from "../data/itemSet";

const items: Item[] = [
  { id: "s1", sub: "SELF", text: "" },
  { id: "s2", sub: "SELF", text: "" },
  { id: "w1", sub: "WITNESS", text: "" },
  { id: "w2", sub: "WITNESS", text: "" },
  { id: "b1", sub: "BETRAYAL", text: "" },
  { id: "b2", sub: "BETRAYAL", text: "" },
  { id: "d1", sub: "DISTRESS", text: "" },
  { id: "d2", sub: "DISTRESS", text: "" },
];

function answerAll(value: number): Answers {
  return Object.fromEntries(items.map((it) => [it.id, value]));
}

describe("bandOf", () => {
  it("maps the boundary values to the correct bands", () => {
    expect(bandOf(0).key).toBe("minimal");
    expect(bandOf(24).key).toBe("minimal");
    expect(bandOf(25).key).toBe("emerging");
    expect(bandOf(49).key).toBe("emerging");
    expect(bandOf(50).key).toBe("significant");
    expect(bandOf(74).key).toBe("significant");
    expect(bandOf(75).key).toBe("severe");
    expect(bandOf(100).key).toBe("severe");
  });

  it("assigns monotonically increasing ranks", () => {
    expect(bandOf(10).rank).toBeLessThan(bandOf(40).rank);
    expect(bandOf(40).rank).toBeLessThan(bandOf(60).rank);
    expect(bandOf(60).rank).toBeLessThan(bandOf(90).rank);
  });
});

describe("computeScores", () => {
  it("returns 0 for all-zero answers", () => {
    const s = computeScores(items, answerAll(0));
    expect(s.exposure).toBe(0);
    expect(s.distress).toBe(0);
  });

  it("returns 100 for all-max answers", () => {
    const s = computeScores(items, answerAll(4));
    expect(s.exposure).toBe(100);
    expect(s.distress).toBe(100);
    expect(s.sub.SELF).toBe(100);
  });

  it("EXCLUDES distress from the exposure index", () => {
    // distress maxed, exposure subscales zero -> exposure must be 0
    const answers: Answers = { s1: 0, s2: 0, w1: 0, w2: 0, b1: 0, b2: 0, d1: 4, d2: 4 };
    const s = computeScores(items, answers);
    expect(s.exposure).toBe(0);
    expect(s.distress).toBe(100);
  });

  it("normalizes a mid value correctly", () => {
    const s = computeScores(items, answerAll(2)); // 2 of 4 = 50
    expect(s.exposure).toBe(50);
    expect(s.distress).toBe(50);
  });

  it("ignores unanswered items without throwing", () => {
    const s = computeScores(items, { s1: 4 });
    expect(s.sub.SELF).toBe(100); // only answered SELF item counted
    expect(s.sub.WITNESS).toBe(0);
  });
});

describe("interpret", () => {
  it("uses the low/low lead when both indices are low", () => {
    const s = computeScores(items, answerAll(0));
    const r = interpret(s, roleById("attorney"));
    expect(r.lead).toContain("relatively light moral load");
    expect(r.eBand.key).toBe("minimal");
  });

  it("flags the system-driven driver when betrayal dominates", () => {
    const answers: Answers = { s1: 0, s2: 0, w1: 0, w2: 0, b1: 4, b2: 4, d1: 4, d2: 4 };
    const s = computeScores(items, answers);
    const r = interpret(s, roleById("gal"));
    expect(r.driver).toContain("broken systems");
  });

  it("flags the self driver when self-transgression dominates", () => {
    const answers: Answers = { s1: 4, s2: 4, w1: 0, w2: 0, b1: 0, b2: 0, d1: 2, d2: 2 };
    const s = computeScores(items, answers);
    const r = interpret(s, roleById("attorney"));
    expect(r.driver).toContain("agency");
  });

  it("includes the role lens", () => {
    const s = computeScores(items, answerAll(1));
    const r = interpret(s, roleById("judge"));
    expect(r.lead).toContain("deciding outcomes");
  });
});

describe("buildTriage", () => {
  it("always includes a peer-support card", () => {
    const s = computeScores(items, answerAll(0));
    const cards = buildTriage(s);
    expect(cards.some((c) => c.title.includes("understand the work"))).toBe(true);
  });

  it("adds ethics + repair cards when self-transgression is high", () => {
    const answers: Answers = { s1: 4, s2: 4, w1: 0, w2: 0, b1: 0, b2: 0, d1: 0, d2: 0 };
    const s = computeScores(items, answers);
    const cards = buildTriage(s);
    expect(cards.some((c) => c.tier === "ethics")).toBe(true);
    expect(cards.some((c) => c.tier === "repair")).toBe(true);
  });

  it("adds a systems card when betrayal is high and >= self", () => {
    const answers: Answers = { s1: 0, s2: 0, w1: 0, w2: 0, b1: 4, b2: 4, d1: 0, d2: 0 };
    const s = computeScores(items, answers);
    const cards = buildTriage(s);
    expect(cards.some((c) => c.tier === "systems")).toBe(true);
  });

  it("adds the crisis-adjacent support card when distress is high", () => {
    const answers: Answers = { s1: 0, s2: 0, w1: 0, w2: 0, b1: 0, b2: 0, d1: 4, d2: 4 };
    const s = computeScores(items, answers);
    const cards = buildTriage(s);
    expect(cards[0].title).toContain("Tend to yourself first");
  });
});

describe("buildResultPayload + schema", () => {
  it("produces a payload that validates against the zod schema", () => {
    const s = computeScores(items, answerAll(2));
    const r = interpret(s, roleById("attorney"));
    const payload = buildResultPayload(s, r, roleById("attorney"));
    const parsed = resultSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    expect(payload.role).toBe("attorney");
    expect(payload.indices.exposure).toBe(50);
  });
});

describe("itemsForRole", () => {
  it("includes attorney ethics items only for attorneys", () => {
    const attorneyItems = itemsForRole("attorney");
    const galItems = itemsForRole("gal");
    expect(attorneyItems.some((i) => i.id.startsWith("e_"))).toBe(true);
    expect(galItems.some((i) => i.id.startsWith("e_"))).toBe(false);
  });

  it("always includes the core distress items", () => {
    const galItems = itemsForRole("gal");
    expect(galItems.some((i) => i.id === "d1")).toBe(true);
  });
});
