import type { Subscale } from "../types";

export const SUB_META: Record<Subscale, { label: string; note: string }> = {
  SELF: { label: "Self-transgression", note: "Acts you took that went against your values." },
  WITNESS: { label: "Witnessed transgression", note: "Harm you saw and could not prevent." },
  BETRAYAL: { label: "Betrayal & constraint", note: "Being failed or blocked by the system." },
  DISTRESS: { label: "Personal distress", note: "How heavily this sits with you now." },
};

export const COPY = {
  kicker: "CoTrackPro · Practitioner Wellbeing",
  title: "Moral Injury Self-Reflection",
  lede:
    "A private, unhurried look at the moral weight you may be carrying from work inside the family-law system — and where to take it next.",
  introBody1:
    "Moral injury is the lasting impact of perpetrating, failing to prevent, or witnessing acts that violate deeply held moral beliefs (Litz et al., 2009). It is distinct from burnout, and it shows up in people who care.",
  introBody2:
    "This is not a test and not a verdict. It will not tell you that you are a good or bad person. It separates what you have been exposed to from how it is affecting you, reflects that back honestly, and points you toward support and, if you want it, repair. Your answers stay on this screen.",
  introDisclaimer:
    "Educational and reflective only. It is not a clinical diagnosis, a mental-health treatment, or legal advice, and it does not create any professional record. If you are in distress, please reach a qualified professional.",
  indicesExplainer:
    "Exposure is how much morally difficult work you have encountered. Distress is how heavily it sits with you now. High exposure does not have to become a lasting wound — and that gap is where support does its work.",
  footerDisclaimer:
    "This is a confidential self-reflection screener adapted from established frameworks — it is not a validated clinical instrument, a diagnosis, or a legal assessment, and the numbers are reflective bands, not precise measurements. It does not create a professional or court record. Nothing here establishes wrongdoing or liability. For mental-health concerns, consult a licensed clinician; for conduct questions, consult a confidential ethics resource for your profession.",
  grounding:
    "Grounded in: Litz et al. (2009); Shay (1995); Nash et al., Moral Injury Events Scale (2013); Jameton (1984) on moral distress; Epstein et al. (2019); Talbot & Dean (2018).",
};

export const HOME = {
  kicker: "CoTrackPro · Practitioner Wellbeing",
  title: "Staying whole in hard work",
  lede:
    "A small toolkit for professionals in the family-law system: understand the moral weight you carry, make cleaner calls under pressure, and build habits that keep your practice aligned with your values.",
  cards: [
    {
      view: "course" as const,
      title: "Take the course (CLE/CE)",
      body: "The full self-study course — objectives, modules, knowledge check, and a certificate of completion you can submit for credit.",
      cta: "Start the course",
    },
    {
      view: "reflect" as const,
      title: "Reflect",
      body: "A confidential self-reflection on the moral weight you may be carrying — and where to take it.",
      cta: "Start a reflection",
    },
    {
      view: "decide" as const,
      title: "Decide",
      body: "Short, guided checks for when a decision feels off and you have to act soon.",
      cta: "Open the decision guides",
    },
    {
      view: "practice" as const,
      title: "Practice",
      body: "Build if-then habits and reminders that protect your ethics before pressure hits.",
      cta: "Build a practice plan",
    },
    {
      view: "commit" as const,
      title: "Commit",
      body: "Make a personal declaration to prevent moral injury — and generate a certificate you can sign and keep.",
      cta: "Make your commitment",
    },
    {
      view: "standards" as const,
      title: "Standards",
      body: "A plain-language reference to the professional-conduct rules most relevant to family-law work.",
      cta: "Open the standards reference",
    },
    {
      view: "longview" as const,
      title: "The long view",
      body: "See how a single action or inaction can ripple across a child's life — and where your leverage to protect them sits.",
      cta: "See the long view",
    },
  ],
};

export const DECIDE = {
  kicker: "Decide",
  title: "Decision guides",
  lede:
    "Pick the guide that fits the moment. Each takes a minute and is for clarifying your own thinking — none of it is legal advice.",
};

