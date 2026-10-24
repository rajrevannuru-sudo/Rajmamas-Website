# vaksconsulting.com — rebuild

New website for VAKS Consulting (Rajasekhar V. Revannuru), built as a static Astro site.

## Start building

1. Open this folder in VS Code.
2. Open Claude Code and paste the prompt from `BUILD_PROMPT.md` (everything below the line).
3. Claude Code reads `CLAUDE.md` automatically and stops for review after each milestone.

## Folder map

| Folder / file | What it is | Who edits it |
|---|---|---|
| `CLAUDE.md` | Rules Claude Code follows on every task | You |
| `BUILD_PROMPT.md` | The kickoff prompt | — |
| `docs/seo-plan.md` | URLs, titles, meta, H1s, keywords, schema, redirects | You |
| `docs/flow-diagrams.md` | Where diagrams and illustrations go | You |
| `docs/deployment.md` | Hosting, GoDaddy DNS, contact form, launch checklist | You |
| `docs/content-status.md` | What's confirmed and what's still a placeholder | You |
| `content/` | All site copy (business details, services, case studies, FAQs, testimonials) | You, when Raj sends content |
| `design/` | Approved design handover (spec, tokens, CSS, reference pages, screenshots, icons) | Nobody |
| `assets-source/images/` | Raj's photo and two diagrams, originals | Nobody |
| `src/`, `public/` | Created by Claude Code during the build | Claude Code |

## Updating content later

Edit the matching file in `content/` (for example `content/services/api-documentation.md` or `content/case-studies/aapmor-help-centre.md`), remove the `[brackets]` once a fact is confirmed, run `npm run build`, and redeploy.

## Running the site

```
npm install
npm run dev       # http://localhost:4321, shows unconfirmed testimonials and placeholders
npm run build     # type check + static build to dist/ (pages, OG images, sitemap)
npm run preview   # serves dist/ exactly as it will be deployed
```

- Copy lives in `content/`: `site.json` (business details, flows, FAQ, testimonials), `pages.json` (section headings and UI text), `services/*.md`, `case-studies/*.md`, `pages/privacy-policy.md`.
- Share images in `dist/og/` are generated at build time from each page's title (`src/lib/og.ts`).
- Favicons: edit `public/favicon.svg`, then run `node scripts/make-icons.mjs`.
- Contact form: put the Web3Forms key in `.env` as `PUBLIC_WEB3FORMS_KEY` before building.

## Deploying (Vercel)

The repo is connected to Vercel; every push to `main` builds and publishes. `vercel.json` sets clean URLs (`/about`, no `.html`), the redirects from `docs/seo-plan.md` §6 and asset caching. `public/_redirects` and `public/.htaccess` are kept for Netlify/Cloudflare or GoDaddy cPanel hosting.

Set `PUBLIC_WEB3FORMS_KEY` under Project → Settings → Environment Variables, then redeploy, so the contact form works.
