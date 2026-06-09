import { useState } from "react";
import type { DecisionGuide } from "../types";

interface Props {
  guide: DecisionGuide;
  onExit: () => void;
}

export function GuideRunner({ guide, onExit }: Props) {
  const [step, setStep] = useState(0);
  // Ephemeral, in-memory only — notes are never stored or transmitted.
  const [notes, setNotes] = useState<string[]>(() => guide.steps.map(() => ""));
  const done = step >= guide.steps.length;

  function setNote(value: string) {
    setNotes((n) => n.map((v, i) => (i === step ? value : v)));
  }

  const progress = Math.round(((done ? guide.steps.length : step) / guide.steps.length) * 100);

  return (
    <div className="mi-fade">
      <button className="mi-back-link" onClick={onExit}>
        ← All guides
      </button>
      <p className="mi-kicker" style={{ marginTop: 14 }}>
        {guide.title}
      </p>

      <div className="mi-prog" style={{ marginTop: 12 }}>
        <i style={{ width: `${progress}%` }} />
      </div>

      {!done && (
        <div className="mi-fade" key={step}>
          <p className="mi-section-tag">
            Step {step + 1} of {guide.steps.length}
          </p>
          <p className="mi-q">{guide.steps[step].prompt}</p>
          {guide.steps[step].helper && <p className="mi-p">{guide.steps[step].helper}</p>}
          <textarea
            className="mi-textarea"
            placeholder="Optional — think it through here. Nothing is saved."
            value={notes[step]}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
          <div className="mi-navrow">
            <button
              className="mi-btn ghost"
              onClick={() => (step === 0 ? onExit() : setStep(step - 1))}
            >
              Back
            </button>
            <button className="mi-btn" onClick={() => setStep(step + 1)}>
              {step === guide.steps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}

      {done && (
        <div className="mi-fade">
          <p className="mi-section-tag">Where that leaves you</p>
          <div className="mi-card">
            <p className="mi-p" style={{ marginBottom: 0 }}>
              {guide.closing}
            </p>
          </div>
          <div className="mi-disc">{guide.source}</div>
          <div className="mi-navrow" style={{ justifyContent: "flex-start", gap: 12 }}>
            <button className="mi-btn" onClick={onExit}>
              Back to guides
            </button>
            <button
              className="mi-btn ghost"
              onClick={() => {
                setStep(0);
                setNotes(guide.steps.map(() => ""));
              }}
            >
              Run it again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
