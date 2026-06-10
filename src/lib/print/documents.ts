import type { CommitmentCertificateData, TriageTier } from "../../types";
import { BRAND, TIER_COLOR, esc } from "./brand";
import { renderDocument } from "./layout";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ----------------------------- atoms ------------------------------------- */

function meterBar(label: string, valueLabel: string, pct: number, color: string): string {
  const w = Math.max(0, Math.min(100, pct));
  return `<div style="margin:0 0 16px">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
      <span style="font-weight:600;font-size:15px;color:${BRAND.ink}">${esc(label)}</span>
      <span style="font-size:12.5px;color:${BRAND.inkSoft}">${esc(valueLabel)}</span>
    </div>
    <div style="height:12px;background:#eef2f7;border:1px solid ${BRAND.line};border-radius:99px;overflow:hidden">
      <div style="height:100%;width:${w}%;background:${color};border-radius:99px"></div>
    </div>
  </div>`;
}

function triageCard(tier: TriageTier, title: string, body: string): string {
  return `<div style="border-left:3px solid ${TIER_COLOR[tier]};padding:2px 0 2px 16px;margin:0 0 14px">
    <p style="font-weight:600;font-size:15px;margin:0 0 3px;color:${BRAND.ink}">${esc(title)}</p>
    <p style="font-size:14px;color:${BRAND.inkSoft};margin:0">${esc(body)}</p>
  </div>`;
}

/* ------------------------- 1 · Reflection summary ------------------------ */

export interface ReflectionSummaryInput {
  roleLabel: string;
  dateISO: string;
  meters: { label: string; valueLabel: string; pct: number; color: string }[];
  subs: { label: string; pct: number }[];
  lead: string;
  driver?: string;
  triage: { tier: TriageTier; title: string; body: string }[];
  crisis?: string;
  footnote: string;
}

export function buildReflectionSummaryHtml(d: ReflectionSummaryInput): string {
  const meters = d.meters.map((m) => meterBar(m.label, m.valueLabel, m.pct, m.color)).join("");
  const subs = d.subs
    .map(
      (s) => `<div style="margin:0 0 11px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
          <span style="font-size:14px;font-weight:600;color:${BRAND.ink}">${esc(s.label)}</span>
          <span style="font-size:12px;color:${BRAND.inkSoft}">${Math.round(s.pct)}/100</span>
        </div>
        <div style="height:8px;background:#eef2f7;border:1px solid ${BRAND.line};border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${Math.max(0, Math.min(100, s.pct))}%;background:${BRAND.sky2};border-radius:99px"></div>
        </div>
      </div>`
    )
    .join("");
  const triage = d.triage.map((t) => triageCard(t.tier, t.title, t.body)).join("");
  const crisis = d.crisis
    ? `<div style="background:#fff7ed;border:1px solid ${BRAND.amber};border-radius:8px;padding:14px 16px;margin:18px 0">
        <p style="margin:0;font-size:14px;color:${BRAND.ink}">${esc(d.crisis)}</p>
      </div>`
    : "";

  const body = `
    ${meters}
    <h2 class="sec">What is weighing the most</h2>
    ${subs}
    <p style="font-size:14.5px;color:${BRAND.ink}">${esc(d.lead)}</p>
    ${d.driver ? `<p style="font-size:14.5px;color:${BRAND.ink}">${esc(d.driver)}</p>` : ""}
    ${crisis}
    <h2 class="sec">Where to take this</h2>
    ${triage}`;

  return renderDocument({
    title: "Reflection summary",
    kicker: `Your reflection · ${d.roleLabel}`,
    heading: "Two readings, kept separate",
    sub: `Saved ${fmtDate(d.dateISO)} — a private snapshot of the moral weight you may be carrying.`,
    body,
    footnote: d.footnote,
  });
}

/* ----------------------- 2 · Commitment certificate ---------------------- */

