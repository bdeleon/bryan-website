---
name: deploy-and-pages
description: >-
  How bryandeleon.com is deployed and hosted, and the cross-file checklist for
  adding, renaming, or substantively editing a page. Use this skill whenever
  the task adds or changes an HTML page, touches sitemap.xml, robots.txt,
  .github/workflows/deploy.yml, infrastructure/template.yaml, cache headers,
  the Content-Security-Policy or other security headers, the www→apex
  redirect, or when the site "isn't updating" or a page looks unstyled in
  production but fine locally.
---

# Deploy & pages

## How a deploy works

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) assumes an
AWS role via OIDC (secret `AWS_DEPLOY_ROLE_ARN`; no access keys) →
`aws s3 sync` of the **repo root** (there is no build step) → per-file
`Cache-Control` rewrites → CloudFront invalidation of `/*`.

- **Every file in the repo is published unless excluded** in the sync step.
  Current excludes: `.git/`, `.github/`, `infrastructure/`, `.claude/`,
  `.agents/`, `*.md`, `.DS_Store`, `skills-lock.json`. Adding a non-site file
  or folder (notes, scripts, configs)? Add an exclude in the same commit.
- `sync --delete` never deletes an **excluded** path. Excluding something
  that was already published leaves the old copy live — it must be removed
  from the bucket by hand.
- Cache headers are set per file, by name: HTML (`index.html`,
  `resume.html`) gets `max-age=0, must-revalidate`; `style.css`,
  `resume.css` and `script.js` get one day. A file not listed keeps no
  Cache-Control at all.

## Infrastructure (`infrastructure/template.yaml`, stack `bryandeleon-website`, us-east-1)

S3 (private, OAC) → CloudFront (`bryandeleon.com` + `www`) with ACM cert,
Route 53, an OIDC deploy role (S3 Put/Get/Delete/List + invalidation), and:

- **Viewer-request CloudFront Function:** 301s `www.bryandeleon.com/*` to the
  apex. The apex `https://bryandeleon.com/` is canonical everywhere
  (canonical tags, og:url, sitemap) — never emit `www` URLs.
- **Response headers policy** with a strict **Content-Security-Policy**:
  `default-src 'self'; script-src 'self'; style-src 'self'
  https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:; connect-src 'none'`.
  - **No inline `<style>` blocks, `style="…"` attributes, inline `<script>`,
    or `on*=` handlers** — the browser refuses them in production while they
    work fine when the file is opened locally (no CSP there). This is why a
    page can look perfect locally and unstyled live — `resume.html` shipped
    exactly that way from April to October 2026 until its styles moved to
    `resume.css`. Put CSS in a `.css` file
    and JS in a `.js` file. (`application/ld+json` blocks are data, not
    script, and are fine.)
  - New third-party origins (fonts, analytics, embeds) need a CSP change in
    the template, deployed with `infrastructure/deploy-stack.sh`.
- 403/404 → `/index.html` (so a missing page shows the homepage, not an
  error).

Infra changes go through the template + `deploy-stack.sh`, never the console.

## Adding a page — checklist

1. Create `newpage.html` at the repo root; external CSS/JS only (see CSP).
2. `<head>`: `<link rel="canonical" href="https://bryandeleon.com/newpage.html">`,
   title, description, og tags, matching `index.html`'s pattern.
3. `sitemap.xml`: add a `<url>` with `<loc>` (apex, exact canonical) and a
   real `<lastmod>`.
4. `deploy.yml`: add the file to the HTML cache-header loop (and any new
   `.css`/`.js` to the asset step), or it ships without Cache-Control.
5. Link it from the nav/footer if it should be discoverable.

## Editing a page

- Substantive content change → update that URL's `<lastmod>` in
  `sitemap.xml` to the real date. Don't bump it for typo or style-only edits.
- Changing `style.css`/`script.js`: browsers may cache them up to a day
  despite the invalidation; that's expected.

## Verify

- Locally: `python3 -m http.server` in the repo root and open the page.
  Local serving has no CSP — so also grep for `<style`, `style="`, and inline
  `<script>` without `type="application/ld+json"` before pushing.
- After deploy: load the live page with DevTools open and check the console
  for "Refused to apply inline style" / CSP errors.
