import { describe, it, expect } from "vitest";
import {
  hasProfanity,
  sanitizeName,
  validatePledgeInput,
  NAME_MAX,
  VALID_COMMITMENT_IDS,
  VALID_ROLE_IDS,
} from "./pledge";

const good = {
  consent: true,
  commitmentId: "pause",
  name: "Sam",
  roleId: "attorney",
  region: "Europe",
};

describe("sanitizeName", () => {
  it("returns null for empty / whitespace", () => {
    expect(sanitizeName(undefined)).toBeNull();
    expect(sanitizeName("   ")).toBeNull();
  });
  it("keeps letters, spaces, hyphens, apostrophes and strips the rest", () => {
    expect(sanitizeName("  Mary-Jane  O'Neil 123!@#  ")).toBe("Mary-Jane O'Neil");
  });
  it("strips markup characters so no tag can survive", () => {
    expect(sanitizeName("<script>alert</script>")).not.toMatch(/[<>/]/);
  });
  it("caps length", () => {
    const long = "a".repeat(100);
    expect(sanitizeName(long)?.length).toBe(NAME_MAX);
  });
});

describe("hasProfanity", () => {
  it("flags profane substrings case-insensitively", () => {
    expect(hasProfanity("SHIThead")).toBe(true);
    expect(hasProfanity("Jordan")).toBe(false);
  });
});

describe("validatePledgeInput", () => {
  it("accepts a well-formed submission", () => {
    const r = validatePledgeInput(good);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.commitmentId).toBe("pause");
      expect(r.value.name).toBe("Sam");
      expect(r.value.region).toBe("Europe");
    }
  });

  it("requires explicit consent", () => {
    expect(validatePledgeInput({ ...good, consent: false }).ok).toBe(false);
    expect(validatePledgeInput({ ...good, consent: undefined }).ok).toBe(false);
  });

  it("rejects unknown commitment and role ids", () => {
    expect(validatePledgeInput({ ...good, commitmentId: "nope" }).ok).toBe(false);
    expect(validatePledgeInput({ ...good, roleId: "wizard" }).ok).toBe(false);
  });

  it("treats name as optional and 'Prefer not to say' as no region", () => {
    const r = validatePledgeInput({ ...good, name: undefined, region: "Prefer not to say" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBeNull();
      expect(r.value.region).toBeNull();
    }
  });

  it("rejects an out-of-list region", () => {
    expect(validatePledgeInput({ ...good, region: "Atlantis" }).ok).toBe(false);
  });

  it("rejects a profane name", () => {
    expect(validatePledgeInput({ ...good, name: "shitlord" }).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(validatePledgeInput(null).ok).toBe(false);
    expect(validatePledgeInput("hi").ok).toBe(false);
  });

  it("never carries fields beyond the privacy contract", () => {
    const r = validatePledgeInput({ ...good, scores: { exposure: 90 }, note: "secret" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(Object.keys(r.value).sort()).toEqual(["commitmentId", "name", "region", "roleId"]);
    }
  });
});

describe("catalog sets", () => {
  it("are derived from the real data", () => {
    expect(VALID_COMMITMENT_IDS.has("pause")).toBe(true);
    expect(VALID_ROLE_IDS.has("attorney")).toBe(true);
    expect(VALID_ROLE_IDS.size).toBeGreaterThan(5);
  });
});
