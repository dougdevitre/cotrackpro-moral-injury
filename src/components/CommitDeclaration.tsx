import { useMemo, useState } from "react";
import { COMMIT } from "../content/copy";
import { COMMITMENTS } from "../data/commitments";
import { buildCommitmentCertificateHtml, buildPosterHtml } from "../lib/print/documents";
import { openPrintable } from "../lib/print/layout";
import type { CommitmentCertificateData } from "../types";

function makeDeclarationId(): string {
  return "MIP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function CommitDeclaration({ onToast }: { onToast: (msg: string) => void }) {
  const [name, setName] = useState("");
  const [personal, setPersonal] = useState("");
  const [attested, setAttested] = useState(false);
  // Default every commitment to affirmed; the user can uncheck any.
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(COMMITMENTS.map((c) => [c.id, true]))
  );

  const affirmed = useMemo(
    () => COMMITMENTS.filter((c) => checked[c.id]),
    [checked]
  );
  const ready = name.trim().length > 0 && affirmed.length > 0 && attested;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const posterReady = personal.trim().length > 0 || affirmed.length > 0;

  function generate() {
    if (!ready) return;
    const data: CommitmentCertificateData = {
      name: name.trim(),
      dateISO: new Date().toISOString(),
      commitments: affirmed,
      personal: personal.trim() || undefined,
      declarationId: makeDeclarationId(),
    };
    openPrintable(buildCommitmentCertificateHtml(data), `commitment-${data.declarationId}.html`);
    onToast(COMMIT.generated);
  }

  function makePoster() {
    const quote = personal.trim() || affirmed[0]?.text;
    if (!quote) return;
    openPrintable(
      buildPosterHtml({ quote, attribution: name.trim() || undefined }),
      "commitment-poster.html"
    );
    onToast(COMMIT.posterDone);
  }

  return (
    <div className="mi-fade">
      <p className="mi-kicker">{COMMIT.kicker}</p>
      <h1 className="mi-h1">{COMMIT.title}</h1>
      <p className="mi-lede">{COMMIT.lede}</p>

      <div className="mi-card">
        <p className="mi-section-tag">{COMMIT.intro}</p>
        <div className="mi-commit-list">
          {COMMITMENTS.map((c) => {
            const on = !!checked[c.id];
            return (
              <button
                key={c.id}
                type="button"
                className={"mi-commit" + (on ? " on" : "")}
                aria-pressed={on}
                onClick={() => toggle(c.id)}
              >
                <span className={"mi-commit-check tier-" + c.tier} aria-hidden="true">
                  {on ? "✓" : ""}
                </span>
                <span className="mi-commit-body">
                  <span className="mi-commit-label">{c.label}</span>
                  <span className="mi-commit-text">{c.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        <label className="mi-label" htmlFor="commit-personal">
          {COMMIT.personalLabel}
        </label>
        <textarea
          id="commit-personal"
          className="mi-textarea"
          rows={2}
          placeholder={COMMIT.personalPlaceholder}
          value={personal}
          onChange={(e) => setPersonal(e.target.value)}
        />

        <label className="mi-label" htmlFor="commit-name">
          {COMMIT.nameLabel}
        </label>
        <input
          id="commit-name"
          className="mi-input"
          placeholder={COMMIT.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="mi-toggle">
          <input
            type="checkbox"
            checked={attested}
            onChange={(e) => setAttested(e.target.checked)}
          />
          <span>{COMMIT.attest}</span>
        </label>

        <hr className="mi-rule" />
        <div className="mi-navrow" style={{ justifyContent: "flex-start", flexWrap: "wrap", gap: 10 }}>
          <button className="mi-btn" disabled={!ready} onClick={generate}>
            {COMMIT.generate}
          </button>
          <button className="mi-btn ghost" disabled={!posterReady} onClick={makePoster}>
            {COMMIT.poster}
          </button>
        </div>
        {!ready && <p className="mi-hint">{COMMIT.needName}</p>}
      </div>

      <p className="mi-disc">{COMMIT.disclaimer}</p>
    </div>
  );
}
