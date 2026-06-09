import { useState } from "react";
import type { CustomHabit, PracticePlan } from "../types";
import { LONG_VIEW_PATHWAYS, LONG_VIEW_EVIDENCE } from "../data/longView";
import { ruleById } from "../data/rules";
import { hasCustomHabit, pathwayToHabit } from "../lib/practice";
import { LONGVIEW } from "../content/copy";

interface Props {
  plan: PracticePlan;
  onAddHabit: (habit: CustomHabit) => void;
}

export function LongView({ plan, onAddHabit }: Props) {
  const [openId, setOpenId] = useState<string | null>(LONG_VIEW_PATHWAYS[0].id);

  return (
    <div className="mi-fade">
      <p className="mi-kicker">{LONGVIEW.kicker}</p>
      <h1 className="mi-h1">{LONGVIEW.title}</h1>
      <p className="mi-lede">{LONGVIEW.lede}</p>
      <p className="mi-count" style={{ marginBottom: 20 }}>
        {LONGVIEW.framing}
      </p>

      <div className="mi-lv-list">
        {LONG_VIEW_PATHWAYS.map((p) => {
          const open = openId === p.id;
          const rule = ruleById(p.ruleId);
          return (
            <div key={p.id} className={"mi-lv-item" + (open ? " open" : "")}>
              <button
                className="mi-lv-head"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : p.id)}
              >
                <span className="mi-lv-action">{p.action}</span>
                <span className="mi-lv-toggle" aria-hidden="true">
                  {open ? "–" : "+"}
                </span>
              </button>

              {open && (
                <div className="mi-lv-body mi-fade">
                  <div className="mi-lv-horizon">
                    <span className="mi-lv-htag">{LONGVIEW.horizonLabels.short}</span>
                    <p className="mi-lv-text">{p.shortTerm}</p>
                  </div>
                  <div className="mi-lv-horizon">
                    <span className="mi-lv-htag">{LONGVIEW.horizonLabels.mechanism}</span>
                    <p className="mi-lv-text">{p.mechanism}</p>
                  </div>
                  <div className="mi-lv-horizon">
                    <span className="mi-lv-htag">{LONGVIEW.horizonLabels.long}</span>
                    <p className="mi-lv-text">{p.longTerm}</p>
                  </div>

                  <div className="mi-lv-leverage">
                    <span className="mi-lv-htag accent">{LONGVIEW.leverageLabel}</span>
                    <p className="mi-lv-text">{p.leverage}</p>
                    {(() => {
                      const habit = pathwayToHabit(p);
                      const added = hasCustomHabit(plan, habit);
                      return (
                        <button
                          className={"mi-chip mi-lv-add" + (added ? " on" : "")}
                          disabled={added}
                          onClick={() => onAddHabit(habit)}
                        >
                          {added ? LONGVIEW.addedHabit : LONGVIEW.addHabit + " →"}
                        </button>
                      );
                    })()}
                  </div>

                  {rule && (
                    <a
                      className="mi-a mi-lv-rule"
                      href={rule.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Related standard: Rule {rule.id} — {rule.title} ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="mi-h2" style={{ fontSize: 20, marginTop: 34 }}>
        The evidence behind this
      </h2>
      <div className="mi-evidence">
        {LONG_VIEW_EVIDENCE.map((e) => (
          <a
            key={e.url}
            className="mi-evidence-item"
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mi-evidence-label">{e.label} ↗</span>
            <span className="mi-evidence-cite">{e.cite}</span>
          </a>
        ))}
      </div>

      <div className="mi-disc">{LONGVIEW.disclaimer}</div>
    </div>
  );
}