export function buildCommitmentCertificateHtml(d: CommitmentCertificateData): string {
  const pledges = d.commitments
    .map(
      (c) => `<li style="display:flex;gap:11px;align-items:flex-start;padding:9px 0;border-bottom:1px solid #eef2f7;font-size:14.5px;line-height:1.5;list-style:none">
        <span style="flex-shrink:0;width:10px;height:10px;border-radius:99px;margin-top:6px;background:${TIER_COLOR[c.tier]}"></span>
        <span>${esc(c.text)}</span>
      </li>`
    )
    .join("");
  const personal = d.personal?.trim()
    ? `<div style="margin:18px 0 0;padding:14px 16px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px">
        <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.skyDeep};font-weight:700;margin-bottom:4px">My own commitment</div>
        <p style="margin:0;font-size:14.5px;color:${BRAND.ink}">${esc(d.personal.trim())}</p>
      </div>`
    : "";

  const body = `
    <p style="font-size:14.5px;color:${BRAND.ink}">I commit to the following protective practices:</p>
    <ul style="margin:8px 0 0;padding:0">${pledges}</ul>
    ${personal}
    <div style="margin-top:34px;display:flex;justify-content:space-between;gap:40px">
      <div style="flex:1;border-top:1px solid ${BRAND.ink};padding-top:6px;font-size:12px;color:${BRAND.inkSoft}">Signature</div>
      <div style="flex:1;border-top:1px solid ${BRAND.ink};padding-top:6px;font-size:12px;color:${BRAND.inkSoft}">Date</div>
    </div>`;

  return renderDocument({
    title: "Commitment to Moral Injury Prevention",
    kicker: "Commitment to Moral Injury Prevention",
    heading: "A personal declaration",
    sub: `Made by ${d.name} · ${fmtDate(d.dateISO)}`,
    body,
    docId: d.declarationId,
    footnote:
      "This is a personal commitment a practitioner writes for themselves to support their own wellbeing and ethical practice. It is non-diagnostic and informational only — not a credential, license, clinical assessment, or legal advice, and confers no professional standing. If you are in crisis, contact your local emergency number or a crisis line.",
  });
}

/* --------------------------- 3 · Practice plan --------------------------- */

export interface PracticePlanInput {
  dateISO: string;
  commitments: string[];
  habits: { cue: string; then: string; why?: string }[];
}

export function buildPracticePlanHtml(d: PracticePlanInput): string {
  const commitments = d.commitments.length
    ? `<h2 class="sec">Standing commitments</h2>` +
      d.commitments
        .map(
          (c) =>
            `<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #eef2f7;font-size:14.5px;color:${BRAND.ink}"><span style="color:${BRAND.sky};font-weight:700">›</span><span>${esc(c)}</span></div>`
        )
        .join("")
    : "";
  const habits = d.habits.length
    ? `<h2 class="sec">If-then habits</h2>` +
      d.habits
        .map(
          (h) => `<div style="border:1px solid ${BRAND.line};border-radius:8px;padding:12px 14px;margin:0 0 9px">
            <span style="color:${BRAND.ink};font-size:14.5px"><b>${esc(h.cue)}</b>, then ${esc(h.then)}.</span>
            ${h.why ? `<div style="font-size:13px;color:${BRAND.inkSoft};margin-top:5px">${esc(h.why)}</div>` : ""}
          </div>`
        )
        .join("")
    : "";

  return renderDocument({
    title: "My ethics practice plan",
    kicker: "Practice plan",
    heading: "My ethics practice plan",
    sub: `Saved ${fmtDate(d.dateISO)} — the habits and commitments that protect my practice before pressure hits.`,
    body: commitments + habits,
    footnote:
      "A private set of practices kept on your device. Educational and informational only — not legal or clinical advice.",
  });
}

/* ----------------------------- 4 · Poster -------------------------------- */

export interface PosterInput {
  quote: string;
  attribution?: string;
}

export function buildPosterHtml(d: PosterInput): string {
  const body = `
    <blockquote style="font-size:30px;line-height:1.32;font-weight:600;letter-spacing:-0.01em;color:#eef3fa;margin:14px 0 0">“${esc(
      d.quote
    )}”</blockquote>
    ${
      d.attribution
        ? `<p style="margin:22px 0 0;font-size:15px;color:#a6b6cf">— ${esc(d.attribution)}</p>`
        : ""
    }
    <p style="margin:40px 0 0;font-size:13px;letter-spacing:0.04em;color:${BRAND.sky2}">morality.cotrackpro.com</p>`;

  return renderDocument({
    title: "My commitment",
    kicker: "Moral Injury Prevention",
    heading: d.attribution ? `${d.attribution}’s commitment` : "My commitment",
    body,
    theme: "dark",
    accent: BRAND.sky2,
    footnote:
      "A personal pledge to practices that help me stay whole in hard work. Non-diagnostic; not a credential.",
  });
}
