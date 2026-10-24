# VAKS Consulting — Website Design Specification ("Midnight Editorial")

> **For the developer or coding agent:** this file is the source of truth for how the VAKS Consulting website looks and behaves. The site owner already has the SEO plan, URL structure, page titles, meta and schema. **Keep their structure and content; apply this design.** Where the two conflict, SEO structure wins on *what* goes on the page and this file wins on *how it looks*.
>
> Companion files in this package:
> - `tokens/tokens.css`, `tokens/tokens.json`: every colour, font, spacing, radius and shadow value
> - `css/vaks.css`: production stylesheet (tokens + all components + mobile rules). Use it as is or port it to your stack.
> - `js/vaks.js`: the only interactivity (mobile menu, Services dropdown, Esc to close)
> - `reference/*.html`: working static pages with the final markup, class names and copy. Open them in a browser.
> - `screenshots/desktop/*.png` (1440px) and `screenshots/mobile/*.png` (390px @2x): the approved look
> - `assets/icons/*.svg`: the 27 line icons used across the site
> - `images/README.md`: the photos the site needs, with sizes and alt text

---

## 1. Brand in one paragraph

VAKS Consulting is a small, senior, founder-led technical documentation studio in Hyderabad, run by **Rajasekhar V. Revannuru** (26+ years). It helps product teams with API and developer docs, help centres, SOPs, audits, style guides and writing training. The site must feel like **a well-made publication, not a SaaS template**: calm, precise, editorial, with generous white space, strong serif headings and one restrained gold accent. A visitor from a LinkedIn referral should know within five seconds **who the expert is, see proof, and find "Book a call".**

### Design principles
1. **Editorial, not decorative.** Hairline rules and borders instead of shadows, gradients or 3D art.
2. **Gold is scarce.** Antique Gold appears only on the primary button, thin highlight rules and labels/links on dark backgrounds. If you are adding gold anywhere else, stop.
3. **The person is the proof.** The founder's photo, name and track record are prominent on Home and first on About.
4. **Documentation as the motif.** Use doc-like elements (TOC rails, checklists, code chips, step flows). No stock photos of handshakes, no generic illustrations.
5. **Plain words.** Short sentences, sentence case, no buzzwords, no emoji, no exclamation marks.

---

## 2. Design tokens

Use the CSS custom properties from `tokens/tokens.css`. Never hard-code hex values in components.

### 2.1 Colour

| Token | Hex | Use |
|---|---|---|
| `--midnight` | `#0B1D33` | Primary dark: hero, closing CTA band, footer backgrounds. Also heading/body text on light grounds. |
| `--ink-navy` | `#102B4E` | Raised panels inside dark sections ("Who it is for" box, founder mini-card, next-case card, About stats band). |
| `--harbor-blue` | `#1B4266` | Eyebrow labels, links, icons and numerals on light grounds; photo placeholder fill. |
| `--antique-gold` | `#C6A56B` | **Only**: primary button fill, highlight rules, active nav underline, eyebrows/links on dark. |
| `--gold-hover` | `#D6BA86` | Primary button hover. |
| `--warm-parchment` | `#F4EFE5` | Alternate section background; icon discs; case-card metric panel. |
| `--studio-light` | `#FBF8F1` | Main page background. |
| `--paper` | `#FFFDF8` | Card surfaces. |
| `--text` | = midnight | Body and headings on light. |
| `--text-muted` | `#4A5668` | Secondary copy on light (7.0:1). |
| `--text-on-dark` | = warm-parchment | Text on midnight / ink-navy / harbor-blue. |
| `--text-muted-on-dark` | `#B4C0CF` | Secondary text on dark (9.2:1 on midnight). |
| `--hairline` | `#DCD3C2` | Decorative dividers and card borders on light. |
| `--hairline-on-dark` | `#2A3F5C` | Dividers on dark. |
| `--border-strong` | `#8C7F68` | Form input borders (3.7:1, meets the 3:1 control rule). |
| `--focus` / `--focus-on-dark` | harbor-blue / gold | Focus ring on light / dark. |

**Contrast rules (WCAG AA):** never put gold text on a light background (2.2:1). Gold on midnight is 7.3:1, fine. Midnight text on a gold button is 7.3:1, fine.

**Section rhythm:** alternate `studio-light` and `warm-parchment` section backgrounds; dark (`midnight`) only for the hero/page hero, the closing CTA band and the footer. Never put two dark bands next to each other (the About stats band uses `ink-navy` so it reads apart from the CTA band).

