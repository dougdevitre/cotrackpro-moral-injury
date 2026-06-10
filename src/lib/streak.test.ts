import { describe, expect, it } from "vitest";
import {
  EMPTY_STREAK,
  currentStreak,
  dayDiff,
  isDoneToday,
  markDone,
  todayISO,
} from "./streak";

describe("dayDiff", () => {
  it("counts calendar days, including across a month boundary", () => {
    expect(dayDiff("2026-06-10", "2026-06-11")).toBe(1);
    expect(dayDiff("2026-01-31", "2026-02-01")).toBe(1);
    expect(dayDiff("2026-06-10", "2026-06-10")).toBe(0);
    expect(dayDiff("2026-06-11", "2026-06-10")).toBe(-1);
  });
});

describe("markDone", () => {
  it("starts a streak at 1", () => {
    expect(markDone(EMPTY_STREAK, "2026-06-10")).toEqual({
      lastDoneISO: "2026-06-10",
      count: 1,
      longest: 1,
    });
  });

  it("increments on a consecutive day and tracks longest", () => {
    const a = markDone(EMPTY_STREAK, "2026-06-10");
    const b = markDone(a, "2026-06-11");
    expect(b).toEqual({ lastDoneISO: "2026-06-11", count: 2, longest: 2 });
  });

  it("is a no-op when already logged today", () => {
    const a = markDone(EMPTY_STREAK, "2026-06-10");
    expect(markDone(a, "2026-06-10")).toBe(a);
  });

  it("resets to 1 after a missed day but preserves longest", () => {
    let s = markDone(EMPTY_STREAK, "2026-06-10");
    s = markDone(s, "2026-06-11"); // count 2, longest 2
    s = markDone(s, "2026-06-14"); // gap -> reset
    expect(s).toEqual({ lastDoneISO: "2026-06-14", count: 1, longest: 2 });
  });
});

describe("currentStreak / isDoneToday", () => {
  it("keeps the streak live if last log was yesterday", () => {
    const s = markDone(EMPTY_STREAK, "2026-06-09");
    expect(currentStreak(s, "2026-06-10")).toBe(1);
    expect(isDoneToday(s, "2026-06-10")).toBe(false);
  });

  it("shows the streak as lapsed after two idle days", () => {
    const s = markDone(EMPTY_STREAK, "2026-06-08");
    expect(currentStreak(s, "2026-06-10")).toBe(0);
  });
});

describe("todayISO", () => {
  it("formats as zero-padded YYYY-MM-DD", () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
