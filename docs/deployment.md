# Deployment plan

The site is a static build (plain HTML/CSS/JS in `dist/`). It is updated rarely, so no CMS, database or server is needed.

## Where to host

The current site appears to be built with GoDaddy's website builder ("Airo"), which cannot host custom code. Two options:

| Option | Cost | How it works | Notes |
|---|---|---|---|
| **A. Cloudflare Pages or Netlify (recommended)** | Free | Connect the Git repo; every push builds and publishes. Domain stays registered at GoDaddy; only the website DNS records point to the host. | Free HTTPS, global CDN, redirects via `public/_redirects`. |
| B. GoDaddy cPanel/Linux hosting (if Raj already pays for it) | Existing plan | Upload the contents of `dist/` to `public_html` via File Manager or FTP. | Redirects via `public/.htaccess`. |

The build should produce **both** `public/_redirects` and `public/.htaccess` so either option works.

## GoDaddy access

Raj adds Varun through GoDaddy **Account Settings → Delegate Access → Invite to Access**, level **Products & Domains**. No password is shared.

## DNS switch (option A) — do this last

1. In GoDaddy DNS, first **screenshot every existing record**.
2. Change only the website records: the apex `@` (A/ALIAS or the host's instructions) and `www` (CNAME to the host).
3. **Do not touch MX, TXT (SPF/DKIM/DMARC) or any email records.** The address `contact@vaksconsulting.com` must keep working.
4. Add the domain in the host's dashboard, wait for HTTPS, then set `www` → apex redirect.
5. Turn off or unpublish the old GoDaddy builder site only after the new one is live.

## Contact form

Static sites need a form service. Use **Web3Forms** (free, works on any host): the form posts to `https://api.web3forms.com/submit` with an access key tied to `contact@vaksconsulting.com`. The key is public by design; keep it in `PUBLIC_WEB3FORMS_KEY` in `.env` (see `.env.example`). Include its honeypot field for spam, a success message, and an error message with the WhatsApp number as fallback.

## Launch checklist

- [ ] All pages render at 390px and 1440px and match `design/screenshots/`
- [ ] Contact form tested end to end (a message arrives at contact@vaksconsulting.com)
- [ ] Redirects from `docs/seo-plan.md` §6 work
- [ ] Rich Results Test passes for Home, one service, one case study
- [ ] Share preview checked in LinkedIn Post Inspector
- [ ] Lighthouse mobile targets met
- [ ] Search Console verified (DNS TXT record) and sitemap submitted
- [ ] Email still works after the DNS change
