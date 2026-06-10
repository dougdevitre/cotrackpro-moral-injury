import type { Reading, Role, Scores, Subscale } from "../types";
import { BAND_COLORS } from "../lib/scoring";
import { buildTriage } from "../lib/triage";
import { buildResultPayload } from "../lib/schema";
import { buildReflectionSummaryHtml } from "../lib/print/documents";
import { openPrintable } from "../lib/print/layout";
import { BAND_PRINT_COLORS } from "../lib/print/brand";
import { SUB_META, COPY } from "../content/copy";
import { CRISIS, CRISIS_THRESHOLD } from "../content/config";
import { relatedRulesForRole } from "../data/itemSet";
import { ABA_DISCLAIMER } from "../data/rules";

interface Props {
  scores: Scores;
  reading: Reading;
  role: Role | null;
  onCopy: (text: string) => void;
  onRestart: () => void;
  onGoToPractice: () => void;
}

const SUB_ORDER: Subscale[] = ["SELF", "WITNESS", "BETRAYAL", "DISTRESS"];

export function Results({ scores, reading, role, onCopy, onRestart, onGoToPractice }: Props) {
  const triage = buildTriage(scores);
  const relatedRules = relatedRulesForRole(role?.id ?? null);

  function handleCopy() {
    const payload = buildResultPayload(scores, reading, role);
    onCopy(JSON.stringify(payload, null, 2));
  }

  function savePdf() {
    const html = buildReflectionSummaryHtml({
      roleLabel: role?.label ?? "Professional",
      dateISO: new Date().toISOString(),
      meters: [
        {
          label: "Exposure",
          valueLabel: `${reading.eBand.label} · ${scores.exposure}/100`,
          pct: scores.exposure,
          color: BAND_PRINT_COLORS[reading.eBand.rank],
        },
        {
          label: "Personal distress",
          valueLabel: `${reading.dBand.label} · ${scores.distress}/100`,
          pct: scores.distress,
          color: BAND_PRINT_COLORS[reading.dBand.rank],
        },
      ],
      subs: SUB_ORDER.map((k) => ({ label: SUB_META[k].label, pct: scores.sub[k] })),
      lead: reading.lead,
      driver: reading.driver || undefined,
      triage: triage.map((t) => ({ tier: t.tier, title: t.title, body: t.body })),
      crisis:
        scores.distress >= CRISIS_THRESHOLD ? `${CRISIS.label}. ${CRISIS.body}` : undefined,
      footnote: COPY.footerDisclaimer,
    });
    openPrintable(html, "reflection-summary.html");
  }

  return (
    <div className="mi-stagger">
      <div>
        <p className="mi-kicker">
          Your reflection · {role?.label ?? "Professional"}
        </p>
        <h2 className="mi-h2">Two readings, kept separate on purpose</h2>
      </div>

      <div className="mi-card">
        <div className="mi-meter">
          <div className="lab">
            <span className="name">Exposure</span>
            <span className="val">
              {reading.eBand.label} · {scores.exposure}/100
            </span>
          </div>
          <div className="mi-bar">
            <i style={{ width: `${scores.exposure}%`, background: BAND_COLORS[reading.eBand.rank] }} />
          </div>
        </div>
        <div className="mi-meter" style={{ marginBottom: 4 }}>
          <div className="lab">
            <span className="name">Personal distress</span>
            <span className="val">
              {reading.dBand.label} · {scores.distress}/100
            </span>
          </div>
          <div className="mi-bar">
            <i style={{ width: `${scores.distress}%`, background: BAND_COLORS[reading.dBand.rank] }} />
          </div>
        </div>
        <p className="mi-foot" style={{ marginTop: 14 }}>
          {COPY.indicesExplainer}
        </p>
      </div>

      <div className="mi-card">
        <h2 className="mi-h2" style={{ fontSize: 20 }}>
          What is weighing the most
        </h2>
        <div className="mi-sub">
          {SUB_ORDER.map((k) => (
            <div className="mi-subrow" key={k}>
              <div className="lab">
                <span className="nm">{SUB_META[k].label}</span>
                <span className="nt">{scores.sub[k]}/100</span>
              </div>
              <div className="mi-subbar">
                <i style={{ width: `${scores.sub[k]}%` }} />
              </div>
            </div>
          ))}
        </div>
        <hr className="mi-rule" />
        <p className="mi-p">{reading.lead}</p>
        {reading.driver && (
          <p className="mi-p" style={{ marginBottom: 0 }}>
            {reading.driver}
          </p>
        )}
      </div>

      {scores.distress >= CRISIS_THRESHOLD && (
        <div className="mi-crisis">
          <p>
            <b>{CRISIS.label}.</b> {CRISIS.body}
          </p>
        </div>
      )}

      <div>
        <h2 className="mi-h2">Where to take this</h2>
        {triage.map((t, i) => (
          <div className={"mi-tri " + t.tier} key={i}>
            <p className="tt">{t.title}</p>
            <p className="bd">{t.body}</p>
          </div>
        ))}
        <div className="mi-card" style={{ marginTop: 8 }}>
          <p className="mi-p" style={{ marginBottom: 12 }}>
            Want to turn this into something you practice? Build a short set of if-then habits and
            reminders tailored to what weighed most here.
          </p>
          <button className="mi-btn" onClick={onGoToPractice}>
            Build a practice plan →
          </button>
        </div>
      </div>

      {relatedRules.length > 0 && (
        <div>
          <h2 className="mi-h2">Professional standards to revisit</h2>
          <p className="mi-p">
            Not a judgment — a quiet reference. These are the conduct standards your role most often
            touches, in plain language. Your jurisdiction's adopted rules govern.
          </p>
          <div className="mi-rule-list">
            {relatedRules.map((r) => (
              <a
                key={r.id}
                className="mi-rule-item"
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="mi-rule-badge">{r.id}</span>
                <span className="mi-rule-body">
                  <span className="mi-rule-title">{r.title}</span>
                  <span className="mi-rule-summary">{r.summary}</span>
                </span>
                <span className="mi-rule-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
          <div className="mi-disc">{ABA_DISCLAIMER}</div>
        </div>
      )}

      <div>
        <div className="mi-navrow" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
          <button className="mi-btn" onClick={savePdf}>
            Save as PDF
          </button>
          <button className="mi-btn ghost" onClick={handleCopy}>
            Copy private summary
          </button>
          <button className="mi-btn ghost" onClick={onRestart}>
            Start over
          </button>
        </div>
        <div className="mi-disc">
          <b>Please read:</b> {COPY.footerDisclaimer}
          <br />
          <br />
          {COPY.grounding}
        </div>
      </div>
    </div>
  );
}
