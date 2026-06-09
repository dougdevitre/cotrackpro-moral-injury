import { describe, it, expect } from "vitest";
import { RULES, ruleById, CATEGORY_ORDER, rulesByCategory } from "./rules";
import { ETHICS_ITEMS } from "./ethicsItems";
import { relatedRulesForRole } from "./itemSet";

describe("RULES catalog", () => {
  it("has unique rule ids", () => {
    const ids = RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses well-formed official ABA URLs for every rule", () => {
    const base =
      "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_";
    for (const r of RULES) {
      expect(r.url.startsWith(base)).toBe(true);
      expect(r.url.endsWith("/")).toBe(true);
      // slug major/minor should match the rule id (e.g. "3.3" -> "rule_3_3_")
      const [maj, min] = r.id.split(".");
      expect(r.url).toContain(`/rule_${maj}_${min}_`);
    }
  });

  it("assigns every rule to a known category", () => {
    for (const r of RULES) {
      expect(CATEGORY_ORDER).toContain(r.category);
    }
  });

  it("partitions cleanly by category", () => {
    const total = CATEGORY_ORDER.reduce((n, c) => n + rulesByCategory(c).length, 0);
    expect(total).toBe(RULES.length);
  });
});

describe("ethics item rule references", () => {
  it("every ruleId on an item resolves to a real rule", () => {
    for (const it of ETHICS_ITEMS) {
      if (it.ruleId) {
        expect(ruleById(it.ruleId), `item ${it.id} -> rule ${it.ruleId}`).toBeDefined();
      }
    }
  });
});

describe("relatedRulesForRole", () => {
  it("returns a de-duplicated, resolved set for attorneys", () => {
    const rules = relatedRulesForRole("attorney");
    expect(rules.length).toBeGreaterThan(0);
    const ids = rules.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length); // de-duplicated (3.1 and 3.3 each appear twice in items)
    expect(ids).toContain("3.3");
  });

  it("returns nothing for roles without rule-tagged items", () => {
    expect(relatedRulesForRole("gal")).toEqual([]);
  });
});
