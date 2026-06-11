import { useEffect, useMemo, useRef, useState } from "react";
import type { ScoreProfile } from "../types";
import { CALCULATOR, SHARE } from "../content/copy";
import { roleById } from "../data/roles";
import { downloadCanvasPng, renderPoster, type PosterFormat } from "../lib/share/poster";
import {
  clampPct,
  compute,
  defaultInputs,
  MODE_DEFAULTS,
  reductionFromClimate,
  type CalcInputs,
  type CalcMode,
} from "../lib/costDividend";
import { loadCalc, loadClimateSignal, saveCalc } from "../lib/storage";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function money(n: number): string {
  return USD.format(Math.max(0, Math.round(n)));
}

export function MoralInjuryCalculator({
  profile,
  onToast,
}: {
  profile: ScoreProfile | null;
  onToast: (msg: string) => void;
}) {
  const C = CALCULATOR;

  // Auto-fill sources, captured at mount for the "where these came from" note.
  const climate = useMemo(() => loadClimateSignal(), []);
  const hadReflection = profile !== null;
  const hadClimate = climate !== null;

  const [inputs, setInputs] = useState<CalcInputs>(() => {
    const saved = loadCalc();
    if (saved) return saved;
    const i = defaultInputs("caseload");
    if (profile) i.exposurePct = clampPct(profile.scores.exposure);
    if (climate) i.reductionPct = reductionFromClimate(climate.overall);
    return i;
  });

  // Persist on change (saveCalc no-ops unless the user has opted into storage).
  useEffect(() => {
    saveCalc(inputs);
  }, [inputs]);

  const result = useMemo(() => compute(inputs), [inputs]);

  // --- Share the result as an on-brand image (drawn on-device) ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareFormat, setShareFormat] = useState<PosterFormat>("square");
  const shareRole = roleById(profile?.roleId)?.label ?? "Family-law practice";
  const shareMessage = `The estimated dividend of reducing moral injury: ${money(result.dividend)} a year.`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    void renderPoster(canvas, {
      message: shareMessage,
      roleLabel: shareRole,
      format: shareFormat,
      tagline: C.shareTagline,
    });
  }, [shareMessage, shareRole, shareFormat, C.shareTagline]);

  async function downloadShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ok = await downloadCanvasPng(canvas, `cotrackpro-moral-injury-dividend-${shareFormat}.png`);
    if (ok) onToast("Image downloaded to this device");
  }

  function setNum(key: keyof CalcInputs, value: string) {
    const n = value === "" ? 0 : Number(value);
    setInputs((prev) => ({ ...prev, [key]: Number.isFinite(n) ? n : 0 }));
  }

  function setMode(mode: CalcMode) {
    if (mode === inputs.mode) return;
    const d = MODE_DEFAULTS[mode];
    // Switch scale + per-unit cost to the new mode's basis; keep the rest.
    setInputs((prev) => ({ ...prev, mode, scale: d.scale, costFactor: d.costFactor }));
  }

  function reset() {
    const i = defaultInputs(inputs.mode);
    if (profile) i.exposurePct = clampPct(profile.scores.exposure);
    if (climate) i.reductionPct = reductionFromClimate(climate.overall);
    setInputs(i);
    onToast("Reset to suggested values");
  }

  const sourceNote = hadReflection
    ? C.source.reflection
    : hadClimate
      ? C.source.climate
      : C.source.none;

  const scaleField = inputs.mode === "caseload" ? C.fields.scaleCaseload : C.fields.scaleJurisdiction;
  const fractionPct = Math.round(inputs.conservativeFraction * 100);

  return (
    <div className="mi-calc mi-fade">
      <p className="mi-kicker">{C.kicker}</p>
      <h1 className="mi-h1">{C.title}</h1>
      <p className="mi-lede">{C.lede}</p>

      <p className="mi-calc-source">{sourceNote}</p>

      {/* Mode toggle */}
      <section className="mi-section">
        <h2 className="mi-h2">{C.modeLabel}</h2>
        <div className="mi-calc-modes" role="group" aria-label={C.modeLabel}>
          {(["caseload", "jurisdiction"] as CalcMode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={"mi-chip" + (inputs.mode === m ? " on" : "")}
              aria-pressed={inputs.mode === m}
              onClick={() => setMode(m)}
            >
              {C.modes[m].label}
            </button>
          ))}
        </div>
        <p className="mi-calc-mode-help">{C.modes[inputs.mode].help}</p>
      </section>

      {/* Inputs */}
      <section className="mi-section">
        <h2 className="mi-h2">{C.assumptionsTitle}</h2>
        <div className="mi-calc-grid">
          <label className="mi-field">
            <span className="mi-field-label">{scaleField.label}</span>
            <input
              className="mi-input"
              type="number"
              min={0}
              inputMode="numeric"
              value={inputs.scale}
              onChange={(e) => setNum("scale", e.target.value)}
            />
            <span className="mi-calc-help">{scaleField.help}</span>
          </label>

          <label className="mi-field">
            <span className="mi-field-label">{C.fields.exposure.label}</span>
            <input
              className="mi-input"
              type="number"
              min={0}
              max={100}
              inputMode="numeric"
              value={inputs.exposurePct}
              onChange={(e) => setNum("exposurePct", e.target.value)}
            />
            <span className="mi-calc-help">{C.fields.exposure.help}</span>
          </label>

          <label className="mi-field">
            <span className="mi-field-label">{C.fields.costFactor.label}</span>
            <input
              className="mi-input"
              type="number"
              min={0}
              inputMode="numeric"
              value={inputs.costFactor}
              onChange={(e) => setNum("costFactor", e.target.value)}
            />
            <span className="mi-calc-help">{C.fields.costFactor.help}</span>
          </label>

          <label className="mi-field">
            <span className="mi-field-label">{C.fields.reduction.label}</span>
            <input
              className="mi-input"
              type="number"
              min={0}
              max={100}
              inputMode="numeric"
              value={inputs.reductionPct}
              onChange={(e) => setNum("reductionPct", e.target.value)}
            />
            <span className="mi-calc-help">{C.fields.reduction.help}</span>
          </label>

          <label className="mi-field mi-calc-field-wide">
            <span className="mi-field-label">
              {C.fields.fraction.label} — {fractionPct}%
            </span>
            <input
              className="mi-calc-range"
              type="range"
              min={5}
              max={100}
              step={5}
              value={fractionPct}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, conservativeFraction: Number(e.target.value) / 100 }))
              }
            />
            <span className="mi-calc-help">{C.fields.fraction.help}</span>
          </label>
        </div>
        <button type="button" className="mi-btn ghost mi-calc-reset" onClick={reset}>
          {C.reset}
        </button>
      </section>

      {/* Results */}
      <section className="mi-section mi-calc-results">
        <div className="mi-calc-figure cost">
          <span className="mi-calc-figure-label">{C.costTitle}</span>
          <span className="mi-calc-figure-value">{money(result.cost)}</span>
          <span className="mi-calc-figure-sub">{C.costSub}</span>
          <span className="mi-calc-band">
            {money(result.low)}–{money(result.high)} · {C.rangeNote}
          </span>
        </div>
        <div className="mi-calc-figure dividend">
          <span className="mi-calc-figure-label">{C.dividendTitle}</span>
          <span className="mi-calc-figure-value">{money(result.dividend)}</span>
          <span className="mi-calc-figure-sub">{C.dividendSub}</span>
        </div>
        <div className="mi-calc-figure residual">
          <span className="mi-calc-figure-label">{C.residualTitle}</span>
          <span className="mi-calc-figure-value">{money(result.residualCost)}</span>
        </div>
      </section>

      {/* Assumptions recap */}
      <section className="mi-section">
        <ul className="mi-calc-assumptions">
          {result.assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      {/* Share */}
      <section className="mi-section">
        <h2 className="mi-h2">{C.shareTitle}</h2>
        <p className="mi-section-lede">{C.shareLede}</p>
        <div className="mi-share-grid">
          <div className="mi-share-controls">
            <div className="mi-field">
              <span className="mi-field-label">{SHARE.formatLabel}</span>
              <div className="mi-format-row">
                {SHARE.formats.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={"mi-format-btn" + (f.id === shareFormat ? " active" : "")}
                    aria-pressed={f.id === shareFormat}
                    onClick={() => setShareFormat(f.id)}
                  >
                    <span className="mi-format-name">{f.label}</span>
                    <span className="mi-format-hint">{f.hint}</span>
                  </button>
                ))}
              </div>
            </div>
            <button type="button" className="mi-btn" onClick={downloadShare}>
              {C.shareDownload} ↓
            </button>
          </div>
          <div className="mi-share-preview">
            <canvas
              ref={canvasRef}
              className={"mi-share-canvas " + shareFormat}
              role="img"
              aria-label={shareMessage}
            />
          </div>
        </div>
      </section>

      <p className="mi-calc-disclaimer">{C.disclaimer}</p>
    </div>
  );
}
