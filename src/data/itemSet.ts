import type { Item } from "../types";
import { CORE_ITEMS } from "./items";
import { ETHICS_ITEMS } from "./ethicsItems";
import { ruleById, type Rule } from "./rules";

/** All registered items (core + role-specific). */
const ALL_ITEMS: Item[] = [...CORE_ITEMS, ...ETHICS_ITEMS];

/**
 * Returns the ordered item set for a given role:
 *  - all core items (no `roles` field), plus
 *  - any role-specific items whose `roles` includes this role.
 * Order: SELF, WITNESS, BETRAYAL, DISTRESS (role-specific SELF/WITNESS appended
 * within their group so the flow reads naturally).
 */
export function itemsForRole(roleId: string | null): Item[] {
  const matches = ALL_ITEMS.filter((it) => !it.roles || (roleId !== null && it.roles.includes(roleId)));
  const order: Record<Item["sub"], number> = { SELF: 0, WITNESS: 1, BETRAYAL: 2, DISTRESS: 3 };
  return [...matches].sort((a, b) => {
    if (order[a.sub] !== order[b.sub]) return order[a.sub] - order[b.sub];
    // core items before role-specific within the same group
    const aCore = a.roles ? 1 : 0;
    const bCore = b.roles ? 1 : 0;
    return aCore - bCore;
  });
}

/** Unique ABA Model Rules referenced by a role's items, in rule order. */
export function relatedRulesForRole(roleId: string | null): Rule[] {
  const seen = new Set<string>();
  const rules: Rule[] = [];
  for (const it of itemsForRole(roleId)) {
    if (it.ruleId && !seen.has(it.ruleId)) {
      const r = ruleById(it.ruleId);
      if (r) {
        seen.add(it.ruleId);
        rules.push(r);
      }
    }
  }
  return rules;
}
