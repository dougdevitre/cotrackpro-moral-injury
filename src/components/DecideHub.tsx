import { useState } from "react";
import { DECISION_GUIDES } from "../data/decisionGuides";
import { DECIDE } from "../content/copy";
import { GuideRunner } from "./GuideRunner";

export function DecideHub() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = DECISION_GUIDES.find((g) => g.id === activeId) ?? null;

  if (active) {
    return <GuideRunner guide={active} onExit={() => setActiveId(null)} />;
  }

  return (
    <div className="mi-fade">
      <p className="mi-kicker">{DECIDE.kicker}</p>
      <h1 className="mi-h1">{DECIDE.title}</h1>
      <p className="mi-lede">{DECIDE.lede}</p>
      <div className="mi-guide-list">
        {DECISION_GUIDES.map((g) => (
          <button key={g.id} className="mi-guide-item" onClick={() => setActiveId(g.id)}>
            <span className="mi-guide-title">{g.title}</span>
            <span className="mi-guide-blurb">{g.blurb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
