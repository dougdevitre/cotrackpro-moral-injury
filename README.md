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
- **Calculator** — a transparent, **educational** cost & dividend estimator: a conservative figure for the annual cost of unaddressed moral injury, and the protective "dividend" from reducing it. Caseload vs. jurisdiction modes; every coefficient is a named, editable assumption (no hidden multipliers). Exposure pre-fills from a completed reflection and the achievable reduction from a leaders' climate check, both still editable. Pure model in `src/lib/costDividend.ts`, fully unit-tested. On-device only.
- **Pledge wall** — an **optional, public** space where professionals stand behind one protective commitment. This is the one feature that leaves the device; it is opt-in, gated, and structurally walled off from the private reflection (see [Community pledge wall](#community-pledge-wall-optional-backend) below). Ships **dormant** until a datastore is provisioned.
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

## Community pledge wall (optional backend)

The pledge wall is the **only** part of the app that sends data off the device. It is opt-in,
gated, and deliberately **inactive until you provision a datastore** — until then the app builds
and deploys normally and the wall shows a "not enabled yet" state.

### Architecture

- **Endpoints** — Vercel **Edge Functions** under `/api` (no added runtime dependency; they talk
  to the store with `fetch`):
  - `api/pledges.ts` — `GET` (paginated public list) and `POST` (submit a pledge).
  - `api/report.ts` — `POST` to report a pledge; a pledge is auto-hidden after **3** reports.
  - `api/_lib.ts` — shared helpers (KV access, salted-IP-hash rate limiting). `_`-prefixed files
    are shared modules, not routes.
- **Store** — **Vercel KV** (Upstash-compatible Redis), reached via its REST API.
- The SPA rewrite in `vercel.json` yields to `/api`, and the existing CSP already allows
  same-origin `/api` (`connect-src 'self'`) — no config change needed.

### Activation

1. In the Vercel project, add a **KV (Upstash Redis)** store and connect it. This injects the
   env vars below.
2. *(Recommended)* set `PLEDGE_IP_SALT` so hashed rate-limit keys can't be reversed.
3. Redeploy. The wall goes live; **no code change required.**

| Env var | Set by | Purpose |
|---------|--------|---------|
| `KV_REST_API_URL` | Vercel KV integration | KV REST endpoint |
| `KV_REST_API_TOKEN` | Vercel KV integration | KV REST auth token |
| `PLEDGE_IP_SALT` | you (optional) | Salt for the rate-limiter's IP hash |

### Privacy & moderation contract

- A submission carries **only**: a commitment chosen from the fixed catalog, an optional first
  name, a role, and a **coarse fixed region**. It **never** accepts reflection answers, scores,
  free-form notes, or any other PII — this is enforced in `src/lib/pledge.ts` (pure, shared by
  client and server, unit-tested).
- Consent is explicit and required server-side. Names are sanitized (letters/spaces/hyphens only,
  length-capped) and profanity-checked; regions must match a fixed list.
- Rate limiting (5 posts/hr/IP) uses only a **salted, truncated SHA-256 of the IP** as an
  ephemeral key — no raw IPs are stored.
- The handler logic is covered by `src/lib/wallHandlers.test.ts` against an in-memory KV mock
  (validation, rate-limit, report→hide).

---

## Privacy & safety (read before deploying)

- **The private reflection has no backend and is not persisted by default.** Reflection answers
  live in React state for the session only and are never transmitted. This is intentional: the
  data is health-adjacent and potentially self-incriminating, so the safest posture is to not
  store it. The **pledge wall** above is the single, opt-in exception, and it receives none of
  this data.
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
