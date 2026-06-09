import type { Scores, TriageCard } from "../types";

/**
 * Builds the triage cards from the score profile.
 * Order matters: support-first, then ethics/repair (self-driven),
 * then systems (constraint-driven), then a closing reconnect card.
 */
export function buildTriage(scores: Scores): TriageCard[] {
  const { sub, distress, exposure } = scores;
  const highDistress = distress >= 50;
  const highSelf = sub.SELF >= 50;
  const systemDriven = sub.BETRAYAL >= 50 && sub.BETRAYAL >= sub.SELF;
  const anyLoad = exposure >= 25 || distress >= 25;

  const cards: TriageCard[] = [];

  if (highDistress) {
    cards.push({
      tier: "support",
      title: "Tend to yourself first",
      body: "The weight you are describing is significant. Consider talking with a therapist familiar with moral injury or occupational trauma — this is different from ordinary burnout and responds to different support. If the distress is acute, reach out today rather than waiting.",
    });
  }

  cards.push({
    tier: "support",
    title: "Find people who understand the work",
    body: "Isolation deepens moral injury; connection blunts it. A trusted peer, a supervision or consultation group, or a professional wellness program can help you say the unsayable parts out loud without judgment.",
  });

  if (highSelf) {
    cards.push({
      tier: "ethics",
      title: "Get clarity on the conduct itself",
      body: "Where your own actions are part of the weight, a confidential ethics consultation (a bar ethics hotline, a licensing-board advisory line, or your professional association) can help you separate genuine wrongdoing from ordinary hard calls, and identify what, if anything, calls for correction.",
    });
    cards.push({
      tier: "repair",
      title: "A repair pathway — if and when you choose it",
      body: "Reconciliation is yours to define and is never owed to a quiz. For some, repair means changing how they practice going forward; for others, acknowledgment, restitution, or a direct amends where it is safe and appropriate. Done well, it centers the affected child or family, not your relief. Move at the pace that is honest, and consider doing this with guidance.",
    });
  }

  if (systemDriven) {
    cards.push({
      tier: "systems",
      title: "Push on the system, not just yourself",
      body: "When the heaviest part is constraint and betrayal, taking on all of it as personal failure is both inaccurate and corrosive. Document the patterns, raise them through the channels that exist, and connect with reform-minded colleagues. Changing conditions is a legitimate response to moral injury — often the most durable one.",
    });
  }

  if (anyLoad) {
    cards.push({
      tier: "support",
      title: "Reconnect with why you started",
      body: "Moral injury frays the link between your work and your values. A short, regular practice — reflective writing, supervision, spiritual or contemplative practice if that is yours — can help you metabolize what you carry instead of storing it.",
    });
  }

  return cards;
}
