import type { Subscale } from "../types";
import type { ClimateItem } from "../lib/climate";

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
      view: "encourage" as const,
      title: "Encourage",
      body: "Log the moments you did the right thing, read how others held the line, and build the moral strength that notices itself.",
      cta: "Open encouragement",
    },
    {
      view: "share" as const,
      title: "Share",
      body: "Generate a clean, on-brand image of your commitment to ethical practice — rendered privately on your device, ready to post.",
      cta: "Open the share studio",
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
    {
      view: "leaders" as const,
      title: "For leaders",
      body: "Supervisors, judges, and directors: read your team's ethical climate and build an environment where doing right is the easy path.",
      cta: "Build a moral environment",
    },
  ],
};

export const LANDING = {
  hero: {
    kicker: "CoTrackPro · Practitioner Wellbeing",
    title: "Do the right thing —",
    titleAccent: "especially when no one is looking.",
    subtitle:
      "A confidential toolkit for everyone in the family-law system. Understand the moral weight you carry, make cleaner calls under pressure, and build habits that keep your work aligned with your values — even when cutting a corner would be easier, more profitable, or invisible.",
    primary: { label: "Start a reflection", view: "reflect" as const },
    secondary: { label: "Take the CLE/CE course", view: "course" as const },
    trust: "Private by design — nothing you enter is transmitted or stored off your device.",
  },
  steps: [
    {
      n: "01",
      title: "See the weight",
      body: "A short, confidential reflection separates what you've been exposed to from how it's landing on you.",
      view: "reflect" as const,
    },
    {
      n: "02",
      title: "Decide well under pressure",
      body: "Quick guided checks for the moments a deadline, a fee, or 'winning' pulls you off course.",
      view: "decide" as const,
    },
    {
      n: "03",
      title: "Commit to staying whole",
      body: "Turn it into if-then habits and a personal pledge you can sign, keep, and share.",
      view: "commit" as const,
    },
  ],
  pillars: [
    {
      title: "Private by design",
      body: "Everything stays on your device. No accounts, no tracking of what you reflect on.",
    },
    {
      title: "Grounded in the evidence",
      body: "Built on the moral-injury literature and the professional-conduct rules your role actually touches.",
    },
    {
      title: "Tailored to your role",
      body: "Attorneys, judges, GALs, evaluators, mediators, caseworkers — the content meets you where you work.",
    },
    {
      title: "Built to act on",
      body: "Not a quiz that ends in a score — it ends in habits, decisions, and a commitment you can hold.",
    },
  ],
  forWhoTitle: "Made for everyone in the family-law system",
  modulesTitle: "Everything in the toolkit",
  modulesLede: "Five minutes or an afternoon — start anywhere.",
  closing: {
    title: "Integrity is what you do when it costs you something.",
    body: "Money, status, and standing in the community all reward cutting corners. This is a place to practice the other thing — quietly, on your own terms.",
    cta: { label: "Make your commitment", view: "commit" as const },
  },
};

const LEADERS_CLIMATE_ITEMS: ClimateItem[] = [
  { id: "s1", dim: "safe", text: "People can raise an ethical concern here without fear of retaliation." },
  { id: "s2", dim: "safe", text: "Dissent — “this doesn't feel right” — is treated as valuable, not disloyal." },
  { id: "s3", dim: "safe", text: "When something goes wrong, we respond with learning rather than blame." },
  { id: "l1", dim: "load", text: "Caseloads and deadlines are humane enough to do careful, ethical work." },
  { id: "l2", dim: "load", text: "People have the time and resources to do right, not only to do fast." },
  { id: "l3", dim: "load", text: "When someone is stretched past their limit, we notice and adjust." },
  { id: "b1", dim: "backed", text: "When someone does the right thing at a personal cost, we back them." },
  { id: "b2", dim: "backed", text: "We recognize integrity, not just outcomes and numbers." },
  { id: "b3", dim: "backed", text: "People know where to take a moral concern and trust it will be heard." },
];