### 2.2 Typography

Fonts (Google Fonts):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
```
- **Cormorant Garamond** (`--font-serif`), 500–600: headings, big numerals, quotes, client names in the trust strip.
- **Source Sans 3** (`--font-sans`), 400/600: body, navigation, labels, buttons, forms.

| Style | Font | Desktop size / line | Mobile size / line | Weight | Notes |
|---|---|---|---|---|---|
| Display (page H1) | Serif | 64 / 68 (home), 60 / 64 (inner pages) | 40 / 44 | 500 | letter-spacing −0.01em; one H1 per page |
| H2 (section) | Serif | 44 / 50 | 32 / 38 | 500 | |
| CTA band H2 | Serif | 52 / 58 | 36 / 42 | 500 | |
| H3 (card) | Serif | 26 / 32 | 23 / 29 | 600 | |
| Founder name | Serif | 52 / 56 | 40 / 44 | 500 | |
| Numeral | Serif | 72 / 72 | 60 / 60 | 600 | metrics, step numbers |
| Pull quote | Serif italic | 28 / 38 (testimonial cards 24 / 33) | 22 / 30 | 500 | |
| Eyebrow | Sans | 13 / 16 | 13 / 16 | 600 | UPPERCASE, letter-spacing 0.16em, 24px rule before it |
| Lead | Sans | 19 / 30 | 17 / 27 | 400 | max 60ch, `--text-muted` |
| Body | Sans | 16 / 26 | 16 / 26 | 400 | max 68ch |
| Small | Sans | 14 / 22 | 14 / 22 | 400 | captions, meta |
| Label / button / nav | Sans | 15 / 20 | 15–16 | 600 | |

Eyebrow colour: `--harbor-blue` on light, `--antique-gold` on dark. Every H2 has an eyebrow above it.

### 2.3 Spacing, layout, radius, shadow

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48, 64, 96, 120 (`--space-1` … `--space-30`).
- **Desktop:** max page width 1440, content 1200, side gutter 120px. Section padding 96px top/bottom.
- **Mobile (≤ 760px):** side gutter 20px, section padding 64px, everything stacks to one column.
- Grids: 3-column card grid with 24px gaps; 2-column split layouts with 64px gaps.
- Radius: 4px tags/inputs (`--radius-sm`), 6px buttons (`--radius-md`), 12px cards/panels/images (`--radius-lg`), full for avatars/icon discs.
- Shadow: one token, `--shadow-card`, used only for card hover, the dropdown, the founder mini-card and the contact form. Resting cards use a 1px `--hairline` border, no shadow.
- Breakpoint: a single breakpoint at **760px**. Tablet (761–1200px) uses the desktop layout, shrinking fluidly; reduce the side gutter to 40px between 761 and 1200px if you add a tablet rule.

---

## 3. Components

Class names below match `css/vaks.css` and the reference HTML. `<body class="vk">` scopes everything.

### 3.1 Buttons and links
| Variant | Class | Spec |
|---|---|---|
| Primary | `.btn.btn-primary` | Gold fill, midnight text, 48px tall, 0 22px padding, radius 6, 15px/600. Hover `--gold-hover`. Optional 18px calendar icon before the label. **Used for "Book a call" and "Send message" only.** |
| Secondary | `.btn.btn-secondary` | Transparent, 1px midnight border and text. Hover: midnight fill, parchment text. On dark: parchment text, muted border; hover inverts to parchment fill. |
| Small | `.btn-sm` | 44px tall (header button). |
| Text link with arrow | `.link-arrow` | Harbor-blue 15px/600, 16px arrow icon; hover underlines the label and moves the arrow 3px right. Gold on dark. Min height 44px. |

On mobile, buttons in a `.btn-row` go full width.

### 3.2 Header (`.site-header`)
- 80px tall desktop / 64px mobile. Bottom 1px hairline.
- Left: wordmark. Centre: nav **Services ▾, Case studies, About, Resources, Contact** (15px/600, 44px tap targets). Right: gold **Book a call** (`.btn-sm`).
- Variant `.on-dark` (Home only): midnight background, parchment text, so the header merges with the dark hero.
- Current page: 2px gold underline (`aria-current="page"`).
- **Services dropdown:** 560px panel, paper background, hairline border, radius 12, `--shadow-card`, two columns listing the 7 services, each with a 36px icon disc, bold name and one-line description, plus an "All services →" link. Opens on hover, on keyboard focus, and on click (for touch). Esc closes it.
- **Mobile (≤760px):** nav and header button hide; a 44×44 hamburger button appears. The menu opens below the bar: Services (expandable native `<details>` listing all 7), Case studies, About, Resources, Contact as 52px rows with hairline dividers, then a full-width gold "Book a call". See `screenshots/mobile/*` and the `MobileMenu` artboard.

### 3.3 Wordmark (logo)
No logo file has been supplied yet, so the wordmark is set in type:
`VAKS` (Cormorant Garamond 600, 30px, letter-spacing 0.14em) · 1px × 22px gold vertical rule · `CONSULTING` (Source Sans 3 600, 12px, letter-spacing 0.28em, uppercase). Mobile: 24px / 10px. Replace with the official SVG logo when available; keep it within a 44px-tall link with `aria-label="VAKS Consulting, home"`.

### 3.4 Home hero (`.hero.dark`)
- Midnight background, 96px vertical padding, 2-column grid (1.25fr / 1fr), vertically centred.
- Left: eyebrow **"CLEAR DOCUMENTATION. CONFIDENT CUSTOMERS."**, H1 (max ~18ch), lead (muted-on-dark), primary + secondary buttons, then a small reassurance row (shield icon "NDA on request", globe icon "Working with teams worldwide") in 14px muted text with gold icons.
- Right: **`home.jpg`** in a radius-12 frame (aspect 4:4.4 desktop, 4:3 mobile, 1px dark hairline border, large soft shadow) with the **founder mini-card** overlapping its bottom-left corner (−56px left, −88px bottom).
- Founder mini-card (`.founder-mini`): ink-navy panel, radius 12, 330px wide: 56px circular photo, name (serif 20px), "Founder & Principal Consultant" (13px muted), gold LinkedIn icon link on the right.
- Mobile: single column, image below the buttons, mini-card sits under the image overlapping it by 28px.

### 3.5 Inner page hero (`.page-hero.dark`)
Midnight, 64px top / 96px bottom padding. Breadcrumb first (14px, underlined links, chevron separators), then eyebrow, H1 (60/64, ~16ch), lead and buttons. Right column depends on the page: the "Who it is for" panel (service page), `home.jpg` (Services overview), or a 4-column facts bar (case study).

### 3.6 Trust strip (`.trust`)
Studio-light, 32px padding, hairline bottom border. Label "TRUSTED BY TEAMS AT" (13px eyebrow style, muted) then client names set in Cormorant Garamond 600 24px, harbor-blue, 64px apart: **Aapmor Technologies · Drut Networks · Athena Overseas** (only these three may be named publicly). Use client logos instead only if official files are supplied; keep them monochrome harbor-blue at ~28px height.

### 3.7 Cards
All cards: `--paper` background, 1px hairline border, radius 12, 32px padding (24px mobile). Hover: `--shadow-card` + 2px lift (links only).
- **Problem card** (`.problem-card`): small serif number "01" with a hairline running to the right edge, H3, muted text.
- **Service card** (`.service-card`): 48px parchment icon disc with a 22px harbor-blue line icon, H3, two-line muted description, "Learn more →". 3-column grid. The 7th service, **Business & marketing content**, is a **secondary card**: spans the full row, dashed border, transparent background, horizontal layout.
- **Case study card** (`.case-card`): top panel in parchment with a big serif metric (72px), metric label (14px muted) and a 40×2 gold rule; bottom: client name (13px uppercase tracked), H3 title, service tag + "Read case study →". Whole card is one link.
- **Testimonial card** (`.quote-card`): gold serif quote mark, italic serif quote (24/33), hairline, then 44px avatar + bold name + "Role, Company".
- **Value card** (About): serif number, H3, muted text. 4 columns.

### 3.8 Founder section (`.founder`)
The most personal section, so it must feel prominent.
- 2 columns: 480px portrait (aspect 4:5, radius 12) with a decorative gold L-shaped corner line offset 16px bottom-right; text column vertically centred.
- Eyebrow ("WHO YOU WORK WITH" on Home, "FOUNDER" on About), name in serif 52px, role in 15px uppercase harbor-blue, bio in 19/30.
- **Home version:** short 2-line bio + a facts row between hairlines (Experience **26+ years** · Support tickets **Up to 70% fewer** · Based in **Hyderabad**) + "Connect on LinkedIn" (secondary button with LinkedIn icon) and "More about us →".
- **About version:** full 3-paragraph bio + **"Results across my career"** row: four 48px serif numerals (**70%** fewer support tickets · **90%** fewer documentation defects · **25%** faster customer onboarding · **40%** better API documentation discoverability) + "Connect on LinkedIn" and gold "Book a call".
- Mobile: portrait on top (full width minus 16px for the gold corner), text below; numerals 2×2.

### 3.9 Process: steps and flow diagrams
- **Steps** (`.steps`, Home "How we work"): three columns, each a 72px harbor-blue serif numeral "01" with a hairline running right, H3 (Discover / Draft / Deliver), one-line description.
- **Flow diagram** (`.flow`): the reusable diagram for Services, About, Case study and Portfolio. A row of equal cards (paper, hairline, radius 12, 24px padding) each with a 36px midnight circle holding a serif step number, an H3 (22/28) and a short description; **cards are joined by gold 24×2px connectors with a small gold arrowhead**. On mobile the cards stack vertically and the connector turns into a vertical gold line with a downward arrowhead. Markup is an `<ol>` so screen readers hear the order. Use 3–5 steps; more than 5 wraps badly at 1200px.

### 3.10 Service-page blocks
- **"Who it is for" panel** (`.for-box`): ink-navy panel, gold eyebrow-style heading, list items with gold check icons separated by dark hairlines.
- **What's included checklist** (`.checklist`): 2 columns, each row = 22px gold disc with midnight check + 17px text, hairline under each row.
- **Timeline** (`.timeline`): horizontal hairline with 15px ring markers (first one solid gold), each step: "WEEK [1]" label, H3, short text. Vertical on mobile.
- **Tools and formats strip** (`.tools`): label + monospace chips (14px, paper, hairline, radius 4).

### 3.11 Case study blocks
- Page hero: breadcrumb, tags (Client / Industry / Service), H1 (~24ch), and a **facts bar** of 4 columns (Client, Industry, Service, Timeline) with gold uppercase labels above a dark hairline.
- Body: 2 columns, a sticky **"On this page" TOC rail** (240px, left hairline, active item has a 2px gold marker) and the article. On mobile the rail becomes a horizontal tab row under the hero.
- Sections separated by hairlines: Challenge, Approach (with a flow diagram), Outcome (3 parchment metric tiles: 64px numeral, gold rule, label), Deliverables (doc-icon list).
- **Pull quote** on a midnight panel, italic serif 32/42.
- **Related service** row: icon disc, eyebrow, service name, "View the service →".
- **Next case study** card: ink-navy, gold eyebrow, serif title, 56px gold circle with arrow.

### 3.12 FAQ (`.faq`)
Two columns: section heading on the left (360px), accordion on the right. Native `<details>/<summary>`; first item open. Question in serif 600 24/30, rows at least 72px tall, hairline separators. A 36px circular "+" button rotates 45° to "×" and fills midnight when open. Answer in muted 16/26, max 68ch.

### 3.13 Closing CTA band (`.cta-band.dark`)
Midnight, 96px padding. Left: eyebrow "NEXT STEP" + serif H2 52/58 ("Ready for documentation your customers actually use?"). Right, bottom-aligned: one muted sentence, gold "Book a call" (calendar icon), "Or message us on WhatsApp →" gold link. Every page ends with it except Contact.

### 3.14 Footer (`.site-footer.dark`)
Midnight, dark hairline on top. 4 columns (1.5 / 1 / 1 / 1.3):
1. Wordmark + "Technical writing and documentation for product teams. A small, senior studio in Hyderabad."
2. **Services** (gold eyebrow heading) — the 7 service links.
3. **Company** — Case studies, About, Resources, Contact, Book a call.
4. **Get in touch** — email `[email]@vaksconsulting.com` (to be supplied), phone/WhatsApp **+91 63095 82277** (`tel:+916309582277`, `https://wa.me/916309582277`), pin icon + "Hyderabad, India · Working with teams worldwide".
Bottom row above a hairline: "© 2026 VAKS Consulting" left; "Privacy policy" + 44px LinkedIn icon button right. Mobile: 2 columns, about and contact span full width; bottom row stacks.

### 3.15 Contact form (`.form-card`)
Paper card, radius 12, 48px padding, `--shadow-card`. Heading "Send us a message" (serif 32) + short muted line. 2-column grid: Name | Email; then full width Company (optional), **Service interest** select (the 7 services + "Not sure yet"), Project details textarea (min 140px) with hint text. Labels above fields (15px/600). Inputs: 48px min height, studio-light fill, 1px `--border-strong`, radius 4, 16px text (prevents iOS zoom). Focus: 2px harbor-blue outline, 2px offset. Footer row: privacy note (13px muted) + gold "Send message →". Mobile: single column, full-width button.

### 3.16 Image slots (`.img-slot`)
Every photo sits in a radius-12 frame with a harbor-blue diagonal-hatch placeholder behind it, so layouts hold even before images load. Images use `object-fit: cover`.

### 3.17 Icons
27 line icons in `assets/icons/` (24×24 viewBox, 1.6 stroke, round caps/joins, `stroke="currentColor"`). Shown at 22px inside 48px icon discs, 18px in buttons, 16px in links. Decorative icons get `aria-hidden="true"`; icon-only links need an `aria-label`. Service → icon map: API `code`, Manuals & help centres `book`, SOPs `list`, Audits `search`, Style guides `pen`, Training `people`, Business & marketing content `megaphone`.

### 3.18 Social share image (Open Graph, 1200×630)
Midnight background, 72px/80px padding. Top: gold uppercase eyebrow (page type). Middle: 96×4 gold bar, then the page title in Cormorant Garamond 500 68/74, parchment. Bottom row: wordmark left, "vaksconsulting.com" right (22px muted). Template: `reference/social-share-template.html`; example: `screenshots/social-share-1200x630.png`.

---

## 4. Pages

Section order for each page is below. **Section headings, body copy and URLs may be replaced by the SEO plan**; keep the section pattern, background alternation and components. Screenshots show the approved result.

### 4.1 Home — `reference/index.html`
| # | Section | Background | Components |
|---|---|---|---|
| 1 | Header (dark variant) | midnight | 3.2 |
| 2 | Hero: eyebrow "Clear documentation. Confident customers.", H1 "Technical writing and documentation services for product teams", subhead, Book a call / See our work, **home.jpg** + founder mini-card | midnight | 3.4 |
| 3 | Trust strip: Aapmor Technologies, Drut Networks, Athena Overseas | studio-light | 3.6 |
| 4 | The problem: 3 problem cards (support tickets, slow onboarding, lost deals) | studio-light | 3.7 |
| 5 | What we do: 6 service cards + secondary "Business & marketing content" | parchment | 3.7 |
| 6 | Results: 3 case study cards + "All case studies →" | studio-light | 3.7 |
| 7 | Founder: Rajasekhar V. Revannuru (home version) | parchment | 3.8 |
| 8 | How we work: Discover → Draft → Deliver | studio-light | 3.9 steps |
| 9 | Testimonials: 3 quote cards | parchment | 3.7 |
| 10 | FAQ: 5 questions | studio-light | 3.12 |
| 11 | Closing CTA band | midnight | 3.13 |
| 12 | Footer | midnight | 3.14 |

### 4.2 Services overview — `reference/services.html`
Header (light) → page hero with breadcrumb, eyebrow **"How we can help"**, H1, lead, buttons, and **home.jpg** on the right (aspect 4:3) → services grid (parchment) → "How we work" **flow diagram** (Discover → Draft → Deliver) → CTA band → footer.

### 4.3 Service template (API documentation) — `reference/service-api-documentation.html`
Breadcrumb Home › Services › API documentation · H1 "API documentation services for developer-first products" · lead + buttons · "Who it is for" panel → Problems it solves (3 problem cards) → What's included checklist (parchment) → Process and timeline + tools and formats strip → Related case study (case card + quote card, parchment) → FAQ (4 questions) → CTA band → footer. Re-use this template for every service page.

### 4.4 Case study / Portfolio item (Drut Networks) — `reference/case-study-drut-networks.html`
Breadcrumb · tags · H1 "Rebuilding API docs that developers actually use" · facts bar → TOC rail + article: Challenge → Approach (with flow diagram) → Outcome (3 metric tiles) → Deliverables → pull quote → Related service → Next case study → CTA band → footer. A **Portfolio / Case studies index** page (not drawn) should use: page hero (eyebrow "Our work", H1, lead), an optional flow diagram of the engagement model, then a 3-column grid of case study cards (3.7) on parchment, then the CTA band.

### 4.5 About — `reference/about.html`
Short dark page hero (eyebrow "About VAKS Consulting" + H1) → **Founder first** (about version, full bio, career results, LinkedIn + Book a call) → Our story "Born from frustration with bad docs" (parchment; copy still to be written) → **"How a project flows" flow diagram** (5 steps: Discovery call → Audit & plan → Architecture → Write & review → Publish & hand over) → What we value: 4 value cards (parchment) → stats band (ink-navy): **26+** years, **[X]+** projects, **[X]+** clients, numerals 88px with a gold "+" → CTA band → footer.

### 4.6 Contact — `reference/contact.html`
Light header → 2 columns. Left: eyebrow, H1 "Let's talk about your documentation", a parchment pill "● We reply within one business day", availability line, contact list (email, **+91 63095 82277** phone/WhatsApp, Hyderabad location) with 44px icon discs and hairlines, gold "Book a 30-minute call". Right: the contact form (3.15). Then footer (no CTA band on this page).

---

## 5. Content and data

- **Founder:** Rajasekhar V. Revannuru — Founder & Principal Consultant (bio describes him as a Documentation Solutions Architect). 26+ years. LinkedIn: https://www.linkedin.com/in/rajrevannuru/
- **Phone / WhatsApp:** +91 63095 82277 → `tel:+916309582277`, `https://wa.me/916309582277`
- **Email:** not yet supplied (`[email]@vaksconsulting.com`)
- **Public clients:** Aapmor Technologies, Drut Networks, Athena Overseas. Do not show any other client names.
- **Career results** (Rajasekhar's own, not a single client's): 70% fewer support tickets, 90% fewer documentation defects, 25% faster onboarding, 40% better API documentation discoverability. Present them as career results, never as a specific client's outcome.
- **The 7 services:** API & developer documentation · User manuals & help centres · SOPs & process documentation · Documentation audits · Style guides · Writing training for teams · Business & marketing content (secondary).
- **Placeholders:** anything in `[square brackets]` is unconfirmed (case study metrics, testimonials, story copy, availability). In the reference HTML they have a light gold highlight (`.placeholder`) so they are easy to find. **Remove the `.placeholder` class when real copy goes in, and never invent numbers or testimonials.**
- **Voice:** "we" to "you", short sentences, sentence case, no buzzwords, no emoji.

---

## 6. Interaction and motion
- Transitions: 150ms for colour/border changes, 200ms for card hover (shadow + translateY(−2px)) and the FAQ "+" rotation. No scroll-triggered animations, parallax or auto-playing carousels.
- Respect `prefers-reduced-motion: reduce` by removing the translate and rotation.
- Services dropdown: hover, focus-within and click; Esc and outside click close it.
- Mobile menu: hamburger toggles `aria-expanded`, the icon swaps to ×, Esc closes and returns focus.
- FAQ: native `<details>`, so it works without JavaScript.
- Links styled as buttons stay real `<a>` elements; the form submit is a `<button type="submit">`.

## 7. Accessibility checklist
- All text pairs meet WCAG AA (see 2.1). Gold is never text on light.
- Visible focus everywhere: 2px solid `--focus` (or `--focus-on-dark` in dark sections), 3px offset.
- Tap targets ≥ 44px; buttons 48px; mobile menu rows 52px.
- One H1 per page, H2 per section, H3 per card; headings are live text, never images.
- Skip link to `#main`; landmarks `header`, `nav[aria-label]`, `main`, `footer`; breadcrumb `nav[aria-label="Breadcrumb"]` with `aria-current="page"`.
- Every image has alt text; the founder photo's alt names him: "Rajasekhar V. Revannuru, Founder & Principal Consultant, VAKS Consulting".
- Form fields have visible `<label for>`; the optional field says "(optional)"; hint text linked by `aria-describedby`.

## 8. SEO-friendly layout hooks (structure is yours; these keep the design compatible)
- The H1 is always visible near the top inside the hero; don't hide it or render it as an image.
- Breadcrumbs on service, case study and portfolio pages (add BreadcrumbList schema on your side).
- Each page needs a 1200×630 share image built from the template in 3.18.
- Real text for client names, numbers and headings so they are indexable.

## 9. Implementation notes
- `css/vaks.css` is plain CSS with custom properties: drop-in for static HTML, WordPress, Astro, Next.js etc. If you use Tailwind, map the tokens into `theme.extend` (colors, fontFamily, spacing, borderRadius, boxShadow) and keep component classes in a `@layer components` block.
- Everything is scoped under `.vk`. Add `class="vk"` to `<body>` (or remove the `.vk ` prefix when porting).
- Images live in `images/` (see `images/README.md`). The reference pages load them from `reference/images/`; copy the files there to preview.
- Prefer `<img loading="lazy" decoding="async">` for everything below the hero; the hero image and founder portrait should load eagerly with explicit `width`/`height` to avoid layout shift.
- Keep the page background `--studio-light`, not pure white.
