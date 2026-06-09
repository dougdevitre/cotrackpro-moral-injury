import {
  ABA_DISCLAIMER,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  RULES_TOC_URL,
  rulesByCategory,
} from "../data/rules";
import { STANDARDS } from "../content/copy";

export function RulesReference() {
  return (
    <div className="mi-fade">
      <p className="mi-kicker">{STANDARDS.kicker}</p>
      <h1 className="mi-h1">{STANDARDS.title}</h1>
      <p className="mi-lede">{STANDARDS.lede}</p>

      <div className="mi-disc" style={{ marginTop: 0, marginBottom: 26 }}>
        {ABA_DISCLAIMER}{" "}
        <a className="mi-a" href={RULES_TOC_URL} target="_blank" rel="noopener noreferrer">
          Browse all Model Rules on the ABA site →
        </a>
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const rules = rulesByCategory(cat);
        if (rules.length === 0) return null;
        return (
          <section key={cat} style={{ marginBottom: 26 }}>
            <p className="mi-section-tag">{CATEGORY_LABELS[cat]}</p>
            <div className="mi-rule-list">
              {rules.map((r) => (
                <a
                  key={r.id}
                  className="mi-rule-item"
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="mi-rule-badge">{r.id}</span>
                  <span className="mi-rule-body">
                    <span className="mi-rule-title">{r.title}</span>
                    <span className="mi-rule-summary">{r.summary}</span>
                  </span>
                  <span className="mi-rule-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
