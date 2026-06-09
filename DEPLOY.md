# Deploying

This is a static single-page app. Build output is `dist/`. Pick one path below.

---

## 0. Create the repo & push

```bash
cd moral-injury-reflection
git init
git add .
git commit -m "feat: moral injury self-reflection v1.0"
git branch -M main
git remote add origin git@github.com:<org>/moral-injury-reflection.git
git push -u origin main
```

CI (`.github/workflows/ci.yml`) runs lint → typecheck → test → build on every push/PR.

---

## 1. Vercel (simplest)

`vercel.json` is included (framework `vite`, SPA rewrites already set).

- **Dashboard:** import the GitHub repo → Vercel auto-detects Vite → Deploy.
- **CLI:**
  ```bash
  npm i -g vercel
  vercel            # preview
  vercel --prod     # production
  ```
- For a non-US crisis line, set `VITE_CRISIS_LABEL` / `VITE_CRISIS_BODY` in
  Project → Settings → Environment Variables.

To host under a sub-path (e.g. `track.cotrackpro.com/moral-injury/`), set `base` in
`vite.config.ts` to `"/moral-injury/"` before building.

---

## 2. AWS S3 + CloudFront

```bash
npm run build

# Upload (one-time bucket setup omitted; bucket should be private + OAC)
aws s3 sync dist/ s3://<your-bucket>/ --delete

# Invalidate the CDN cache after each deploy
aws cloudfront create-invalidation \
  --distribution-id <DIST_ID> \
  --paths "/*"
```

CloudFront notes:

- Use **Origin Access Control (OAC)** with a private S3 bucket (do not make the bucket public).
- Set the **default root object** to `index.html`.
- Add a **custom error response**: 403 and 404 → `/index.html` with response code `200`
  (SPA fallback so deep links resolve).
- Recommended response headers policy: `Content-Security-Policy`, `Strict-Transport-Security`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`.

A minimal CSP works because everything is same-origin (fonts are bundled):

```
default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'
```

(`'unsafe-inline'` for styles is only needed if you keep the small inline `style={{…}}` props;
remove it if you refactor those to classes.)

---

## 3. Embedding inside CoTrackPro

Two common options:

- **Iframe** the deployed URL inside a CoTrackPro route. Simplest isolation; the tool keeps its
  own (empty) state boundary.
- **Lift the source** into the Lois247/CoTrackPro monorepo: the `src/lib`, `src/data`, and
  `src/content` folders are framework-light and portable; `src/components` assume React 18.
