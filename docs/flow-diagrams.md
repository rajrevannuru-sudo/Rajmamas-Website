# Flow diagrams and illustrations

Raj wants flow diagrams across the site, in the spirit of the two diagrams he drew. There are two kinds:

1. **His illustrations** (images he supplied) — used as-is in the Home and Services heroes.
2. **Built flow diagrams** — real HTML, drawn with the design's `.flow`, `.steps` and `.timeline` components (`design/DESIGN.md` §3.9–3.10). Text stays live, so it is indexable, accessible and editable.

Never turn a built flow into an image, and never redraw Raj's illustrations in code.

## 1. Raj's illustrations

| File (`assets-source/images/`) | Where | Alt text |
|---|---|---|
| `diagram-raw-to-structured-content.png` (1600×900) | Home hero, right column (replaces `home.jpg`) | Diagram: VAKS Consulting turns scattered notes, files and duplicates into structured, connected documentation organised around topics, people, actions and sources. |
| `diagram-vaks-services-portfolio.png` (1600×1000) | Services overview hero, right column | Diagram: the six VAKS Consulting documentation services around one hub — technical writing and API docs, user manuals, SOPs, documentation strategy and audit, content systems and style guides, and documentation training. |

**Important — these are diagrams, not photos.** The design's image slot (`.img-slot`) uses `object-fit: cover` at a 4:4.4 aspect, which would crop the diagrams' titles and labels. For these two images:

- Use `object-fit: contain` and the image's own aspect ratio (16:9 and 16:10). Never crop.
- Sit them on a `--paper` card with radius 12 and `--shadow-card`, 12–16px inner padding, so the light diagram reads as a framed figure on the midnight hero.
- No midnight overlay on them.
- Give the image column more room on desktop than the design's 1.25fr / 1fr split (try 1fr / 1.1fr) so the diagram's small labels stay legible; check at 1440px that its smallest text is at least ~11px rendered.
- Home: keep the founder mini-card, but place it below the diagram card (overlapping its bottom edge by ~28px), not over its bottom-left corner, so it never hides diagram content.
- Mobile: image below the hero buttons, full width.
- Wrap in `<figure>` with a visually hidden `<figcaption>` repeating the alt text's point, so the diagram's meaning is in the page text too.

Raj asked for the raw-to-structured image beside both heroes. The services diagram fits the Services hero better, so it is used there; to follow his literal request instead, swap one import.

## 2. Built flow diagrams — where each goes

All steps are written in `content/` so Raj can edit the words without touching code.

| Page | Component | Steps | Source |
|---|---|---|---|
| Home → "How we work" | `.steps` (3 columns) | Discover → Draft → Deliver | `content/site.json` → `process` |
| Services overview → "How we work" | `.flow` (3 cards) | Discover → Draft → Deliver | same as Home |
| Each service page → "Process and timeline" | `.timeline` | 4 steps with week labels | `content/services/<slug>.md` → `process` |
| Case studies index → "How an engagement works" | `.flow` (4 cards) | Discovery call → Audit & plan → Write & review → Deliver & hand over | `content/site.json` → `engagementFlow` |
| Each case study → "At a glance" (under the hero) | `.flow` (3 cards, variant `.flow--summary`) | The challenge → Our approach → The outcome, each one sentence; the outcome card shows the headline metric | `content/case-studies/<slug>.md` → `summary` |
| Each case study → "Our approach" | `.flow` (4 cards) | Case-specific steps | `content/case-studies/<slug>.md` → `approach` |
| About → "How a project flows" | `.flow` (5 cards) | Discovery call → Audit & plan → Architecture → Write & review → Publish & hand over | `content/site.json` → `projectFlow` |

### `.flow--summary` variant (new, small)

The only new diagram style. Same card and connector as `.flow`, with:
- Card 1 eyebrow "THE CHALLENGE", card 2 "OUR APPROACH", card 3 "THE OUTCOME" (harbor-blue eyebrows).
- Card 3 uses a `--warm-parchment` fill, the headline metric in the serif numeral style (48px) and the 40×2 gold rule under it.
- Markup: `<ol class="flow flow--summary">`, three `<li>`.

### Rules for every flow

- `<ol>` markup so order is announced; each step an `<li>` with an H3 (or `<p class="h3">` if heading levels would skip).
- 3–5 steps. Horizontal from 761px up, vertical below 760px (gold vertical connector with downward arrowhead, as `DESIGN.md` §3.9).
- Gold connectors are the only gold on light backgrounds; never gold text.
- One flow per section; never two flows back to back.
- Optional: a short sentence under each flow saying what it means for the client.
