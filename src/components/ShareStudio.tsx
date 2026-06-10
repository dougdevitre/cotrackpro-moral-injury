import { useEffect, useRef, useState } from "react";
import type { ScoreProfile } from "../types";
import { ROLES } from "../data/roles";
import { SHARE } from "../content/copy";
import { renderPoster, type PosterFormat } from "../lib/share/poster";

export function ShareStudio({
  profile,
  defaultRoleId,
  onToast,
}: {
  profile: ScoreProfile | null;
  /** Fallback role (e.g. captured during onboarding) when no reflection exists. */
  defaultRoleId?: string | null;
  onToast: (msg: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [roleId, setRoleId] = useState<string>(
    profile?.roleId ?? defaultRoleId ?? ROLES[0].id
  );
  const [messageId, setMessageId] = useState<string>(SHARE.messages[0].id);
  const [format, setFormat] = useState<PosterFormat>("square");

  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0];
  const message = SHARE.messages.find((m) => m.id === messageId) ?? SHARE.messages[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderPoster(canvas, { message: message.text, roleLabel: role.label, format });
  }, [message.text, role.label, format]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cotrackpro-${message.id}-${format}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onToast("Image downloaded to this device");
    }, "image/png");
  }

  return (
    <div className="mi-share mi-fade">
      <p className="mi-kicker">{SHARE.kicker}</p>
      <h1 className="mi-h1">{SHARE.title}</h1>
      <p className="mi-lede">{SHARE.lede}</p>

      <div className="mi-share-grid">
        <div className="mi-share-controls">
          <div className="mi-field">
            <span className="mi-field-label">{SHARE.messageLabel}</span>
            <div className="mi-msg-options">
              {SHARE.messages.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={"mi-msg-option" + (m.id === messageId ? " active" : "")}
                  aria-pressed={m.id === messageId}
                  onClick={() => setMessageId(m.id)}
                >
                  {m.text}
                </button>
              ))}
            </div>
          </div>

          <label className="mi-field">
            <span className="mi-field-label">{SHARE.roleLabel}</span>
            <select
              className="mi-select"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mi-field">
            <span className="mi-field-label">{SHARE.formatLabel}</span>
            <div className="mi-format-row">
              {SHARE.formats.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={"mi-format-btn" + (f.id === format ? " active" : "")}
                  aria-pressed={f.id === format}
                  onClick={() => setFormat(f.id)}
                >
                  <span className="mi-format-name">{f.label}</span>
                  <span className="mi-format-hint">{f.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="mi-btn" onClick={handleDownload}>
            {SHARE.download} ↓
          </button>
        </div>

        <div className="mi-share-preview">
          <canvas
            ref={canvasRef}
            className={"mi-share-canvas " + format}
            role="img"
            aria-label={`Preview: "${message.text}" — ${role.label}`}
          />
        </div>
      </div>
    </div>
  );
}
