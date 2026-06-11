import { useEffect, useRef } from "react";
import type { View } from "../types";
import { Icon } from "./icons";
import logoUrl from "../assets/cotrackpro-logo.jpg";

const TABS: { view: View; label: string }[] = [
  { view: "course", label: "Course" },
  { view: "reflect", label: "Reflect" },
  { view: "decide", label: "Decide" },
  { view: "practice", label: "Practice" },
  { view: "commit", label: "Commit" },
  { view: "encourage", label: "Encourage" },
  { view: "share", label: "Share" },
  { view: "standards", label: "Standards" },
  { view: "longview", label: "Long view" },
  { view: "leaders", label: "Leaders" },
  { view: "calculator", label: "Calculator" },
  { view: "wall", label: "Pledge wall" },
];

export function Nav({ view, onNavigate }: { view: View; onNavigate: (v: View) => void }) {
  const activeRef = useRef<HTMLButtonElement>(null);

  // Keep the current tab visible in the horizontally-scrolling strip (with 12
  // tabs the active one can otherwise sit off-screen). Horizontal only.
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    activeRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [view]);

  return (
    <header className="mi-nav">
      <div className="mi-nav-inner">
        <button className="mi-brand" onClick={() => onNavigate("home")} aria-label="CoTrackPro home">
          <img className="mi-logo" src={logoUrl} alt="" height={30} />
          <span className="mi-wordmark">CoTrackPro</span>
        </button>
        <nav className="mi-tabs" aria-label="Sections">
          {TABS.map((t) => (
            <button
              key={t.view}
              ref={view === t.view ? activeRef : undefined}
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
