# SEO plan — vaksconsulting.com

Source of truth for **what** goes on each page: URLs, titles, meta descriptions, H1s, keywords, schema and redirects. `design/DESIGN.md` decides **how** it looks.

Site: `https://vaksconsulting.com` (no `www`, no trailing slash, HTTPS only).

## 1. Sitemap and URLs

```
/                                              Home
/services                                      Services overview
  /services/api-documentation                  API & developer documentation
  /services/user-manuals-help-centres          User manuals & help centres
  /services/sop-process-documentation          SOPs & process documentation
  /services/documentation-audit                Documentation audits
  /services/documentation-style-guides         Style guides & content systems
  /services/technical-writing-training         Writing training for teams
  /services/business-marketing-content         Business & marketing content (secondary)
/case-studies                                  Case studies index (was /portfolio)
  /case-studies/drut-networks-api-documentation
  /case-studies/aapmor-help-centre
  /case-studies/athena-overseas-sop-documentation
/about                                         About (founder first)
/contact                                       Contact
/privacy-policy                                Privacy policy (footer only)
/404                                           Not found
```

Phase 2 (not at launch): `/resources` and `/resources/<slug>` articles. Leave **Resources** out of the header and footer until the first article is published.

## 2. Page-by-page metadata

Titles ≤ 60 characters, descriptions ≤ 155. One visible H1 per page.

| URL | Title | Meta description | H1 | Primary keyword |
|---|---|---|---|---|
| `/` | Technical Writing & Documentation Services \| VAKS Consulting | Technical writing and documentation services for product teams: API docs, help centres, SOPs and audits, led by a 26+ year expert in Hyderabad. | Technical writing and documentation services for product teams | technical writing services |
| `/services` | Technical Documentation Services \| VAKS Consulting | API docs, user manuals, SOPs, documentation audits, style guides and writing training. Seven ways we turn complex knowledge into docs people use. | Documentation services for every stage of your product | technical documentation services |
| `/services/api-documentation` | API Documentation Services for Startups \| VAKS Consulting | API reference, SDK guides and code samples that help developers integrate faster and ask your engineers fewer questions. | API documentation services for developer-first products | API documentation services |
| `/services/user-manuals-help-centres` | User Manual & Help Centre Writing \| VAKS Consulting | User manuals, help centre articles and onboarding guides that answer questions before they become support tickets. | User manual and help centre writing services | user manual writing services |
| `/services/sop-process-documentation` | SOP Writing & Process Documentation \| VAKS Consulting | Standard operating procedures, process maps and a documentation hub your team can follow and keep current as you grow. | SOP writing and process documentation services | SOP writing services |
| `/services/documentation-audit` | Documentation Audit & Strategy \| VAKS Consulting | An audit of your existing documentation with a gap analysis, information architecture and a prioritised roadmap. | Documentation audit and strategy consulting | documentation audit |
| `/services/documentation-style-guides` | Documentation Style Guides & Templates \| VAKS Consulting | A documentation style guide, terminology, templates and review workflow so every writer on your team sounds the same. | Documentation style guides and content systems | documentation style guide |
| `/services/technical-writing-training` | Technical Writing Training for Teams \| VAKS Consulting | Practical technical writing workshops and coaching that help engineers and product teams write clear documentation. | Technical writing training for teams | technical writing training for teams |
| `/services/business-marketing-content` | Company Profile & Brochure Writing \| VAKS Consulting | Company profiles, brochures, case studies, website and LinkedIn copy written with the same care for clarity as our documentation. | Business and marketing content writing | company profile writing services |
| `/case-studies` | Documentation Case Studies \| VAKS Consulting | How we rebuilt API docs, a help centre and a library of SOPs for Drut Networks, Aapmor Technologies and Athena Overseas. | Documentation case studies | documentation case study |
| `/case-studies/drut-networks-api-documentation` | Drut Networks API Documentation Case Study \| VAKS | How VAKS rebuilt Drut Networks' API reference, quickstart and code samples so developers could integrate without waiting on engineers. | Rebuilding API docs that developers actually use | API documentation case study |
| `/case-studies/aapmor-help-centre` | Aapmor Help Centre Case Study \| VAKS Consulting | How VAKS rewrote and restructured Aapmor Technologies' help centre to cut repeat support questions. | A help centre that reduced support load | help centre case study |
| `/case-studies/athena-overseas-sop-documentation` | Athena Overseas SOP Case Study \| VAKS Consulting | How VAKS documented 24 core SOPs and built a documentation hub for Athena Overseas during rapid team growth. | Documenting the processes behind 3× team growth | SOP documentation case study |
| `/about` | About Rajasekhar V. Revannuru \| VAKS Consulting | Rajasekhar V. Revannuru is a Documentation Solutions Architect with 26+ years of experience. Meet the founder behind VAKS Consulting, Hyderabad. | A small, senior studio for clear documentation | VAKS Consulting |
| `/contact` | Contact VAKS Consulting \| Book a Documentation Call | Tell us about your documentation project. Call or WhatsApp +91 63095 82277, or send a message. We reply within one business day. | Let's talk about your documentation | contact VAKS Consulting |
| `/privacy-policy` | Privacy Policy \| VAKS Consulting | How VAKS Consulting uses the details you send through this website. | Privacy policy | — |

