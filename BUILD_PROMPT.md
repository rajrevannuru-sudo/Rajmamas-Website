# Build prompt — VAKS Consulting website

> Paste everything below the line into Claude Code (VS Code), with this folder open as the workspace.

---

Build the new VAKS Consulting website in this folder.

Start by reading, in full: `CLAUDE.md`, `docs/seo-plan.md`, `design/DESIGN.md`, `docs/flow-diagrams.md`, `docs/deployment.md`, `docs/content-status.md`, every file in `content/`, and the reference pages in `design/reference/`. Look at every screenshot in `design/screenshots/desktop/` and `design/screenshots/mobile/`. Then give me a short build plan (pages, components, content schema) and wait for my OK before writing code.

## Goal

A fast, static, SEO-ready site that looks exactly like the approved design ("Midnight Editorial": midnight navy, warm parchment, one antique-gold accent, Cormorant Garamond + Source Sans 3), with the page structure and metadata from `docs/seo-plan.md`, all copy loaded from `content/`, and flow diagrams wherever `docs/flow-diagrams.md` places them.

## Stack

Astro 5 static site, plain `.astro` components, plain CSS ported from `design/css/vaks.css` and `design/tokens/tokens.css`, content collections reading from the root `content/` folder, `astro:assets` for images, `@astrojs/sitemap`, Web3Forms for the contact form. Details in `CLAUDE.md`.

## Pages (14 routes)

| Route | Template | Design reference | Notes |
|---|---|---|---|
| `/` | Home | `reference/index.html`, `DESIGN.md` §4.1 | Hero visual = `diagram-raw-to-structured-content.png` (uncropped, see flow-diagrams §1). Founder section with portrait. Case study cards from all 3 case studies (headline metric). Testimonials from `site.json`. FAQ from `site.json.homeFaq`. |
| `/services` | Services overview | `reference/services.html`, §4.2 | Hero visual = `diagram-vaks-services-portfolio.png` (uncropped). 6 service cards + full-width secondary card. "How we work" as a `.flow` diagram. |
| `/services/[slug]` × 7 | Service | `reference/service-api-documentation.html`, §4.3 | Everything from the service's markdown: who it's for panel, problems, checklist, `.timeline` from `process`, tools strip, related case study (omit block if empty), FAQ, body copy as an intro section after the problems. |
| `/case-studies` | Case studies index | §4.4 (not drawn — build from existing components) | Dark page hero (eyebrow "Our work", H1 from SEO plan, lead), "How an engagement works" `.flow` from `site.json.engagementFlow`, 3 case cards on parchment, CTA band. |
| `/case-studies/[slug]` × 3 | Case study | `reference/case-study-drut-networks.html`, §4.4 | Add the "At a glance" `.flow--summary` (challenge → approach → outcome) directly under the facts bar. Approach section uses a `.flow` from `approach`. Outcome tiles from `outcomes`. Pull quote only if present. Next case study from `next`. |
| `/about` | About | `reference/about.html`, §4.5 | Founder first (full bio, career results labelled "Results across my career", expertise tags), story from `site.json.story`, "How a project flows" 5-step `.flow`, values, stats band, CTA. |
| `/contact` | Contact | `reference/contact.html`, §4.6 | Email `contact@vaksconsulting.com`, phone/WhatsApp links, Web3Forms form with honeypot, inline success/error states, no CTA band. |
| `/privacy-policy` | Simple text page | light page hero + prose | Short plain-English policy: what the form collects (name, email, company, message), used only to reply, processed by Web3Forms, no selling, contact email for deletion. Mark `[Raj to review]`. |
| `/404` | Not found | light hero | Links to Home, Services, Contact. `noindex`. |

Header nav: **Services ▾ · Case studies · About · Contact** + gold "Book a call". **Resources is phase 2: leave it out of header, mobile menu and footer.** "Book a call" goes to `site.json.bookingUrl`.

Services dropdown, footer service list and contact form select all come from the services collection (sorted by `order`), so adding or renaming a service is a content edit.

## Flow diagrams and illustrations

Follow `docs/flow-diagrams.md` exactly:
- Raj's two diagrams as framed, uncropped figures in the Home and Services heroes (white paper card, `object-fit: contain`, own aspect ratio, founder mini-card below the Home diagram rather than over it).
- Built diagrams with the design's `.steps`, `.flow` and `.timeline` components on Home, Services, every service page, the case studies index, every case study (summary + approach) and About.
- Add the one new variant, `.flow--summary`, as specified.
- All flows are `<ol>` with live text; horizontal ≥ 761px, vertical below.

## SEO (all from `docs/seo-plan.md`)

- `<Seo>` component: title, description, canonical, `lang="en-IN"`, Open Graph, Twitter card, robots (`noindex` on 404).
- `<JsonLd>`: Organization + ProfessionalService + WebSite on every page; Person on Home and About; Service + FAQPage + BreadcrumbList on service pages; Article + BreadcrumbList on case studies; BreadcrumbList on index pages. Build from `content/site.json`, no duplicated data.
- Breadcrumbs on service, case study and index pages, matching the BreadcrumbList.
- Social share images: one 1200×630 PNG per page in `public/og/`, generated at build time from the design's share template (`design/reference/social-share-template.html`, `DESIGN.md` §3.18) — e.g. with `satori` + `@resvg/resvg-js` in a small build script — using each page's title and eyebrow. Fonts: Cormorant Garamond for the title.
- `@astrojs/sitemap` (exclude 404), `public/robots.txt` with the sitemap URL.
- Redirects from SEO plan §6 in both `public/_redirects` and `public/.htaccess`.
- Favicon set (simple "V" monogram in midnight and gold until a logo arrives).

## Images

Copy from `assets-source/images/` into `src/assets/images/` (keep the SEO file names) and render with `astro:assets`:
- `rajasekhar-revannuru-founder-vaks-consulting.png` (1024×1535): founder sections at 4:5 with `object-position: center 20%`, and a circular crop for the hero mini-card.
- `diagram-raw-to-structured-content.png` (1600×900) and `diagram-vaks-services-portfolio.png` (1600×1000): hero figures, never cropped. Alt text in `docs/flow-diagrams.md`.

## Content rules

- All copy from `content/`; nothing hard-coded except UI labels.
- Render `[bracketed]` text inside `<span class="placeholder">`; hide `confirmed: false` testimonials in production.
- Never invent numbers, clients, quotes or policies.
- Render markdown bodies with the site's prose styles (H2s in the serif heading style).

## Build order — stop for my review after each milestone

1. **Foundation:** Astro project, tokens + global CSS ported, BaseLayout, Seo/JsonLd, Header (desktop dropdown + mobile menu), Footer, content collections + schemas. Show me the empty layout at 1440 and 390.
2. **Home** complete, matching `screenshots/desktop/index.png` and `screenshots/mobile/index.png`.
3. **Services overview + all 7 service pages.**
4. **Case studies index + 3 case studies.**
5. **About, Contact, Privacy, 404.**
6. **SEO pass:** OG images, sitemap, robots, redirects, JSON-LD validation, favicon.
7. **QA pass:** compare every page with its screenshot at 1440 and 390; keyboard-only run; `npm run build` clean; Lighthouse mobile scores (targets in `CLAUDE.md`). Give me a list of anything that differs from the design and every remaining placeholder.

At each milestone, run `npm run build`, fix all errors and warnings, and tell me what you built, what you assumed and what needs my input. Don't deploy anything.
