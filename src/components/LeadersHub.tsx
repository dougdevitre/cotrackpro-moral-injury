import { useEffect, useMemo, useState } from "react";
import { LEADERS } from "../content/copy";
import { CLIMATE_DIMS, dimLabel, scoreClimate, type ClimateBandKey } from "../lib/climate";
import { todayISO } from "../lib/streak";
import { saveClimateSignal } from "../lib/storage";
import { openPrintable } from "../lib/print/layout";
import { buildLeaderPledgeHtml, buildMoralDebriefHtml } from "../lib/print/documents";

const BAND_CLASS: Record<ClimateBandKey, string> = {
  strong: "strong",
  mixed: "mixed",
  "at-risk": "atrisk",
};

export function LeadersHub({ onToast }: { onToast: (msg: string) => void }) {
  const C = LEADERS.climate;
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [checked, setChecked] = useState<boolean[]>(() => LEADERS.pledge.map(() => true));

  const allAnswered = C.items.every((it) => answers[it.id] !== undefined);
  const result = useMemo(
    () => (allAnswered ? scoreClimate(C.items, answers) : null),
    [allAnswered, answers, C.items]
  );

  // Leave behind a non-personal climate signal (aggregate score only) so the
  // calculator can suggest an achievable protective reduction. No item answers.
  useEffect(() => {
    if (result) {
      saveClimateSignal({ overall: result.overall, lowest: result.lowest, dateISO: todayISO() });
    }
  }, [result]);

  function printPledge() {
    const pledges = LEADERS.pledge.filter((_, i) => checked[i]);
    if (pledges.length === 0) return;
    openPrintable(
      buildLeaderPledgeHtml({ name, dateISO: todayISO(), pledges }),
      "leaders-pledge.html"
    );
    onToast("Opening your pledge to print");
  }

  function printDebrief() {
    openPrintable(buildMoralDebriefHtml({ dateISO: todayISO(), ...LEADERS.debrief }), "moral-debrief-guide.html");
    onToast("Opening the debrief guide");
  }

  return (
    <div className="mi-leaders mi-fade">
      <p className="mi-kicker">{LEADERS.kicker}</p>
      <h1 className="mi-h1">{LEADERS.title}</h1>
      <p className="mi-lede">{LEADERS.lede}</p>

      {/* Climate check */}
      <section className="mi-section">
        <h2 className="mi-h2">{C.title}</h2>
        <p className="mi-section-lede">{C.lede}</p>

        <ol className="mi-climate-items">
          {C.items.map((it) => (
            <li key={it.id} className="mi-climate-item">
              <span className="mi-climate-text">{it.text}</span>
              <div className="mi-scale" role="group" aria-label={it.text}>
                {C.scale.map((label, v) => (
                  <button
                    key={v}
                    type="button"
                    className={"mi-scale-btn" + (answers[it.id] === v ? " active" : "")}
                    aria-pressed={answers[it.id] === v}
                    aria-label={label}
                    title={label}
                    onClick={() => setAnswers((a) => ({ ...a, [it.id]: v }))}
                  >
                    {v + 1}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <p className="mi-scale-legend">
          1 = {C.scale[0]} · 5 = {C.scale[4]}
        </p>

        {result && (
          <div className={"mi-climate-result " + BAND_CLASS[result.band.key]}>
            <div className="mi-climate-result-head">
              <span className="mi-climate-result-title">{C.resultTitle}</span>
              <span className="mi-climate-band">{result.band.label}</span>
            </div>
            <div className="mi-climate-bars">
              {CLIMATE_DIMS.map((d) => (
                <div key={d.key} className="mi-climate-bar">
                  <div className="mi-climate-bar-head">
                    <span>{d.label}</span>
                    <span className="mi-climate-pct">{result.perDim[d.key]}</span>
                  </div>
                  <div className="mi-climate-track">
                    <div
                      className="mi-climate-fill"
                      style={{ width: `${result.perDim[d.key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mi-climate-read">{C.bandRead[result.band.key]}</p>
            <p className="mi-climate-move">
              <strong>First move — {dimLabel(result.lowest)}:</strong> {C.dimMove[result.lowest]}
            </p>
            <button
              type="button"
              className="mi-link-btn"
              onClick={() => setAnswers({})}
            >
              {C.retake}
            </button>
          </div>
        )}
      </section>

      {/* Playbook */}
      <section className="mi-section">
        <h2 className="mi-h2">{LEADERS.playbookTitle}</h2>
        <div className="mi-playbook">
          {LEADERS.playbook.map((s) => (
            <div key={s.id} className="mi-play">
              <h3 className="mi-play-title">{s.title}</h3>
              <ul className="mi-play-list">
                {s.practices.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Leader's pledge */}
      <section className="mi-section">
        <h2 className="mi-h2">{LEADERS.pledgeTitle}</h2>
        <p className="mi-section-lede">{LEADERS.pledgeLede}</p>
        <ul className="mi-pledge-list">
          {LEADERS.pledge.map((p, i) => (
            <li key={p} className="mi-pledge-item">
              <label>
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={() =>
                    setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)))
                  }
                />
                <span>{p}</span>
              </label>
            </li>
          ))}
        </ul>
        <label className="mi-field mi-pledge-name">
          <span className="mi-field-label">{LEADERS.pledgeNameLabel}</span>
          <input
            className="mi-select"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </label>
        <button
          type="button"
          className="mi-btn"
          onClick={printPledge}
          disabled={!checked.some(Boolean)}
        >
          {LEADERS.pledgePrint}
        </button>
      </section>

      {/* Toolkit */}
      <section className="mi-section">
        <h2 className="mi-h2">{LEADERS.toolkitsTitle}</h2>
        <button type="button" className="mi-btn ghost" onClick={printDebrief}>
          {LEADERS.debriefPrint}
        </button>
      </section>
    </div>
  );
}
