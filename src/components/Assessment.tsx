import type { Answers, Item } from "../types";
import { SUB_META } from "../content/copy";
import { DISTRESS_OPTIONS, EXPOSURE_OPTIONS } from "../content/config";

interface Props {
  items: Item[];
  index: number;
  answers: Answers;
  onAnswer: (value: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Assessment({ items, index, answers, onAnswer, onPrev, onNext }: Props) {
  const current = items[index];
  const answered = typeof answers[current.id] === "number";
  const opts = current.sub === "DISTRESS" ? DISTRESS_OPTIONS : EXPOSURE_OPTIONS;
  const progress = Math.round(((index + (answered ? 1 : 0)) / items.length) * 100);
  const isLast = index === items.length - 1;

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // Number keys 1..N select the corresponding option.
    const n = Number(e.key);
    if (!Number.isNaN(n) && n >= 1 && n <= opts.length) {
      e.preventDefault();
      onAnswer(n - 1);
      return;
    }
    const cur = typeof answers[current.id] === "number" ? answers[current.id] : -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onAnswer(Math.min(opts.length - 1, cur + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onAnswer(Math.max(0, cur < 0 ? 0 : cur - 1));
    }
  }

  // Roving tabindex: the selected option (or the first) is the tab stop.
  const selected = typeof answers[current.id] === "number" ? answers[current.id] : 0;

  return (
    <div>
      <div className="mi-prog">
        <i style={{ width: `${progress}%` }} />
      </div>
      <div className="mi-fade" key={current.id}>
        <p className="mi-section-tag">{SUB_META[current.sub].label}</p>
        <p className="mi-count">{SUB_META[current.sub].note}</p>
        <p className="mi-q" id={`q-${current.id}`}>
          {current.text}
        </p>
        <div
          className="mi-scale"
          role="radiogroup"
          aria-labelledby={`q-${current.id}`}
          onKeyDown={onKeyDown}
        >
          {opts.map((o, i) => (
            <button
              key={i}
              role="radio"
              aria-checked={answers[current.id] === i}
              tabIndex={i === selected ? 0 : -1}
              className={"mi-opt" + (answers[current.id] === i ? " sel" : "")}
              onClick={() => onAnswer(i)}
            >
              {o}
            </button>
          ))}
        </div>
        <p className="mi-hint">Tip: press 1–{opts.length} or use arrow keys.</p>
        <div className="mi-navrow">
          <button className="mi-btn ghost" onClick={onPrev}>
            Back
          </button>
          <span className="mi-count">
            {index + 1} / {items.length}
          </span>
          <button className="mi-btn" disabled={!answered} onClick={onNext}>
            {isLast ? "See reflection" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
