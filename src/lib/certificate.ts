import type {
  AgendaItem,
  CertificateData,
  CertificateInput,
  CommitmentCertificateData,
  CourseTrack,
  TriageTier,
} from "../types";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface CertificateContext {
  courseTitle: string;
  courseId: string;
  instructionalMethod: string;
  productionDate: string;
  minutes: number;
  hours: string;
  provider: string;
  providerNumber: string;
  author: string;
  disclaimer: string;
}

export function buildCertificateData(
  input: CertificateInput,
  completionId: string,
  ctx: CertificateContext
): CertificateData {
  return {
    ...input,
    completionId,
    courseTitle: ctx.courseTitle,
    courseId: ctx.courseId,
    minutes: ctx.minutes,
    hours: ctx.hours,
    instructionalMethod: ctx.instructionalMethod,
    productionDate: ctx.productionDate,
    provider: ctx.provider,
    providerNumber: ctx.providerNumber,
    author: ctx.author,
    disclaimer: ctx.disclaimer,
  };
}

/** A standalone, printable Certificate of Completion as an HTML document string. */
export function buildCertificateHtml(d: CertificateData): string {
  const dateStr = new Date(d.dateISO).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Certificate of Completion — ${esc(d.name)}</title>
<style>
  @page { size: letter landscape; margin: 0.6in; }
  body { font-family: Georgia, "Times New Roman", serif; color:#22282a; margin:0; padding:40px; }
  .cert { border:2px solid #3c685f; border-radius:6px; padding:40px 48px; max-width:900px; margin:0 auto; }
  .kick { letter-spacing:.22em; text-transform:uppercase; font-size:12px; color:#3c685f; font-weight:bold; }
  h1 { font-size:30px; margin:8px 0 4px; }
  .sub { font-size:15px; color:#56605d; margin:0 0 20px; }
  .name { font-size:26px; margin:18px 0 6px; border-bottom:1px solid #d8ccb3; padding-bottom:8px; }
  table { width:100%; border-collapse:collapse; margin:18px 0; font-size:13px; }
  td { padding:4px 8px; vertical-align:top; }
  td.k { color:#56605d; width:38%; }
  .attest { font-size:13px; color:#22282a; margin:14px 0; }
  .sig { margin-top:30px; display:flex; justify-content:space-between; gap:40px; }
  .sigbox { flex:1; border-top:1px solid #22282a; padding-top:6px; font-size:12px; color:#56605d; }
  .disc { font-size:10.5px; color:#56605d; line-height:1.5; margin-top:22px; border-top:1px solid #d8ccb3; padding-top:12px; }
  @media print { .noprint { display:none; } body { padding:0; } }
</style></head>
<body>
  <div class="cert">
    <div class="kick">Certificate of Completion</div>
    <h1>${esc(d.courseTitle)}</h1>
    <p class="sub">Self-study continuing-education activity · Course ID ${esc(d.courseId)}</p>

    <p class="sub" style="margin-bottom:0">This certifies that</p>
    <div class="name">${esc(d.name)}</div>

    <table>
      <tr><td class="k">Role / credit category</td><td>${esc(d.roleCategory)}</td></tr>
      <tr><td class="k">Jurisdiction (as entered)</td><td>${esc(d.jurisdiction)}</td></tr>
      <tr><td class="k">Date completed</td><td>${esc(dateStr)}</td></tr>
      <tr><td class="k">Estimated instructional time</td><td>${d.minutes} minutes (~${esc(d.hours)} hours) — credit value determined by your board</td></tr>
      <tr><td class="k">Instructional method</td><td>${esc(d.instructionalMethod)}</td></tr>
      <tr><td class="k">Production date</td><td>${esc(d.productionDate)}</td></tr>
      <tr><td class="k">Provider</td><td>${esc(d.provider)}</td></tr>
      <tr><td class="k">Provider / sponsor no.</td><td>${esc(d.providerNumber)}</td></tr>
      <tr><td class="k">Author / faculty</td><td>${esc(d.author)}</td></tr>
      <tr><td class="k">Completion ID</td><td>${esc(d.completionId)}</td></tr>
    </table>

    <p class="attest">The named participant affirmed review of all modules, passed the post-test demonstrating
      understanding of the material, completed the course evaluation, and attested to the time spent.</p>

    <div class="sig">
      <div class="sigbox">Authorized signature (provider)</div>
      <div class="sigbox">Date issued</div>
    </div>

    <p class="disc">${esc(d.disclaimer)}</p>
  </div>
</body></html>`;
}

const TIER_COLOR: Record<TriageTier, string> = {
  support: "#0ea5e9",
  ethics: "#6366f1",
  repair: "#10b981",
  systems: "#f59e0b",
};

/**
 * A standalone, printable Certificate of Commitment for moral-injury prevention.
 * This is a personal declaration the user writes for themselves — not a
 * credential, license, or clinical document.
 */
export function buildCommitmentCertificateHtml(d: CommitmentCertificateData): string {
  const dateStr = new Date(d.dateISO).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const pledges = d.commitments
    .map(
      (c) => `<li class="pledge">
        <span class="dot" style="background:${TIER_COLOR[c.tier]}"></span>
        <span class="ptext">${esc(c.text)}</span>
      </li>`
    )
    .join("");
  const personal = d.personal?.trim()
    ? `<div class="personal"><div class="plabel">My own commitment</div><p>${esc(d.personal.trim())}</p></div>`
    : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Commitment to Moral Injury Prevention — ${esc(d.name)}</title>
<style>
  @page { size: letter portrait; margin: 0.6in; }
  body { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color:#0f172a; margin:0; padding:40px; }
  .cert { border:2px solid #0ea5e9; border-radius:10px; padding:40px 48px; max-width:760px; margin:0 auto; }
  .brand { display:flex; align-items:center; gap:10px; margin-bottom:18px; }
  .tile { width:34px; height:34px; border-radius:9px; background:linear-gradient(#38bdf8,#0284c7); display:flex; align-items:center; justify-content:center; }
  .tile svg { display:block; }
  .brandname { font-weight:700; letter-spacing:-0.02em; font-size:16px; color:#0f172a; }
  .kick { letter-spacing:.22em; text-transform:uppercase; font-size:11px; color:#0284c7; font-weight:700; margin:0; }
  h1 { font-size:27px; margin:6px 0 4px; letter-spacing:-0.01em; }
  .sub { font-size:14px; color:#475569; margin:0 0 18px; }
  .name { font-size:24px; font-weight:600; margin:14px 0 4px; border-bottom:1px solid #cbd5e1; padding-bottom:8px; }
  .intro { font-size:14px; color:#334155; margin:16px 0 6px; }
  ul { list-style:none; margin:8px 0 0; padding:0; }
  .pledge { display:flex; gap:11px; align-items:flex-start; padding:9px 0; border-bottom:1px solid #eef2f7; font-size:14.5px; line-height:1.5; }
  .dot { flex-shrink:0; width:10px; height:10px; border-radius:99px; margin-top:6px; }
  .personal { margin:18px 0 0; padding:14px 16px; background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; }
  .plabel { font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:#0284c7; font-weight:700; margin-bottom:4px; }
  .personal p { margin:0; font-size:14.5px; }
  .sig { margin-top:34px; display:flex; justify-content:space-between; gap:40px; }
  .sigbox { flex:1; border-top:1px solid #0f172a; padding-top:6px; font-size:12px; color:#475569; }
  .meta { margin-top:18px; font-size:11.5px; color:#64748b; }
  .disc { font-size:10.5px; color:#64748b; line-height:1.5; margin-top:18px; border-top:1px solid #e2e8f0; padding-top:12px; }
  @media print { .noprint { display:none; } body { padding:0; } }
</style></head>
<body>
  <div class="cert">
    <div class="brand">
      <span class="tile"><svg width="22" height="22" viewBox="0 0 64 64"><path d="M20 33.5 L28.5 42 L45 24" fill="none" stroke="#04121f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <span class="brandname">CoTrackPro</span>
    </div>
    <p class="kick">Commitment to Moral Injury Prevention</p>
    <h1>A personal declaration</h1>
    <p class="sub">A pledge to practices that help me stay whole in hard work.</p>

    <p class="sub" style="margin-bottom:0">Made by</p>
    <div class="name">${esc(d.name)}</div>
    <p class="sub">on ${esc(dateStr)}</p>

    <p class="intro">I commit to the following protective practices:</p>
    <ul>${pledges}</ul>
    ${personal}

    <div class="sig">
      <div class="sigbox">Signature</div>
      <div class="sigbox">Date</div>
    </div>

    <p class="meta">Declaration ID ${esc(d.declarationId)} · generated on this device</p>
    <p class="disc">This is a personal commitment a practitioner writes for themselves to support their own
      wellbeing and ethical practice. It is non-diagnostic and informational only — it is not a credential,
      license, clinical assessment, or legal advice, and confers no professional standing. If you are in crisis,
      contact your local emergency number or a crisis line.</p>
  </div>
</body></html>`;
}

export interface PacketContext extends CertificateContext {
  description: string;
  participationNote: string;
}

/** Accreditation submission packet as Markdown for a provider to file with a board. */
export function buildSubmissionPacketMarkdown(
  ctx: PacketContext,
  objectives: string[],
  agenda: AgendaItem[],
  tracks: CourseTrack[],
  authorQuals: string,
  contact: string,
  primaryTrack?: CourseTrack
): string {
  const L: string[] = [];
  L.push(`# CLE/CE Accreditation Submission Packet`, "");
  L.push(`**Course:** ${ctx.courseTitle}`, "");
  L.push(`**Course ID:** ${ctx.courseId}`);
  L.push(`**Provider:** ${ctx.provider}`);
  L.push(`**Provider/sponsor number:** ${ctx.providerNumber}`);
  L.push(`**Contact:** ${contact}`);
  L.push(`**Production date:** ${ctx.productionDate}`);
  L.push(`**Instructional method:** ${ctx.instructionalMethod}`);
  L.push(`**Estimated instructional time:** ${ctx.minutes} minutes (~${ctx.hours} hours at a 60-minute hour)`, "");

  if (primaryTrack) {
    L.push(`**Primary track for this submission:** ${primaryTrack.label} — ${primaryTrack.creditContext}`, "");
  }

  L.push(`## Course description`, "", ctx.description, "");

  L.push(`## Learning objectives`, "", "Upon completion, participants will be able to:", "");
  objectives.forEach((o) => L.push(`- ${o}`));
  L.push("");

  L.push(`## Timed agenda`, "");
  L.push(`| Segment | Minutes |`, `| --- | --- |`);
  agenda.forEach((a) => L.push(`| ${a.label} | ${a.minutes} |`));
  L.push(`| **Total** | **${agenda.reduce((n, a) => n + a.minutes, 0)}** |`, "");

  L.push(`## Author / faculty qualifications`, "", authorQuals, "");

  L.push(`## Participation verification`, "", ctx.participationNote, "");

  L.push(`## Credit-context guidance by role`, "");
  tracks.forEach((t) => {
    L.push(`### ${t.label} — ${t.creditContext}`, "", t.bodies, "");
    if (t.objective) L.push(`Role objective: ${t.objective}`, "");
  });

  L.push(`## Required disclaimer`, "", ctx.disclaimer, "");
  return L.join("\n");
}
