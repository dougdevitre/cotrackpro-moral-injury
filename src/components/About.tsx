import { ABOUT } from "../content/copy";
import { LONG_VIEW_EVIDENCE } from "../data/longView";
import { RULES_TOC_URL } from "../data/rules";

interface EvidenceRef {
  cite: string;
  url?: string;
}
interface EvidenceGroup {
  domain: string;
  items: EvidenceRef[];
}

const EVIDENCE_GROUPS: EvidenceGroup[] = [
  {
    domain: "Moral injury & moral distress",
    items: [
      { cite: "Litz et al. (2009). Moral injury and moral repair in war veterans. Clinical Psychology Review." },
      { cite: "Shay (1995). Achilles in Vietnam: Combat Trauma and the Undoing of Character." },
      { cite: "Nash et al. (2013). Moral Injury Events Scale. Military Medicine." },
      { cite: "Jameton (1984). Nursing Practice: The Ethical Issues — origin of 'moral distress.'" },
      { cite: "Epstein et al. (2019). Measure of Moral Distress for Healthcare Professionals." },
      { cite: "Talbot & Dean (2018). Physicians aren't 'burning out' — moral injury reframing." },
    ],
  },
  {
    domain: "Deciding well under pressure",
    items: [
      { cite: "Blanchard & Peale (1988). The Power of Ethical Management — the ethics check." },
      { cite: "Markkula Center for Applied Ethics — A Framework for Ethical Decision Making (five lenses)." },
    ],
  },
  {
    domain: "Behavior change",
    items: [
      { cite: "Gollwitzer (1999). Implementation intentions ('if-then' plans). American Psychologist." },
      { cite: "Bazerman & Tenbrunsel (2011). Blind Spots — ethical fading and bounded ethicality." },
    ],
  },
  {
    domain: "How choices land on a child",
    items: LONG_VIEW_EVIDENCE.map((e) => ({ cite: e.cite, url: e.url })),
  },
  {
    domain: "Professional standards",
    items: [
      {
        cite: "ABA Model Rules of Professional Conduct (a template; your jurisdiction's adopted rules govern).",
        url: RULES_TOC_URL,
      },
    ],
  },
];

export function About() {
  return (
    <div className="mi-fade">
      <p className="mi-kicker">{ABOUT.kicker}</p>
      <h1 className="mi-h1">{ABOUT.title}</h1>
      <p className="mi-lede">{ABOUT.intro}</p>

      <h2 className="mi-h2" style={{ fontSize: 20 }}>
        Design principles
      </h2>
      <div className="mi-about-principles">
        {ABOUT.principles.map((pr) => (
          <div key={pr.h} className="mi-about-principle">
            <p className="mi-about-h">{pr.h}</p>
            <p className="mi-about-p">{pr.p}</p>
          </div>
        ))}
      </div>

      <h2 className="mi-h2" style={{ fontSize: 20, marginTop: 32 }}>
        Evidence base
      </h2>
      {EVIDENCE_GROUPS.map((g) => (
        <section key={g.domain} style={{ marginBottom: 18 }}>
          <p className="mi-section-tag">{g.domain}</p>
          <ul className="mi-cite-list">
            {g.items.map((it, i) => (
              <li key={i}>
                {it.url ? (
                  <a className="mi-a" href={it.url} target="_blank" rel="noopener noreferrer">
                    {it.cite} ↗
                  </a>
                ) : (
                  it.cite
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
