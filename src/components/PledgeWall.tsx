import { useEffect, useMemo, useState } from "react";
import { WALL } from "../content/copy";
import { COMMITMENTS } from "../data/commitments";
import { ROLES } from "../data/roles";
import { REGIONS, commitmentLabel, commitmentText, roleLabel, type WallPledge } from "../lib/pledge";
import { fetchPledges, reportPledge, submitPledge } from "../lib/wallApi";

function timeAgo(ts: number): string {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}

export function PledgeWall({ onToast }: { onToast: (msg: string) => void }) {
  const C = WALL;

  const [configured, setConfigured] = useState(true);
  const [pledges, setPledges] = useState<WallPledge[]>([]);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [reported, setReported] = useState<Set<string>>(new Set());

  // Form state
  const [commitmentId, setCommitmentId] = useState(COMMITMENTS[0]?.id ?? "");
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [region, setRegion] = useState<string>(REGIONS[0]);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    fetchPledges(0).then((data) => {
      if (!active) return;
      setConfigured(data.configured);
      setPledges(data.pledges);
      setTotal(data.total);
      setNextCursor(data.nextCursor);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const canSubmit = consent && roleId !== "" && commitmentId !== "" && !submitting;

  async function loadMore() {
    if (nextCursor === null) return;
    const data = await fetchPledges(nextCursor);
    setPledges((prev) => [...prev, ...data.pledges]);
    setNextCursor(data.nextCursor);
    setTotal(data.total);
  }

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setFormError("");
    const result = await submitPledge({
      consent,
      commitmentId,
      name: name.trim() || undefined,
      roleId,
      region,
    });
    setSubmitting(false);
    if (result.ok) {
      setPledges((prev) => [result.pledge, ...prev]);
      setTotal((t) => t + 1);
      setSubmitted(true);
      setName("");
      setConsent(false);
      onToast(C.form.success);
    } else {
      setFormError(result.error);
    }
  }

  async function onReport(id: string) {
    const ok = await reportPledge(id);
    if (ok) {
      setReported((prev) => new Set(prev).add(id));
      onToast(C.reported);
    }
  }

  const selectedText = useMemo(() => commitmentText(commitmentId), [commitmentId]);

  return (
    <div className="mi-wall mi-fade">
      <p className="mi-kicker">{C.kicker}</p>
      <h1 className="mi-h1">{C.title}</h1>
      <p className="mi-lede">{C.lede}</p>

      <p className="mi-wall-privacy">{C.privacy}</p>

      {!configured && !loading ? (
        <section className="mi-section">
          <div className="mi-wall-empty">{C.notConfigured}</div>
        </section>
      ) : (
        <>
          {/* Submission form */}
          <section className="mi-section">
            <h2 className="mi-h2">{C.form.title}</h2>

            <label className="mi-field">
              <span className="mi-field-label">{C.form.commitment}</span>
              <select
                className="mi-select"
                value={commitmentId}
                onChange={(e) => setCommitmentId(e.target.value)}
              >
                {COMMITMENTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            {selectedText && <p className="mi-wall-preview">“{selectedText}”</p>}

            <div className="mi-wall-form-grid">
              <label className="mi-field">
                <span className="mi-field-label">{C.form.role}</span>
                <select className="mi-select" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                  <option value="">{C.form.rolePlaceholder}</option>
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mi-field">
                <span className="mi-field-label">{C.form.region}</span>
                <select className="mi-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mi-field mi-wall-name">
                <span className="mi-field-label">{C.form.name}</span>
                <input
                  className="mi-select"
                  type="text"
                  maxLength={24}
                  value={name}
                  placeholder={C.form.namePlaceholder}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>

            <label className="mi-wall-consent">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>{C.consentLabel}</span>
            </label>

            {formError && <p className="mi-wall-error">{formError}</p>}
            {submitted && !formError && <p className="mi-wall-success">{C.form.success}</p>}

            <button type="button" className="mi-btn" disabled={!canSubmit} onClick={onSubmit}>
              {submitting ? C.form.submitting : C.form.submit}
            </button>
          </section>

          {/* Public wall */}
          <section className="mi-section">
            <h2 className="mi-h2">{C.wallTitle}</h2>
            {total > 0 && (
              <p className="mi-wall-count">
                {total.toLocaleString()} {C.countSuffix}
              </p>
            )}

            {loading ? (
              <p className="mi-wall-loading">…</p>
            ) : pledges.length === 0 ? (
              <div className="mi-wall-empty">{C.empty}</div>
            ) : (
              <ul className="mi-wall-list">
                {pledges.map((p) => (
                  <li key={p.id} className="mi-wall-item">
                    <p className="mi-wall-item-text">“{commitmentText(p.commitmentId) || commitmentLabel(p.commitmentId)}”</p>
                    <div className="mi-wall-item-meta">
                      <span className="mi-wall-who">
                        {p.name || C.anonymous} · {roleLabel(p.roleId)}
                        {p.region ? ` · ${p.region}` : ""}
                      </span>
                      <span className="mi-wall-when">{timeAgo(p.ts)}</span>
                    </div>
                    <button
                      type="button"
                      className="mi-wall-report"
                      disabled={reported.has(p.id)}
                      onClick={() => onReport(p.id)}
                    >
                      {reported.has(p.id) ? C.reported : C.report}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {nextCursor !== null && (
              <button type="button" className="mi-btn ghost mi-wall-more" onClick={loadMore}>
                {C.loadMore}
              </button>
            )}
          </section>
        </>
      )}

      <p className="mi-wall-disclaimer">{C.disclaimer}</p>
    </div>
  );
}
