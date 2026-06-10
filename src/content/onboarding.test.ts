import { describe, expect, it } from "vitest";
import { ONBOARDING, HOME } from "./copy";

describe("onboarding intents", () => {
  const moduleViews = new Set(HOME.cards.map((c) => c.view));

  it("every intent routes to a real module view", () => {
    for (const intent of ONBOARDING.intents) {
      expect(moduleViews.has(intent.view)).toBe(true);
    }
  });

  it("intent ids are unique", () => {
    const ids = ONBOARDING.intents.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
