import { useMemo, useState } from "react";
import type { TestResult, View } from "../types";
import {
  ACCREDITATION_DISCLAIMER,
  AGENDA,
  COURSE,
  estimatedHours,
  LEARNING_OBJECTIVES,
  objectivesForRole,
  PARTICIPATION_NOTE,
  TOTAL_MINUTES,
} from "../data/course";
import { TRACKS, trackByRole } from "../data/tracks";
import { assembleTest } from "../data/postTest";
import { PROVIDER } from "../content/providerConfig";
import { completionEligible, makeCompletionId } from "../lib/courseProgress";
import {
  buildCertificateData,
  buildCertificateHtml,
  buildSubmissionPacketMarkdown,
  type CertificateContext,
} from "../lib/certificate";
import { PostTest } from "./PostTest";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const moduleItems = AGENDA.filter((a) => a.view);

export function CourseHub({ onNavigate, onToast }: { onNavigate: (v: View) => void; onToast: (m: string) => void }) {
  const [reviewed, setReviewed] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [evalRelevance, setEvalRelevance] = useState(0);
  const [evalDone, setEvalDone] = useState(false);
  const [evalComment, setEvalComment] = useState("");
  const [name, setName] = useState("");
  const [activeRole, setActiveRole] = useState("attorney");
  const [jurisdiction, setJurisdiction] = useState("");
  const [dateISO, setDateISO] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeAttested, setTimeAttested] = useState(false);

  const track = trackByRole(activeRole);
  const objectives = objectivesForRole(activeRole);
  const questions = assembleTest(track.questionIds);
  const roleCategory = track.label;

  // Changing the track resets the post-test (its questions change).
  function changeTrack(roleId: string) {
    setActiveRole(roleId);
    setTestResult(null);
  }

  const ctx: CertificateContext = useMemo(
    () => ({
      courseTitle: COURSE.title,
      courseId: COURSE.id,
      instructionalMethod: COURSE.instructionalMethod,
      productionDate: COURSE.productionDate,
      minutes: TOTAL_MINUTES,
      hours: estimatedHours(),
      provider: PROVIDER.name,
      providerNumber: PROVIDER.providerNumber,
      author: PROVIDER.author,
      disclaimer: ACCREDITATION_DISCLAIMER,
    }),
    []
  );

  const modulesAffirmed = moduleItems.every((m) => reviewed[m.label]);
  const eligible = completionEligible({
    modulesAffirmed,
    testPassed: !!testResult?.passed,
    evaluationDone: evalDone,
    timeAttested,
    name,
    jurisdiction,
  });

  function downloadPacket() {
    const md = buildSubmissionPacketMarkdown(
      { ...ctx, description: COURSE.description, participationNote: PARTICIPATION_NOTE },
      objectives,
      AGENDA,
      TRACKS,
      PROVIDER.authorQuals,
      PROVIDER.contact,
      track
    );
    download(`cle-accreditation-packet-${track.roleId}.md`, md, "text/markdown");
    onToast("Accreditation packet downloaded");
  }

  function downloadCertificate() {
    const completionId = makeCompletionId(COURSE.id, name, Date.now());
    const data = buildCertificateData({ name, roleCategory, jurisdiction, dateISO }, completionId, ctx);
    download(`certificate-${completionId}.html`, buildCertificateHtml(data), "text/html");
    onToast("Certificate downloaded — open it and print to PDF");
  }

  return (
    <div className="mi-fade">
      <p className="mi-kicker">Continuing Education · Self-study</p>
      <h1 className="mi-h1">{COURSE.title}</h1>
      <p className="mi-lede">{COURSE.description}</p>
      <p className="mi-count" style={{ marginBottom: 18 }}>
        Course ID {COURSE.id} · {COURSE.instructionalMethod} · estimated {TOTAL_MINUTES} minutes (~
        {estimatedHours()} hours)
      </p>

      <div className="mi-disc" style={{ marginTop: 0, marginBottom: 26 }}>
        {ACCREDITATION_DISCLAIMER}
      </div>

      {/* Track selector */}
      <h2 className="mi-h2" style={{ fontSize: 20 }}>
        Choose your track
      </h2>
      <p className="mi-p">
        Each role answers to a different accrediting body. Your track tailors the objectives, the
        knowledge check, and the credit guidance.
      </p>
      <label className="mi-label" htmlFor="track">
        I am completing this as a:
      </label>
      <select id="track" className="mi-input" value={activeRole} onChange={(e) => changeTrack(e.target.value)}>
        {TRACKS.map((t) => (
          <option key={t.roleId} value={t.roleId}>
            {t.label}
          </option>
        ))}
      </select>
      <div className="mi-tri ethics" style={{ marginTop: 16 }}>
        <p className="tt" style={{ fontSize: 16 }}>
          {track.creditContext}
        </p>
        <p className="bd">{track.bodies}</p>
      </div>

      {/* Objectives */}
      <h2 className="mi-h2" style={{ fontSize: 20, marginTop: 28 }}>
        Learning objectives
      </h2>
      <ul className="mi-cite-list">
        {objectives.map((o, i) => (
          <li key={i}>
            {o}
            {i >= LEARNING_OBJECTIVES.length ? <span className="mi-foot"> (track-specific)</span> : null}
          </li>
        ))}
      </ul>

      {/* Agenda */}
      <h2 className="mi-h2" style={{ fontSize: 20, marginTop: 28 }}>
        Timed agenda
      </h2>
      <table className="mi-table">
        <tbody>
          {AGENDA.map((a) => (
            <tr key={a.label}>
              <td>{a.label}</td>
              <td className="num">{a.minutes} min</td>
            </tr>
          ))}
          <tr className="total">
            <td>Total</td>
            <td className="num">{TOTAL_MINUTES} min</td>
          </tr>
        </tbody>
      </table>

      {/* All-tracks credit guidance (reference) */}
      <h2 className="mi-h2" style={{ fontSize: 20, marginTop: 28 }}>
        Credit-context guidance by role
      </h2>
      {TRACKS.map((t) => (
        <div className="mi-tri ethics" key={t.roleId} style={{ marginBottom: 12, opacity: t.roleId === activeRole ? 1 : 0.72 }}>
          <p className="tt" style={{ fontSize: 15 }}>
            {t.label} — {t.creditContext}
          </p>
          <p className="bd">{t.bodies}</p>
        </div>
      ))}

      <div className="mi-navrow" style={{ justifyContent: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <button className="mi-btn" onClick={downloadPacket}>
          Download accreditation packet for this track (.md)
        </button>
      </div>
      <p className="mi-foot">
        For providers: this packet assembles the description, objectives, timed agenda, method,
        author-qualifications, participation-verification language, and per-role credit guidance a
        board typically requires — with the selected track marked as the primary submission. Fill the
        provider placeholders (set via environment variables) before filing.
      </p>

      <hr className="mi-rule" />

      {/* Step 1 — modules */}
      <h2 className="mi-h2">1 · Complete the modules</h2>
      <p className="mi-p">Open each module, then mark it reviewed.</p>
      <div className="mi-checklist">
        {moduleItems.map((m) => (
          <div className="mi-check-row" key={m.label}>
            <label className="mi-toggle" style={{ margin: 0 }}>
              <input
                type="checkbox"
                checked={!!reviewed[m.label]}
                onChange={(e) => setReviewed((r) => ({ ...r, [m.label]: e.target.checked }))}
              />
              <span>{m.label}</span>
            </label>
            {m.view && (
              <button className="mi-chip" onClick={() => onNavigate(m.view as View)}>
                Open
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Step 2 — post-test */}
      <hr className="mi-rule" />
      <h2 className="mi-h2">2 · Knowledge check</h2>
      <p className="mi-p">
        Passing threshold {Math.round(COURSE.passThreshold * 100)}%. This demonstrates understanding
        of the material — a common self-study participation-verification method.
      </p>
      <PostTest
        key={track.roleId}
        questions={questions}
        threshold={COURSE.passThreshold}
        onResult={setTestResult}
      />

      {/* Step 3 — evaluation */}
      <hr className="mi-rule" />
      <h2 className="mi-h2">3 · Course evaluation</h2>
      <p className="mi-p">How relevant was this course to your practice?</p>
      <div className="mi-scale" style={{ maxWidth: 360 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={"mi-opt" + (evalRelevance === n ? " sel" : "")}
            onClick={() => setEvalRelevance(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <label className="mi-label" htmlFor="evalc">
        Comments (optional)
      </label>
      <textarea
        id="evalc"
        className="mi-textarea"
        rows={2}
        value={evalComment}
        onChange={(e) => setEvalComment(e.target.value)}
        placeholder="Anything you'd change or want more of."
      />
      <div style={{ marginTop: 12 }}>
        <button
          className="mi-btn"
          disabled={evalRelevance === 0 || evalDone}
          onClick={() => {
            setEvalDone(true);
            onToast("Evaluation recorded");
          }}
        >
          {evalDone ? "Evaluation complete ✓" : "Submit evaluation"}
        </button>
      </div>

      {/* Step 4 — certificate */}
      <hr className="mi-rule" />
      <h2 className="mi-h2">4 · Certificate of completion</h2>
      <p className="mi-p">
        Available once all modules are reviewed, the post-test is passed, and the evaluation is
        complete.
      </p>

      <label className="mi-label" htmlFor="cn">
        Full name (as it should appear)
      </label>
      <input id="cn" className="mi-input" value={name} onChange={(e) => setName(e.target.value)} />

      <label className="mi-label" htmlFor="cr">
        Role / credit category
      </label>
      <input id="cr" className="mi-input" value={roleCategory} readOnly aria-readonly="true" />
      <p className="mi-foot">Set by your chosen track above. Change the track to change this.</p>

      <label className="mi-label" htmlFor="cj">
        Jurisdiction / licensing board
      </label>
      <input
        id="cj"
        className="mi-input"
        value={jurisdiction}
        onChange={(e) => setJurisdiction(e.target.value)}
        placeholder="e.g. Missouri Bar"
      />

      <label className="mi-label" htmlFor="cd">
        Date completed
      </label>
      <input id="cd" type="date" className="mi-input" value={dateISO} onChange={(e) => setDateISO(e.target.value)} />

      <label className="mi-toggle">
        <input type="checkbox" checked={timeAttested} onChange={(e) => setTimeAttested(e.target.checked)} />
        <span>I attest that I spent the time indicated actively engaging with this material.</span>
      </label>

      <div style={{ marginTop: 14 }}>
        <button className="mi-btn" disabled={!eligible} onClick={downloadCertificate}>
          Generate certificate (.html)
        </button>
      </div>
      {!eligible && (
        <p className="mi-foot">
          Complete the steps above and fill name + jurisdiction to enable the certificate.
        </p>
      )}
      <p className="mi-foot">
        Open the downloaded file and use your browser's Print → “Save as PDF.” The certificate carries
        the course ID, a unique completion ID, provider fields, and the accreditation disclaimer.
      </p>
    </div>
  );
}
