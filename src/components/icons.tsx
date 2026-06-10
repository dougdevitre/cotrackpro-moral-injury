import type { ReactElement } from "react";
import type { View } from "../types";

/** Minimal line-art icons (24px grid, stroke = currentColor) for nav + cards. */
const PATHS: Record<View, ReactElement> = {
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
    </>
  ),
  course: (
    <>
      <path d="M3 8.5l9-4 9 4-9 4-9-4z" />
      <path d="M7 10.5V15c0 1 2.7 2.5 5 2.5s5-1.5 5-2.5v-4.5" />
    </>
  ),
  reflect: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  decide: (
    <>
      <path d="M12 21V11" />
      <path d="M12 11L6.5 5.5" />
      <path d="M12 11l5.5-5.5" />
      <circle cx="12" cy="4" r="1.4" />
      <circle cx="5" cy="4.6" r="1.4" />
      <circle cx="19" cy="4.6" r="1.4" />
    </>
  ),
  practice: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  commit: (
    <>
      <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      <path d="M9 11.5l2 2 4-4" />
    </>
  ),
  standards: (
    <>
      <path d="M12 4v16" />
      <path d="M5 20h14" />
      <path d="M6 7h12" />
      <path d="M6 7l-2.2 5h4.4L6 7z" />
      <path d="M18 7l-2.2 5h4.4L18 7z" />
    </>
  ),
  longview: (
    <>
      <path d="M4 18h16" />
      <path d="M4 16l5-6 4 3 7-8" />
      <circle cx="20" cy="5" r="1.2" />
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
};

export function Icon({ name, size = 18 }: { name: View; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
