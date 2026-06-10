import { useEffect, useRef, useState } from "react";
import type { View } from "../types";
import { ROLES } from "../data/roles";
import { ONBOARDING } from "../content/copy";

export function Onboarding({
  onPick,
  onSkip,
}: {
  /** Route to a module, optionally carrying the selected role for prefill. */
  onPick: (roleId: string | null, view: View) => void;
  onSkip: () => void;
}) {
  const [roleId, setRoleId] = useState<string>("");
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape; focus the dialog on mount.
  useEffect(() => {
    dialogRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onSkip();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onSkip]);

  return (
    <div className="mi-overlay" onClick={onSkip}>
      <div
        className="mi-onboard"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mi-onboard-title"
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mi-kicker">{ONBOARDING.kicker}</p>
        <h2 id="mi-onboard-title" className="mi-onboard-title">
          {ONBOARDING.title}
        </h2>
        <p className="mi-onboard-lede">{ONBOARDING.lede}</p>

        <label className="mi-field">
          <span className="mi-field-label">{ONBOARDING.roleLabel}</span>
          <select
            className="mi-select"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
          >
            <option value="">{ONBOARDING.rolePlaceholder}</option>
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mi-field">
          <span className="mi-field-label">{ONBOARDING.intentsLabel}</span>
          <div className="mi-onboard-intents">
            {ONBOARDING.intents.map((it) => (
              <button
                key={it.id}
                type="button"
                className="mi-intent"
                onClick={() => onPick(roleId || null, it.view)}
              >
                <span className="mi-intent-title">{it.title}</span>
                <span className="mi-intent-body">{it.body}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="mi-onboard-skip" onClick={onSkip}>
          {ONBOARDING.skip}
        </button>
      </div>
    </div>
  );
}
