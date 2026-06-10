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
      <button className="mi-brand" onClick={() => onNavigate("home")}>
        <img
          className="mi-logo"
          src="https://assets.cotrackpro.com/CoTrackPro%2BLogo.jpg"
          alt=""
          width={28}
          height={28}
        />
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
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
