import { describe, expect, it } from "vitest";
import { POSTER_SIZES, wrapText } from "./poster";

/** Fake text measurer: 10px per character. Keeps the test free of a real canvas. */
const measure = (s: string) => s.length * 10;

describe("wrapText", () => {
  it("keeps a short line on one row", () => {
    expect(wrapText(measure, "do right", 1000)).toEqual(["do right"]);
  });

  it("wraps at the width boundary using whole words", () => {
    // 10px/char, maxWidth 100px = 10 chars. "alpha beta" (10 chars) fits exactly;
    // adding " gamma" overflows, so it breaks to a new line.
    const lines = wrapText(measure, "alpha beta gamma", 100);
    expect(lines).toEqual(["alpha beta", "gamma"]);
  });

  it("never splits a single over-long word", () => {
    const lines = wrapText(measure, "supercalifragilistic", 50);
    expect(lines).toEqual(["supercalifragilistic"]);
  });

  it("preserves explicit newlines as separate lines", () => {
    expect(wrapText(measure, "one\ntwo", 1000)).toEqual(["one", "two"]);
  });
});

describe("POSTER_SIZES", () => {
  it("defines square and story dimensions", () => {
    expect(POSTER_SIZES.square).toEqual({ w: 1080, h: 1080 });
    expect(POSTER_SIZES.story).toEqual({ w: 1080, h: 1920 });
  });
});
