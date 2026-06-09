import type { View } from "../types";

const TABS: { view: View; label: string }[] = [
  { view: "course", label: "Course" },
  { view: "reflect", label: "Reflect" },
  { view: "decide", label: "Decide" },
  { view: "practice", label: "Practice" },
  { view: "standards", label: "Standards" },
  { view: "longview", label: "Long view" },
];

export function Nav({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  return (
    <header className="mi-nav">
      <button className="mi-wordmark" onClick={() => onNavigate("home")}>
        CoTrackPro
      </button>
      <nav className="mi-tabs" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.view}
            className={"mi-tab" + (view === t.view ? " active" : "")}
            aria-current={view === t.view ? "page" : undefined}
            onClick={() => onNavigate(t.view)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