export const PRACTICE = {
  kicker: "Practice",
  title: "Your ethics practice plan",
  lede:
    "You will not out-willpower pressure in the moment — ethics tends to slip exactly when you are busy, tired, or competing, and usually without you noticing. So you pre-decide: build small if-then plans tied to the cues that put you most at risk.",
  grounding:
    "Grounded in: implementation intentions / if-then plans (Gollwitzer, 1999); ethical fading & bounded ethicality (Bazerman & Tenbrunsel, Blind Spots, 2011); Fogg, Tiny Habits.",
  privacyNote:
    "Your plan lives on this screen. Turn on 'Keep on this device' to have it remembered here (stored only in this browser, nothing transmitted) — clear it anytime.",
  emptyState: "Add a commitment, pick a suggested habit, or write your own if-then plan to get started.",
};

export const STANDARDS = {
  kicker: "Standards",
  title: "Professional-conduct standards",
  lede:
    "The rules of professional conduct most relevant to family-law work, in plain language, with links to the official text. A grounding reference — not a substitute for reading your own jurisdiction's rules.",
};

export const LONGVIEW = {
  kicker: "The long view",
  title: "How today lands on a child",
  lede:
    "A single decision rarely determines a child's whole life — outcomes are probabilistic, not fixed, and they can be buffered. But two things are well established: childhood adversity accumulates in a dose-response way, and the strongest protection is reduced conflict plus a stable, caring relationship with at least one adult. You sit on both levers. The same decision can add a dose of adversity or a layer of protection.",
  framing:
    "This is for seeing that leverage clearly — not for carrying dread. Pick an action to follow it across a child's life.",
  leverageLabel: "Your leverage",
  horizonLabels: {
    short: "In the moment",
    mechanism: "Why it lands",
    long: "Over a lifetime",
  },
  disclaimer:
    "Educational only. These are research-based patterns about risk and protection — not diagnoses, and not predictions about any specific child. Outcomes depend on many factors and can be buffered; the science is clear that it is never too late to make things better.",
  addHabit: "Add this as a habit",
  addedHabit: "In your practice plan ✓",
};

export const COMMIT = {
  kicker: "Commit",
  title: "Your commitment declaration",
  lede:
    "Moral injury is easier to prevent than to repair. Choose the protective practices you're willing to pledge, add one in your own words if you like, and generate a personal certificate you can sign, print, and keep where you'll see it.",
  intro: "Affirm the commitments you're ready to make:",
  personalLabel: "Add a commitment in your own words (optional)",
  personalPlaceholder: "When ___ happens, I will ___.",
  nameLabel: "Your name (as it should appear on the certificate)",
  namePlaceholder: "Full name",
  attest:
    "I am making these commitments to myself, freely. I understand this is a personal pledge — not a credential, clinical assessment, or legal advice.",
  generate: "Generate my certificate",
  poster: "Make a shareable poster",
  needName: "Add your name and affirm at least one commitment to generate your certificate.",
  generated: "Opening your certificate — choose “Save as PDF” in the print dialog.",
  posterDone: "Opening your poster — choose “Save as PDF” in the print dialog.",
  disclaimer:
    "This declaration is a private, on-device tool for your own wellbeing and ethical practice. It is non-diagnostic and informational only, and confers no professional standing.",
};

export const FOOTER = {
  privacy: "Private by design — nothing you enter here is transmitted or stored off your device.",
  aboutLink: "About & evidence",
};

export const ABOUT = {
  kicker: "About",
  title: "What this is, and what it rests on",
  intro:
    "A small toolkit to help professionals in the family-law system stay aligned with their own values — by understanding the moral weight they carry, deciding well under pressure, practicing protective habits, and seeing how their choices land on children.",
  principles: [
    {
      h: "Reflective, not accusatory",
      p: "Nothing here issues a verdict on you. The reflection separates what you were exposed to from how it affects you, and surfaces self-transgression only where you report it.",
    },
    {
      h: "Leverage, not dread",
      p: "Every harm pathway is paired with the protective move in your control. Guilt with agency moves people to act; shame mostly produces avoidance.",
    },
    {
      h: "Probabilistic, not deterministic",
      p: "Childhood outcomes are shaped by many factors and can be buffered. We say 'increases the risk,' never 'will cause.'",
    },
    {
      h: "Private by design",
      p: "There is no backend. Answers and notes stay in your session; the practice plan persists only if you opt in, only on your device, and can be cleared anytime.",
    },
    {
      h: "Educational, not advice",
      p: "This is not a clinical diagnosis, a validated instrument, or legal advice. For real conduct or mental-health questions, consult the appropriate professional.",
    },
  ],
};
