# Moral Injury Self-Reflection — CoTrackPro

A confidential, **non-diagnostic** self-reflection for professionals in the family-law
ecosystem (attorneys, GALs, evaluators, judges, mediators, caseworkers, and others).

It separates **exposure** (morally difficult work encountered) from **personal distress**
(how heavily it sits with the person), reflects both back as bands, and routes to support —
and, optionally, repair. There is no single composite "score" and no verdict on the user.

> **What it is not:** a clinical diagnosis, a validated psychometric instrument, a legal
> assessment, or a professional/court record. See the in-app disclaimers and `src/content/copy.ts`.

---

## Quickstart

```bash
npm install
npm run dev        # local dev server
npm run test       # vitest (pure logic suite)
npm run typecheck  # tsc, no emit
npm run lint       # eslint
npm run build      # production build -> dist/
npm run preview    # serve the built dist/
```

Requires **Node 20+**.

---

## Modules

The app is a small multi-part toolkit with a shared top nav:

- **Course (CLE/CE)** — wraps everything into an accreditable self-study course with **role-specific tracks**. Pick a track (attorney, judge, GAL/child's attorney, custody evaluator, mediator, parenting coordinator, therapist, social worker/caseworker, court staff, paralegal/advocate, or other) and the learning objectives, the knowledge-check post-test, and the credit-context guidance all adapt to that role's accrediting world (state bar/MCLE, judicial-education authority, ASWB/APA/NBCC, court ADR/mediator boards, etc.). Includes a timed agenda, a module checklist, a graded post-test, a course evaluation, a generated **Certificate of Completion** (course ID + unique completion ID + provider fields + disclaimer), and a per-track **accreditation submission packet** (.md). **Not pre-accredited** — the provider obtains a provider number and applies per jurisdiction; the disclaimer and "your board is the final authority" caveat are baked in throughout.
- **Reflect** — the confidential moral-injury self-reflection (role → 18+ items → two-index result + triage).
- **Decide** — guided in-the-moment ethical decision aids (Blanchard & Peale's ethics check, a pressure-pause grounded in ethical-fading research, a child-centered lens, and the Markkula five lenses).
- **Practice** — build "if-then" habits (implementation intentions; Gollwitzer, 1999) and standing commitments, tailored to your reflection profile when present. Export as Markdown, or download a `.ics` weekly reminder that uses your own calendar (no backend). Optional, on-device-only persistence.
- **Standards** — a plain-language reference to the ABA Model Rules of Professional Conduct most relevant to family-law work, grouped by category, each linking to the official ABA text. Summaries are our own paraphrase (rule text/comments are ABA-copyrighted); a jurisdiction caveat is shown throughout. The attorney reflection items are tied to specific rules, and the attorney results page surfaces "standards to revisit."
- **The long view** — shows how a single action or inaction ripples across a child's life (in the moment → why it lands → over a lifetime), pairing every harm pathway with the protective "leverage" move in the professional's control. Grounded in the ACE study (Felitti et al., 1998), toxic-stress science (Center on the Developing Child), interparental-conflict research (Cummings & Davies; Amato), and the AAP's safe/stable/nurturing-relationships framework, with probabilistic (not deterministic) language enforced by a test. Each pathway's leverage can be added to the Practice plan as a ready-made if-then habit in one click.
- **About & evidence** (footer link) — consolidates the design principles (reflective not accusatory, leverage not dread, probabilistic not deterministic, private by design, educational not advice) and the full grouped evidence base with links.

## Project structure

```
src/
├── main.tsx                 # entry; self-hosted font imports
├── App.tsx                  # top-level view router (home / reflect / decide / practice)
├── index.css                # theme tokens + component styles
├── types.ts                 # shared types
├── data/
│   ├── roles.ts             # role list + lenses
│   ├── items.ts             # CORE item bank (all roles)
│   ├── ethicsItems.ts       # ⚠️ attorney ethics PLACEHOLDER — replace with repo list
│   ├── itemSet.ts           # assembles core + role-specific items
│   ├── decisionGuides.ts    # Decide module content (attributed frameworks)
│   ├── habits.ts            # Practice if-then habit library + cue suggestions
│   ├── rules.ts             # ABA Model Rules subset (paraphrased + official links)
│   ├── rules.test.ts        # rule integrity + item ruleId resolution tests
│   ├── longView.ts          # Long-view ripple pathways + evidence base
│   ├── longView.test.ts     # pathway integrity + probabilistic-language test
│   ├── course.ts            # CLE course: objectives, timed agenda, role objectives
│   ├── tracks.ts            # role-specific CLE/CE tracks + credit-context guidance
│   └── postTest.ts          # knowledge-check bank + role questions + assembleTest
├── content/
│   ├── config.ts            # scales, crisis resource (env-overridable), thresholds
│   ├── providerConfig.ts    # provider/accreditation fields (env-overridable)
│   └── copy.ts              # all user-facing copy, disclaimers, citations
├── lib/
│   ├── scoring.ts           # bandOf, computeScores (pure)
│   ├── interpret.ts         # quadrant lead + driver line (pure)
│   ├── triage.ts            # flag-driven triage cards (pure)
│   ├── practice.ts          # habit tailoring + markdown/.ics export (pure)
│   ├── storage.ts           # opt-in, on-device-only plan persistence
│   ├── courseProgress.ts    # grading, completion eligibility, completion id (pure)
│   ├── course.test.ts       # grading/eligibility/certificate/packet tests
│   ├── certificate.ts       # certificate HTML + accreditation packet builders (pure)
│   ├── schema.ts            # zod result schema + payload builder
│   ├── scoring.test.ts      # vitest suite (scoring/interpret/triage/schema)
│   └── practice.test.ts     # vitest suite (tailoring/intentions/.ics)
└── components/              # Nav, Home, ReflectFlow, Intro, RoleSelect, Assessment, Results,
                             # CourseHub, PostTest, DecideHub, GuideRunner, PracticeHub,
                             # RulesReference, LongView, About, Footer
```

The entire scoring/interpretation/triage/practice logic is **pure and unit-tested** (58 tests) —
UI changes can never silently change how results are computed or how exports are formatted.

---

## Replacing the attorney ethics list

`src/data/ethicsItems.ts` ships a **clearly-marked placeholder**. To wire in the canonical
list from `track.cotrackpro.com`:

1. For each entry in the repo's ethics-violation list, **reword it from an accusation into a
   first-person reflection** (e.g. "Attorney misled the tribunal" → "I let the court rely on
   something I knew was false"). The source list spots wrongdoing; this tool is for self-reflection.
2. Map each to a subscale: `SELF` (something the user did/allowed) or `WITNESS` (something seen
   and not stopped). `BETRAYAL` and `DISTRESS` stay in the core bank for every role.
3. Set `roles: ["attorney"]` on each entry so it only appears on the attorney path.
4. Keep the attorney path to ~8–12 items so it stays under ~10 minutes.

> Rule numbers in the placeholder are standard ABA Model Rule **titles** used as scaffolding and
> are marked VERIFY. Confirm them against your jurisdiction's adopted rules before shipping.

---

## Configuration

Crisis resource and threshold are configurable without code changes:

| Env var | Default |
|---------|---------|
| `VITE_CRISIS_LABEL` | `988 Suicide & Crisis Lifeline (U.S.)` |
| `VITE_CRISIS_BODY` | US 988 guidance text |
| `VITE_PROVIDER_NAME` | `[Your organization name]` |
| `VITE_PROVIDER_NUMBER` | `[Provider/sponsor number — obtain from each board]` |
| `VITE_COURSE_AUTHOR` | `[Author / faculty name]` |
| `VITE_COURSE_AUTHOR_QUALS` | `[Author qualifications / bio]` |
| `VITE_PROVIDER_CONTACT` | `[Provider contact email]` |

Set these in `.env` / your host's env settings for non-US deployments. The provider fields populate the
CLE certificate and accreditation packet — set them before offering the course for credit.

---

## Privacy & safety (read before deploying)

- **No backend, no persistence by default.** Answers live in React state for the session only and
  are never transmitted. This is intentional: the data is health-adjacent and potentially
  self-incriminating, so the safest production posture is to not store it.
- The **Copy private summary** button puts a JSON result on the user's clipboard — it does not
  send anything anywhere.
- If you later add a consented, identity-linked store, treat it as sensitive: encrypt at rest,
  do not link to case records, gate behind explicit consent, and consider discoverability risk.
- Fonts are **self-hosted** via `@fontsource` (no calls to Google Fonts).
- `index.html` sets `noindex`; the app is meant to be embedded/linked, not crawled.

See `DEPLOY.md` for Vercel and AWS S3 + CloudFront instructions.

---

## License

Proprietary — see `LICENSE`.
