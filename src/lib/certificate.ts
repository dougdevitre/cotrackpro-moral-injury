import type { AgendaItem, CertificateData, CertificateInput, CourseTrack } from "../types";

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
