import type { Role } from "../types";
import { ROLES } from "../data/roles";

interface Props {
  selected: Role | null;
  onSelect: (role: Role) => void;
  onBack: () => void;
  onNext: () => void;
}

export function RoleSelect({ selected, onSelect, onBack, onNext }: Props) {
  return (
    <div className="mi-fade">
      <p className="mi-kicker">Step 1 of 2</p>
      <h2 className="mi-h2">Which best describes your role?</h2>
      <p className="mi-p">We use this only to frame the reflection for the work you actually do.</p>
      <div className="mi-roles">
        {ROLES.map((r) => (
          <button
            key={r.id}
            className={"mi-role" + (selected?.id === r.id ? " sel" : "")}
            aria-pressed={selected?.id === r.id}
            onClick={() => onSelect(r)}
          >
            {r.label}
            <small>{r.lens}</small>
          </button>
        ))}
      </div>
      <div className="mi-navrow">
        <button className="mi-btn ghost" onClick={onBack}>
          Back
        </button>
        <button className="mi-btn" disabled={!selected} onClick={onNext}>
          Start reflection
        </button>
      </div>
    </div>
  );
}