Supporting keywords per page are listed in each `content/services/*.md` frontmatter (`keywords`). Use them naturally in the lead, one H2 and image alt text. Never stuff.

## 3. Keyword placement rules

For every page: primary keyword in the title, H1, first 100 words, URL and one H2; supporting keywords in body copy and alt text; at least two internal links in (service ↔ case study ↔ home/services). Location terms ("Hyderabad", "India") appear in the home lead, the founder section, About and the footer, not stuffed into every page.

## 4. Structured data (JSON-LD)

Generate from `content/site.json`, never hard-code twice.

| Page | Schema |
|---|---|
| Every page | `Organization` + `ProfessionalService` (one `@graph`: name, url, logo, email, telephone, `address` Hyderabad, Telangana, IN, `areaServed` "Worldwide", `founder` → Person, `sameAs` LinkedIn) and `WebSite` |
| Home, About | `Person` for Rajasekhar V. Revannuru: `jobTitle`, `worksFor`, `image`, `sameAs` LinkedIn URL, `knowsAbout` (expertise tags) |
| Service pages | `Service` (`serviceType`, `provider` → Organization, `areaServed`), `BreadcrumbList`, `FAQPage` from the page FAQ |
| Case study pages | `Article` (headline, author → Person, publisher → Organization), `BreadcrumbList` |
| Services, Case studies index | `BreadcrumbList` |

Validate every template with Google's Rich Results Test before launch. (FAQ rich results now show for few sites; the markup is still worth having for clarity.)

## 5. Technical SEO

- `<link rel="canonical">` on every page (absolute URL, no trailing slash).
- Open Graph + Twitter tags on every page; one 1200×630 PNG per page generated from the share template (`design/reference/social-share-template.html`). Never SVG.
- `sitemap-index.xml` listing only real pages (no 404, no privacy page optional); `robots.txt` pointing to it.
- Images: WebP via the framework's image pipeline, explicit width/height, `loading="lazy"` below the fold, hero and founder portrait eager. Descriptive file names and alt text.
- Fonts: Google Fonts with `preconnect` and `display=swap`.
- `lang="en-IN"` on `<html>`.
- Custom 404 page linking to Home, Services and Contact.
- Lighthouse targets on mobile: Performance ≥ 90, Accessibility ≥ 95, Best practices ≥ 95, SEO 100.

## 6. Redirects (301)

| From | To |
|---|---|
| `/portfolio` | `/case-studies` |
| `/theme-study` | `/` |
| `/design-system` | `/` |
| `/home`, `/index.html` | `/` |

`/services`, `/about`, `/contact` keep their URLs.

## 7. Off-site (after launch, not part of the build)

Google Search Console + Bing Webmaster Tools (submit the sitemap), Google Business Profile as a service-area business in Hyderabad, LinkedIn company page, Clutch and GoodFirms listings — all with the same name, phone and website.
