import { useState } from "react";
import type { MoralWin } from "../types";
import { ENCOURAGE } from "../content/copy";
import { hasConsent, loadWins, saveWins, setConsent } from "../lib/storage";
import { dayDiff, todayISO } from "../lib/streak";
import { buildMoralWinsHtml } from "../lib/print/documents";
import { openPrintable } from "../lib/print/layout";

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function EncourageHub({ onToast }: { onToast: (msg: string) => void }) {
  const [wins, setWins] = useState<MoralWin[]>(() => loadWins());
  const [draft, setDraft] = useState("");
  const [consented, setConsented] = useState<boolean>(() => hasConsent());

  // A steady affirmation for the day.
  const aff = ENCOURAGE.affirmations;
  const affIdx = ((dayDiff("1970-01-01", todayISO()) % aff.length) + aff.length) % aff.length;

  function addWin() {
    const text = draft.trim();
    if (!text) return;
    const next = [{ id: newId(), text, dateISO: todayISO() }, ...wins];
    setWins(next);
    setDraft("");
    saveWins(next);
    onToast(ENCOURAGE.winsLogged);
  }

  function removeWin(id: string) {
    const next = wins.filter((w) => w.id !== id);
    setWins(next);
    saveWins(next);
    onToast(ENCOURAGE.winsRemoved);
  }

  function enableSaving() {
    setConsent(true);
    setConsented(true);
    saveWins(wins);
    onToast(ENCOURAGE.winsKept);
  }

  function printWins() {
    openPrintable(
      buildMoralWinsHtml({ dateISO: todayISO(), wins: wins.map((w) => ({ text: w.text, dateISO: w.dateISO })) }),
      "my-moral-wins.html"
    );
  }

  return (
    <div className="mi-encourage mi-fade">
      <p className="mi-kicker">{ENCOURAGE.kicker}</p>
      <h1 className="mi-h1">{ENCOURAGE.title}</h1>
      <p className="mi-lede">{ENCOURAGE.lede}</p>

      <p className="mi-affirm">{aff[affIdx]}</p>

      {/* Moral wins */}
      <section className="mi-wins">
        <h2 className="mi-h2">{ENCOURAGE.winsTitle}</h2>
        <p className="mi-section-lede">{ENCOURAGE.winsLede}</p>

        <div className="mi-wins-entry">
          <textarea
            className="mi-wins-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={ENCOURAGE.winsPlaceholder}
            rows={2}
          />
          <button type="button" className="mi-btn" onClick={addWin} disabled={!draft.trim()}>
            {ENCOURAGE.winsAdd}
          </button>
        </div>

        {wins.length === 0 ? (
          <p className="mi-wins-empty">{ENCOURAGE.winsEmpty}</p>
        ) : (
          <>
            <ul className="mi-wins-list">
              {wins.map((w) => (
                <li key={w.id} className="mi-win">
                  <span className="mi-win-dot" aria-hidden="true" />
                  <span className="mi-win-text">
                    {w.text}
                    <span className="mi-win-date">{fmtDate(w.dateISO)}</span>
                  </span>
                  <button
                    type="button"
                    className="mi-win-remove"
                    onClick={() => removeWin(w.id)}
                    aria-label={ENCOURAGE.winsRemove}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="mi-wins-actions">
              <button type="button" className="mi-btn ghost" onClick={printWins}>
                {ENCOURAGE.winsPrint}
              </button>
              {consented ? (
                <span className="mi-wins-kept">✓ {ENCOURAGE.winsKept}</span>
              ) : (
                <button type="button" className="mi-link-btn" onClick={enableSaving}>
                  {ENCOURAGE.winsKeep}
                </button>
              )}
            </div>
          </>
        )}
      </section>

      {/* Exemplars */}
      <section className="mi-section">
        <h2 className="mi-h2">{ENCOURAGE.exemplarsTitle}</h2>
        <div className="mi-exemplars">
          {ENCOURAGE.exemplars.map((ex) => (
            <figure key={ex.role} className="mi-exemplar">
              <blockquote className="mi-exemplar-text">{ex.text}</blockquote>
              <figcaption className="mi-exemplar-role">— {ex.role}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
