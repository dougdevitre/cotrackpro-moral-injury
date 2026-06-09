import type { Reading, Role, Scores } from "../types";
import { bandOf } from "./scoring";

export function interpret(scores: Scores, role: Role | null): Reading {
  const { exposure, distress, sub } = scores;
  const eBand = bandOf(exposure);
  const dBand = bandOf(distress);
  const lens = role ? role.lens : "working within the family-law system";

  let lead: string;
  if (eBand.rank <= 1 && dBand.rank <= 1) {
    lead = "your responses point to a relatively light moral load right now. That is worth protecting.";
  } else if (eBand.rank >= 2 && dBand.rank <= 1) {
    lead =
      "you have been exposed to a meaningful amount of morally difficult work, but it is not (yet) sitting heavily on you. This is a common and fragile place — exposure does not have to become injury, and that is exactly the window where support and reflection help most.";
  } else if (eBand.rank <= 1 && dBand.rank >= 2) {
    lead =
      "even where the events you describe feel limited, they are weighing on you. Distress out of proportion to exposure is still real and still deserves care.";
  } else {
    lead =
      "your responses describe both significant exposure to morally injurious situations and a real personal weight from carrying them. This is the pattern the moral-injury literature takes most seriously.";
  }

  const driver = computeDriver(sub);

  return {
    lead: `As someone ${lens}, ${lead}`,
    driver,
    eBand,
    dBand,
  };
}

function computeDriver(sub: Scores["sub"]): string {
  const max = Math.max(sub.SELF, sub.WITNESS, sub.BETRAYAL);
  if (max < 50) return "";
  if (sub.SELF === max) {
    return "The heaviest part appears to be things you feel you did or allowed. That is hard to sit with — and it is also where you hold the most agency to respond.";
  }
  if (sub.BETRAYAL === max) {
    return "The heaviest part appears to be being failed or blocked by the system rather than your own choices. Moral injury here is an etiology of broken systems, not a personal verdict — naming that honestly is part of the repair (Talbot & Dean, 2018).";
  }
  if (sub.WITNESS === max) {
    return "The heaviest part appears to be what you have witnessed and could not stop. Bearing witness to harm is a recognized source of moral injury in its own right.";
  }
  return "";
}