export const LEADERS = {
  kicker: "For leaders",
  title: "Build a moral environment",
  lede:
    "Moral injury is usually a systems problem, not a character problem. As a supervisor, judge, managing partner, or director, you shape the conditions that make doing right easy or costly. Here's how to read your team's climate and improve it.",
  climate: {
    title: "Ethical-climate check",
    lede:
      "A quick, private read on your team's moral environment — not a performance review. Rate how true each statement is right now.",
    scale: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"],
    items: LEADERS_CLIMATE_ITEMS,
    resultTitle: "Your team's climate",
    retake: "Retake the check",
    bandRead: {
      strong:
        "Your team has real protective strength. Keep naming it out loud — climates like this are maintained, not finished.",
      mixed:
        "There's a foundation here, with clear gaps. Pick the lowest area below and make one concrete change this month.",
      "at-risk":
        "This is the soil moral injury grows in. That's a signal, not a verdict on you — start with the lowest area below, and you don't have to fix it alone.",
    },
    dimMove: {
      safe: "Make it safe to speak: explicitly invite dissent at your next team meeting, and visibly thank the first person who uses it.",
      load: "Fix the drivers: name one unsustainable load this week and remove or redistribute it — don't ask people to absorb it quietly.",
      backed:
        "Back integrity: the next time someone does right at a cost, say so publicly and make sure the organization stands behind them.",
    },
  },
  playbookTitle: "The leader's playbook",
  playbook: [
    {
      id: "model",
      title: "Model it in the open",
      practices: [
        "Say out loud when you choose the harder right — including when it costs you.",
        "Admit your own mistakes first; it sets the price of honesty low for everyone.",
        "Tie decisions to values, not just rules or optics.",
      ],
    },
    {
      id: "safe",
      title: "Make it safe to speak",
      practices: [
        "Invite dissent by name; treat “this feels wrong” as a contribution.",
        "Separate blame from learning when something goes wrong (just culture).",
        "Protect the messenger — never let raising a concern cost someone.",
      ],
    },
    {
      id: "debrief",
      title: "Debrief the hard ones",
      practices: [
        "Run a short moral debrief after morally hard cases, not just busy ones.",
        "Ask what felt forced against people's values, and what was outside their control.",
        "Close with one concrete change — and follow up on it.",
      ],
    },
    {
      id: "drivers",
      title: "Fix the drivers",
      practices: [
        "Treat impossible load as a system problem, not a personal failing.",
        "Guard time and resources for careful work; resist “just do it faster.”",
        "Watch for the signs — cynicism, withdrawal, turnover — and act early.",
      ],
    },
    {
      id: "reward",
      title: "Reward integrity, not just outcomes",
      practices: [
        "Recognize the quiet right calls, not only wins and numbers.",
        "Make escalation paths clear, and act on what comes up.",
        "Back people publicly when they do right at a cost.",
      ],
    },
  ],
  pledgeTitle: "A leader's pledge",
  pledgeLede: "Six commitments to the people whose moral environment you shape.",
  pledgeNameLabel: "Your name (optional)",
  pledgePrint: "Print my leader's pledge",
  pledge: [
    "I will protect people who raise concerns or do right at a cost.",
    "I will treat dissent as data, not disloyalty.",
    "I will run debriefs after morally hard cases, not only busy ones.",
    "I will name and adjust unsustainable load instead of normalizing it.",
    "I will recognize integrity, not only outcomes and numbers.",
    "I will keep escalation paths clear and act on what I hear.",
  ],
  toolkitsTitle: "Printable toolkit",
  debriefPrint: "Print the moral-debrief guide",
  debrief: {
    when:
      "Run a moral debrief after any case that left people feeling they had to act against their values, witnessed harm they couldn't prevent, or were let down by the system.",
    groundRules: [
      "No blame — this is about the situation and its constraints, not a person's competence.",
      "Confidential; what's said here stays here.",
      "Describe behavior and constraints, not character.",
      "It's okay to say “I don't know” or “this still sits wrong with me.”",
    ],
    prompts: [
      "What about this case felt morally hard?",
      "Where did we feel forced to act against our values?",
      "What was within our control — and what wasn't?",
      "What did we do right, even under pressure?",
      "What's one thing we'll change, and who owns it?",
    ],
    close:
      "Name what was outside anyone's control, acknowledge the weight people are carrying, and end with the one change you're committing to.",
  },
};

