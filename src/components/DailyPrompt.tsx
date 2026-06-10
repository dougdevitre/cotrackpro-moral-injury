import { useState } from "react";
import { DAILY } from "../content/copy";
import {
  EMPTY_STREAK,
  currentStreak,
  dayDiff,
  isDoneToday,
  markDone,
  todayISO,
} from "../lib/streak";
import { loadStreak, saveStreak } from "../lib/storage";

export function DailyPrompt({ onToast }: { onToast: (msg: string) => void }) {
  const today = todayISO();
  const [streak, setStreak] = useState(() => loadStreak() ?? EMPTY_STREAK);

  // Deterministic prompt-of-the-day (same for everyone, rotates daily).
  const len = DAILY.prompts.length;
  const idx = ((dayDiff("1970-01-01", today) % len) + len) % len;
  const prompt = DAILY.prompts[idx];

  const done = isDoneToday(streak, today);
  const current = currentStreak(streak, today);

  function handleDone() {
    const next = markDone(streak, today);
    setStreak(next);
    saveStreak(next);
    onToast(DAILY.doneState);
  }

  return (
    <section className="mi-daily" aria-label="Daily reflection">
      <div className="mi-daily-head">
        <span className="mi-daily-kick">{DAILY.kicker}</span>
        {current > 0 ? (
          <span className="mi-daily-streak" title="Consecutive days reflected">
            🔥 {current}-day streak
          </span>
        ) : (
          <span className="mi-daily-streak muted">{DAILY.streakStart}</span>
        )}
      </div>
      <p className="mi-daily-prompt">{prompt}</p>
      <button
        type="button"
        className={"mi-daily-btn" + (done ? " done" : "")}
        onClick={handleDone}
        disabled={done}
      >
        {done ? `✓ ${DAILY.doneState}` : DAILY.done}
      </button>
    </section>
  );
}
