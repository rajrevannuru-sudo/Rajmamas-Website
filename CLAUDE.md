# VAKS Consulting website — project rules

Claude Code reads this file automatically. Read it fully before any change. The kickoff task is in `BUILD_PROMPT.md`.

## What this is

A static marketing site for VAKS Consulting (vaksconsulting.com), a founder-led technical documentation studio in Hyderabad run by Rajasekhar V. Revannuru. It replaces a GoDaddy website-builder site. It will be updated rarely after launch.

## Sources of truth (in this order)

| File | Decides |
|---|---|
| `docs/seo-plan.md` | URLs, titles, meta descriptions, H1s, keywords, schema, redirects — **what** is on each page |
| `design/DESIGN.md` | Visual design, components, layout, spacing — **how** it looks |
| `docs/flow-diagrams.md` | Where every diagram and illustration goes and how it is built |
| `content/` | All copy. Never hard-code copy in components |
| `design/screenshots/` | Approved look at 1440px (`desktop/`) and 390px (`mobile/`) |
| `design/reference/*.html`, `design/css/vaks.css`, `design/js/vaks.js` | Working reference markup, styles and interactions to port |
| `docs/deployment.md` | Hosting, form service, redirects files |
| `docs/content-status.md` | What is confirmed vs placeholder |

If SEO plan and design conflict: SEO plan wins on content and structure, design wins on appearance.

## Stack

- **Astro 5**, `output: 'static'`, no UI framework (plain `.astro` components). TypeScript in strict mode.
- Styling: port `design/css/vaks.css` and `design/tokens/tokens.css` into `src/styles/`. Plain CSS with custom properties. No Tailwind.
- Content: Astro content collections loading from the root `content/` folder (`glob()` loader with `base: './content/services'` etc.), with Zod schemas matching the frontmatter. `content/site.json` is imported as data.
- Images: `astro:assets` (`<Image>` / `<Picture>`) from `src/assets/images/` → WebP/AVIF with width/height.
- Integrations: `@astrojs/sitemap`. Nothing else unless needed.
- JS: only what `design/js/vaks.js` does (menu, dropdown, Esc). Vanilla, inlined or one small module. No jQuery, no analytics scripts yet.
- Form: Web3Forms (`PUBLIC_WEB3FORMS_KEY` in `.env`; commit `.env.example` only).

## Project layout (target)

```
vaks-website/
├── CLAUDE.md  BUILD_PROMPT.md  README.md
├── docs/                 plans and specs (read-only for the build)
├── design/               design handover (read-only; never edit)
├── assets-source/images/ original images from the client (read-only)
├── content/              editable copy: site.json, services/*.md, case-studies/*.md
├── public/               favicon, robots.txt, _redirects, .htaccess, og/*.png
└── src/
    ├── assets/images/    optimised copies of assets-source images
    ├── components/       Header, Footer, Wordmark, Button, Icon, SectionHead, Breadcrumbs,
    │                     ServiceCard, CaseCard, QuoteCard, ProblemCard, FounderSection,
    │                     FounderMini, Steps, Flow, Timeline, Checklist, ToolsStrip, Faq,
    │                     CtaBand, ContactForm, Figure, Seo, JsonLd
    ├── layouts/BaseLayout.astro
    ├── content.config.ts
    ├── icons/            the 27 SVGs from design/assets/icons
    ├── lib/              schema builders, helpers (e.g. placeholder rendering)
    ├── pages/            index, services/index, services/[slug], case-studies/index,
    │                     case-studies/[slug], about, contact, privacy-policy, 404
    └── styles/           tokens.css, global.css (ported vaks.css)
```

## Non-negotiable rules

1. **Never invent** statistics, client names, testimonials, quotes or policies. Only Aapmor Technologies, Drut Networks and Athena Overseas may be named.
2. **Placeholders:** any `[bracketed]` text in `content/` renders wrapped in `<span class="placeholder">` (keep the brackets visible). Unconfirmed testimonials (`confirmed: false`) render in dev, are hidden in production builds.
3. **Founder career results** (70 / 90 / 25 / 40%) are always labelled as results across his career, never as a client's outcome.
4. **One H1 per page**, visible, from `seo.h1` / the SEO plan. H2 per section, H3 per card; no skipped levels.
5. **Gold (`--antique-gold`) is never text on a light background.**
6. **Raj's two diagrams are never cropped** (`object-fit: contain`, own aspect ratio) — see `docs/flow-diagrams.md`.
7. **Built flow diagrams are HTML `<ol>`**, never images or canvas.
8. Every image has meaningful alt text; the founder's names him.
9. No layout shift: explicit image dimensions; hero and founder portrait load eagerly, all else lazy.
10. Don't edit `design/`, `docs/` or `assets-source/` unless asked. Copy changes go in `content/`.
11. Accessibility: skip link, landmarks, visible focus, 44px targets, `prefers-reduced-motion` respected, WCAG AA contrast.

## Commands

- `npm run dev` — local server
- `npm run build` — static build to `dist/`
- `npm run preview` — serve the build

Run `npm run build` after each milestone and fix every error and warning before moving on.

## Definition of done for any page

Matches `design/screenshots/` at 1440 and 390 · title, description, canonical, OG/Twitter tags and JSON-LD per `docs/seo-plan.md` · no console errors · keyboard navigable · Lighthouse mobile ≥ 90 performance, ≥ 95 accessibility, 100 SEO.
