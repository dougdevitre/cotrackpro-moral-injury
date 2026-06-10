import type { View } from "../types";
import { Icon } from "./icons";

const TABS: { view: View; label: string }[] = [
  { view: "course", label: "Course" },
  { view: "reflect", label: "Reflect" },
  { view: "decide", label: "Decide" },
  { view: "practice", label: "Practice" },
  { view: "commit", label: "Commit" },
  { view: "share", label: "Share" },
  { view: "standards", label: "Standards" },
  { view: "longview", label: "Long view" },
];

export function Nav({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  return (
    <header className="mi-nav">
      <div className="mi-nav-inner">
        <button className="mi-brand" onClick={() => onNavigate("home")} aria-label="CoTrackPro home">
          <img className="mi-logo" src="/logo.jpg" alt="" width={28} height={28} />
          <span className="mi-wordmark">CoTrackPro</span>
        </button>
        <nav className="mi-tabs" aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.view}
              className={"mi-tab" + (view === t.view ? " active" : "")}
              aria-current={view === t.view ? "page" : undefined}
              onClick={() => onNavigate(t.view)}
            >
              <Icon name={t.view} size={16} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
