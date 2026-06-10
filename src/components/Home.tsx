import type { View } from "../types";
import { HOME, LANDING } from "../content/copy";
import { ROLES } from "../data/roles";
import { Icon } from "./icons";

export function Home({ onNavigate }: { onNavigate: (v: View) => void }) {
  const L = LANDING;
  return (
    <div className="mi-landing mi-fade">
      {/* Hero */}
      <section className="mi-hero">
        <p className="mi-kicker">{L.hero.kicker}</p>
        <h1 className="mi-hero-title">
          {L.hero.title} <span className="accent">{L.hero.titleAccent}</span>
        </h1>
        <p className="mi-hero-sub">{L.hero.subtitle}</p>
        <div className="mi-hero-cta">
          <button className="mi-btn" onClick={() => onNavigate(L.hero.primary.view)}>
            {L.hero.primary.label} →
          </button>
          <button className="mi-btn ghost" onClick={() => onNavigate(L.hero.secondary.view)}>
            {L.hero.secondary.label}
          </button>
        </div>
        <p className="mi-hero-trust">{L.hero.trust}</p>
      </section>

      {/* How it works */}
      <section className="mi-section">
        <div className="mi-steps">
          {L.steps.map((s) => (
            <button key={s.n} className="mi-step" onClick={() => onNavigate(s.view)}>
              <span className="mi-step-n">{s.n}</span>
              <span className="mi-step-t">{s.title}</span>
              <span className="mi-step-b">{s.body}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Value pillars */}
      <section className="mi-section">
        <div className="mi-pillars">
          {L.pillars.map((p) => (
            <div key={p.title} className="mi-pillar">
              <span className="mi-pillar-t">{p.title}</span>
              <span className="mi-pillar-b">{p.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="mi-section">
        <h2 className="mi-section-h">{L.forWhoTitle}</h2>
        <div className="mi-roles-strip">
          {ROLES.filter((r) => r.id !== "other").map((r) => (
            <span key={r.id} className="mi-role-chip">
              {r.label}
            </span>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="mi-section">
        <h2 className="mi-section-h">{L.modulesTitle}</h2>
        <p className="mi-section-lede">{L.modulesLede}</p>
        <div className="mi-home-grid">
          {HOME.cards.map((c) => (
            <button key={c.view} className="mi-home-card" onClick={() => onNavigate(c.view)}>
              <span className="mi-home-ico" aria-hidden="true">
                <Icon name={c.view} size={22} />
              </span>
              <span className="mi-home-step">{c.title}</span>
              <span className="mi-home-body">{c.body}</span>
              <span className="mi-home-cta">{c.cta} →</span>
            </button>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="mi-closing">
        <h2 className="mi-closing-h">{L.closing.title}</h2>
        <p className="mi-closing-b">{L.closing.body}</p>
        <button className="mi-btn" onClick={() => onNavigate(L.closing.cta.view)}>
          {L.closing.cta.label} →
        </button>
      </section>
    </div>
  );
}
