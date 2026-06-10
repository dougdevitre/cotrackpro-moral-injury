import type { View } from "../types";
import { HOME } from "../content/copy";
import { Icon } from "./icons";

export function Home({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="mi-fade">
      <p className="mi-kicker">{HOME.kicker}</p>
      <h1 className="mi-h1">{HOME.title}</h1>
      <p className="mi-lede">{HOME.lede}</p>
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
    </div>
  );
}
