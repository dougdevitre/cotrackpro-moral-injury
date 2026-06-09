import type { View } from "../types";
import { FOOTER } from "../content/copy";

export function Footer({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <footer className="mi-footer">
      <span className="mi-footer-privacy">{FOOTER.privacy}</span>
      <button className="mi-a mi-footer-link" onClick={() => onNavigate("about")}>
        {FOOTER.aboutLink}
      </button>
    </footer>
  );
}
