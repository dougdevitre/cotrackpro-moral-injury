import { COPY } from "../content/copy";

export function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="mi-fade">
      <p className="mi-kicker">{COPY.kicker}</p>
      <h1 className="mi-h1">{COPY.title}</h1>
      <p className="mi-lede">{COPY.lede}</p>
      <div className="mi-card">
        <p className="mi-p">{COPY.introBody1}</p>
        <p className="mi-p" style={{ marginBottom: 0 }}>
          {COPY.introBody2}
        </p>
      </div>
      <div className="mi-navrow" style={{ justifyContent: "flex-start" }}>
        <button className="mi-btn" onClick={onBegin}>
          Begin
        </button>
      </div>
      <div className="mi-disc">{COPY.introDisclaimer}</div>
    </div>
  );
}
