import { useMemo, useState } from "react";
import type { Habit, PracticePlan, ScoreProfile } from "../types";
import { HABITS, CUE_SUGGESTIONS } from "../data/habits";
import { PRACTICE } from "../content/copy";
import {
  buildIcs,
  buildPlanMarkdown,
  isPlanEmpty,
  planIntentions,
  suggestHabits,
} from "../lib/practice";

interface Props {
  profile: ScoreProfile | null;
  plan: PracticePlan;
  setPlan: (updater: (p: PracticePlan) => PracticePlan) => void;
  persist: boolean;
  setPersist: (on: boolean) => void;
  onToast: (msg: string) => void;
}

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function PracticeHub({ profile, plan, setPlan, persist, setPersist, onToast }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [cue, setCue] = useState("");
  const [then, setThen] = useState("");
  const [commitment, setCommitment] = useState("");

  const suggested = useMemo(() => suggestHabits(profile, 6), [profile]);
  const intentions = planIntentions(plan);
  const empty = isPlanEmpty(plan);

  const has = (id: string) => plan.habitIds.includes(id);
  function toggleHabit(id: string) {
    setPlan((p) => ({
      ...p,
      habitIds: p.habitIds.includes(id)
        ? p.habitIds.filter((x) => x !== id)
        : [...p.habitIds, id],
    }));
  }
  function addCustom() {
    const c = cue.trim();
    const t = then.trim();
    if (!c || !t) return;
    setPlan((p) => ({ ...p, customHabits: [...p.customHabits, { cue: c, then: t }] }));
    setCue("");
    setThen("");
  }
  function removeCustom(i: number) {
    setPlan((p) => ({ ...p, customHabits: p.customHabits.filter((_, idx) => idx !== i) }));
  }
  function addCommitment() {
    const c = commitment.trim();
    if (!c) return;
    setPlan((p) => ({ ...p, commitments: [...p.commitments, c] }));
    setCommitment("");
  }
  function removeCommitment(i: number) {
    setPlan((p) => ({ ...p, commitments: p.commitments.filter((_, idx) => idx !== i) }));
  }

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(buildPlanMarkdown(plan));
      onToast("Plan copied");
    } catch {
      onToast("Copy failed — try the download instead");
    }
  }

  const habitCard = (h: Habit, compact = false) => (
    <div key={h.id} className={"mi-habit" + (has(h.id) ? " added" : "")}>
      <div className="mi-habit-text">
        <span className="mi-habit-cue">{h.cue},</span> <span className="mi-habit-then">then {h.then}.</span>
        {!compact && <span className="mi-habit-why">{h.why}</span>}
      </div>
      <button
        className={"mi-chip" + (has(h.id) ? " on" : "")}
        aria-pressed={has(h.id)}
        onClick={() => toggleHabit(h.id)}
      >
        {has(h.id) ? "Added ✓" : "Add"}
      </button>
    </div>
  );

  return (
    <div className="mi-fade">
      <p className="mi-kicker">{PRACTICE.kicker}</p>
      <h1 className="mi-h1">{PRACTICE.title}</h1>
      <p className="mi-lede">{PRACTICE.lede}</p>

      {profile && (
        <p className="mi-count" style={{ marginBottom: 18 }}>
          Tailored to your reflection — suggestions below lead with what weighed most.
        </p>
      )}

      {/* Suggested habits */}
      <h2 className="mi-h2" style={{ fontSize: 20 }}>
        {profile ? "Suggested for you" : "A few to start with"}
      </h2>
      <div className="mi-habit-group">{suggested.map((h) => habitCard(h))}</div>

      <button className="mi-link" onClick={() => setShowAll((s) => !s)} style={{ marginTop: 4 }}>
        {showAll ? "Hide full library" : "Browse the full library"}
      </button>
      {showAll && <div className="mi-habit-group" style={{ marginTop: 14 }}>{HABITS.map((h) => habitCard(h, true))}</div>}

      {/* If-then builder */}
      <hr className="mi-rule" />
      <h2 className="mi-h2" style={{ fontSize: 20 }}>
        Write your own if-then
      </h2>
      <p className="mi-p">Tie a high-pressure moment to a concrete next action.</p>
      <label className="mi-label" htmlFor="cue">
        When / if this happens…
      </label>
      <input
        id="cue"
        className="mi-input"
        list="cue-suggestions"
        value={cue}
        onChange={(e) => setCue(e.target.value)}
        placeholder="When billing pressure tempts me to prolong a matter"
      />
      <datalist id="cue-suggestions">
        {CUE_SUGGESTIONS.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <label className="mi-label" htmlFor="then">
        …then I will:
      </label>
      <input
        id="then"
        className="mi-input"
        value={then}
        onChange={(e) => setThen(e.target.value)}
        placeholder="I will name the pressure before I act"
      />
      <div style={{ marginTop: 12 }}>
        <button className="mi-btn" onClick={addCustom} disabled={!cue.trim() || !then.trim()}>
          Add to plan
        </button>
      </div>

      {/* Commitments */}
      <hr className="mi-rule" />
      <h2 className="mi-h2" style={{ fontSize: 20 }}>
        Standing commitments
      </h2>
      <p className="mi-p">Short lines you want to hold yourself to.</p>
      <div className="mi-inline-add">
        <input
          className="mi-input"
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCommitment()}
          placeholder="Center the child in every filing"
        />
        <button className="mi-btn" onClick={addCommitment} disabled={!commitment.trim()}>
          Add
        </button>
      </div>

      {/* Plan summary */}
      <hr className="mi-rule" />
      <h2 className="mi-h2">Your plan</h2>
      {empty ? (
        <p className="mi-p">{PRACTICE.emptyState}</p>
      ) : (
        <div className="mi-card">
          {plan.commitments.length > 0 && (
            <>
              <p className="mi-section-tag">Commitments</p>
              <ul className="mi-plan-list">
                {plan.commitments.map((c, i) => (
                  <li key={i}>
                    {c}
                    <button className="mi-x" aria-label="Remove" onClick={() => removeCommitment(i)}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {intentions.length > 0 && (
            <>
              <p className="mi-section-tag" style={{ marginTop: 16 }}>
                If-then habits
              </p>
              <ul className="mi-plan-list">
                {plan.habitIds.map((id) => {
                  const h = HABITS.find((x) => x.id === id);
                  return h ? (
                    <li key={id}>
                      {h.cue}, then {h.then}.
                      <button className="mi-x" aria-label="Remove" onClick={() => toggleHabit(id)}>
                        ×
                      </button>
                    </li>
                  ) : null;
                })}
                {plan.customHabits.map((c, i) => (
                  <li key={`c-${i}`}>
                    {c.cue}, then {c.then}.
                    <button className="mi-x" aria-label="Remove" onClick={() => removeCustom(i)}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Export + persistence */}
      {!empty && (
        <div className="mi-navrow" style={{ justifyContent: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <button className="mi-btn" onClick={copyPlan}>
            Copy
          </button>
          <button
            className="mi-btn ghost"
            onClick={() => download("ethics-practice-plan.md", buildPlanMarkdown(plan), "text/markdown")}
          >
            Download .md
          </button>
          <button
            className="mi-btn ghost"
            onClick={() => download("ethics-check-in.ics", buildIcs(plan), "text/calendar")}
          >
            Add weekly reminder (.ics)
          </button>
        </div>
      )}

      <label className="mi-toggle">
        <input type="checkbox" checked={persist} onChange={(e) => setPersist(e.target.checked)} />
        <span>Keep this plan on this device</span>
      </label>
      <p className="mi-foot">{PRACTICE.privacyNote}</p>
      <div className="mi-disc">{PRACTICE.grounding}</div>
    </div>
  );
}
