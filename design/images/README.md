# Images the site needs

Put final files here (and in `reference/images/` to preview the reference pages). Export as WebP or AVIF for the site, with a JPG/PNG fallback if your stack needs one.

| File | Where it appears | Frame / aspect | Export size | Alt text |
|---|---|---|---|---|
| `Corporate-Portrait-Photo.png` | Home founder section, About founder section (large, 4:5) and the hero founder mini-card (56px circle) | 4:5 portrait, radius 12; circle crop for the mini-card | 960×1200 (2×), plus a 112×112 crop | "Rajasekhar V. Revannuru, Founder & Principal Consultant, VAKS Consulting" |
| `home.jpg` | Home hero (right column) and Services overview hero (right column) | Home 4:4.4 desktop, 4:3 mobile; Services 4:3; radius 12, `object-fit: cover` | 1200×1320 (2×) | Describe what the photo shows; not "image" or "home" |
| `og-*.png` | Social share images, one per page | 1200×630 | 1200×630 | n/a (set in meta tags) |
| Logo SVG (to be supplied) | Header, footer, share image | ≈ 30px tall in header | SVG | "VAKS Consulting, home" on the link |

Art direction: real, calm, naturally lit photography. No stock handshakes, no 3D illustrations. If `home.jpg` is busy, the dark hero can take a subtle midnight overlay (`linear-gradient(rgba(11,29,51,.15), rgba(11,29,51,.15))`).