export const ENCOURAGE = {
  kicker: "Encourage",
  title: "The work you do right matters",
  lede:
    "Moral strength is built by noticing it. Log the moments you held the line, read how others have, and let it remind you who you are under pressure.",
  affirmations: [
    "Doing right quietly, when no one is watching, is the whole game — and you're playing it.",
    "You can carry hard things and still protect your integrity. You've done it before.",
    "Small acts of honesty compound into a reputation you can stand on.",
    "Choosing the harder right over the easier wrong is courage. Name it as such.",
    "You're allowed to protect a child's wellbeing even when it's inconvenient.",
    "Your steadiness under pressure is a gift to everyone who depends on this system.",
    "Integrity rarely gets applause. It still changes lives. Yours does.",
  ],
  winsTitle: "Your moral wins",
  winsLede: "Capture a moment you did the right thing — even a small one. Private to this device.",
  winsPlaceholder: "e.g. I disclosed the unfavorable fact even though it hurt my case.",
  winsAdd: "Log this win",
  winsEmpty: "No wins logged yet. Next time you hold the line, come back and name it.",
  winsKeep: "Keep my wins on this device",
  winsKept: "Saved on this device",
  winsPrint: "Print my wins",
  winsRemove: "Remove",
  winsRemoved: "Win removed",
  winsLogged: "Win logged — that counts.",
  exemplarsTitle: "How others held the line",
  exemplars: [
    {
      role: "Family law attorney",
      text: "A client demanded I bury a damaging document. I explained that the duty of candor protects them too — and filed it. We lost a motion; we kept our license and our name.",
    },
    {
      role: "Custody evaluator",
      text: "I caught myself favoring the parent who was easier to talk to. I went back to the data, re-interviewed, and wrote what the evidence actually showed.",
    },
    {
      role: "Judge",
      text: "A packed docket tempted me to rubber-stamp an agreed order that didn't sit right. I took the extra ten minutes to question it. A child's schedule changed for the better.",
    },
    {
      role: "Caseworker",
      text: "I was pressured to close a case to hit a number. I documented why it wasn't safe to close and held it open. Once it was in writing, my supervisor backed me.",
    },
    {
      role: "Mediator",
      text: "When one party kept steamrolling the other, I paused and reset the ground rules rather than push a fast settlement. The agreement that emerged actually held.",
    },
  ],
};

export const DAILY = {
  kicker: "Today's reflection",
  done: "I reflected on this today",
  doneState: "Logged for today — see you tomorrow",
  streakStart: "Start a daily streak",
  prompts: [
    "Where did you feel a pull between what was easy and what was right today?",
    "What's one boundary that protected your integrity this week?",
    "Whose wellbeing are you carrying that isn't yours to fix alone?",
    "What would “doing right when no one is looking” look like in your next case?",
    "Name one thing you witnessed that you haven't had time to process.",
    "What corner are you tempted to cut — and what would holding the line cost you?",
    "Who could you ask for help before the pressure peaks?",
    "What part of today are you quietly proud of, even if no one noticed?",
    "Where did you stay silent when you wished you'd spoken?",
    "What's one practice that keeps you steady under a deadline?",
    "Whose perspective have you stopped considering lately?",
    "What does rest look like for you this week — and when will you take it?",
    "What value do you most want your work to reflect tomorrow?",
    "Where are you confusing what's legal with what's right?",
    "What would you do differently if you weren't afraid of the outcome?",
    "Who reminded you recently why this work matters?",
  ],
};

export const ONBOARDING = {
  kicker: "Welcome",
  title: "Where should we start?",
  lede:
    "A few private tools for staying whole in hard work. Tell us a little and we'll point you to the right one — nothing is saved or sent.",
  roleLabel: "Your role (optional)",
  rolePlaceholder: "Select your role…",
  intentsLabel: "What brings you here today?",
  skip: "I'll explore on my own",
  intents: [
    {
      id: "weight",
      view: "reflect" as const,
      title: "I'm feeling the weight of this work",
      body: "Take a confidential self-reflection on the moral load you carry.",
    },
    {
      id: "decision",
      view: "decide" as const,
      title: "I have a hard call to make",
      body: "Work through a short, guided decision check.",
    },
    {
      id: "habits",
      view: "practice" as const,
      title: "I want to build better habits",
      body: "Set if-then practices that protect your ethics before pressure hits.",
    },
    {
      id: "credit",
      view: "course" as const,
      title: "I need CLE/CE credit",
      body: "Take the self-study course and earn a certificate.",
    },
    {
      id: "commit",
      view: "commit" as const,
      title: "I'm ready to make a commitment",
      body: "Write a personal pledge to prevent moral injury — and keep it.",
    },
  ],
};

export const SHARE = {
  kicker: "Share",
  title: "Make something worth posting",
  lede:
    "Generate a clean, on-brand image about ethical practice and moral injury — pick a message, your role, and a format. It's rendered on your device with nothing uploaded, so share it wherever you like.",
  messageLabel: "Message",
  roleLabel: "Your role",
  formatLabel: "Format",
  download: "Download image",
  messages: [
    { id: "looking", text: "Do the right thing — especially when no one is looking." },
    { id: "costs", text: "Integrity is what you do when it costs you something." },
    { id: "chip", text: "A child's wellbeing is never a bargaining chip." },
    { id: "trade", text: "I won't trade a child's safety for an easier file." },
    { id: "clarity", text: "Burnout is not a badge. Moral clarity is." },
    { id: "protect", text: "Protecting my values protects the families I serve." },
  ],
  formats: [
    { id: "square" as const, label: "Square · 1080×1080", hint: "Feed posts (Instagram, LinkedIn)" },
    { id: "story" as const, label: "Story · 1080×1920", hint: "Stories & reels covers" },
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
