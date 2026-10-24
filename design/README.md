# VAKS Consulting — design handover

Give **DESIGN.md** to your developer or coding agent as the main context, with the rest of this folder alongside it.

Suggested prompt:
> Build the VAKS Consulting website using my existing SEO plan, page structure and content. Apply the visual design in `DESIGN.md` exactly: use `tokens/tokens.css` for all values, follow the component specs, match `screenshots/` at 1440px and 390px, and use `reference/*.html` and `css/vaks.css` as the working reference implementation. Don't invent statistics, client names or testimonials; keep `[bracketed]` items as placeholders until I supply them.

| Path | What it is |
|---|---|
| `DESIGN.md` | The full design specification: brand, tokens, components, page layouts, content rules, accessibility |
| `tokens/` | Design tokens as CSS custom properties and JSON |
| `css/vaks.css` | Production-ready stylesheet (Google Fonts import + tokens + components + mobile) |
| `js/vaks.js` | Menu, dropdown and keyboard interactions |
| `reference/` | Static HTML pages (open `reference/index.html`) and the 1200×630 share template |
| `screenshots/` | Approved designs: `desktop/` at 1440px, `mobile/` at 390px |
| `assets/icons/` | 27 SVG line icons |
| `images/` | Image list and specs; add `Corporate-Portrait-Photo.png` and `home.jpg` here |
