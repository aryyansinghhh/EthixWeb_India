# Ethixweb India — Premium Full-Stack Redesign

Redesign of ethixweb.com built for Indian businesses. **Live:** _add Vercel URL_ · **Admin demo:** `/admin` · password shared in submission form.

## Tech stack
| Layer | Choice | Why |
|---|---|---|
| Frontend | Hand-written semantic HTML + one CSS file + ~10 KB vanilla JS | Zero framework JS on a content site = best PageSpeed; no hydration, no layout shift |
| Backend | Vercel Serverless Functions (Node 18, `/api`) | Same repo, same deploy, no extra server |
| Database | Supabase (PostgreSQL) via REST, **RLS enabled with no public policies** | Real DB; the public key can read/write nothing — only the server's service key can |
| Hosting | Vercel (clean URLs, security + cache headers in `vercel.json`) | |

Pages: `/` Home · `/services` · `/about` · `/contact` · `/admin` (protected).

## Backend
- `POST /api/leads` — validates (name, email, optional Indian/intl phone, whitelisted service, message ≤ 2000), saves to `leads`.
- **Spam protection (layered):** hidden honeypot field (bots get a fake 200) · minimum fill-time check · link-stuffing filter · DB-backed rate limit (5 / IP / hour, IP stored only as a salted hash) · same-origin check.
- `POST/DELETE /api/admin/login` — password compared in constant time against `ADMIN_PASSWORD` (env var, never in the repo); issues an HMAC-signed, `HttpOnly; Secure; SameSite=Strict` cookie valid 8 h; 5 failed attempts / 15 min throttle.
- `GET/PATCH/DELETE /api/admin/leads` — session-gated; list, change status (new/contacted/qualified/closed), delete. Admin UI also has search, filter and CSV export (formula-injection safe). All output is rendered with `textContent` (no XSS).
- Errors are logged server-side; users only see friendly messages.

## Setup
1. Create a Supabase project → SQL editor → run `supabase/schema.sql`.
2. Import the repo in Vercel and add env vars from `.env.example` (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ADMIN_PASSWORD`, `SESSION_SECRET`).
3. Deploy. Submit the contact form, then log in at `/admin`.

## Design rationale — why it is India-specific
- **Identity:** Devanagari accents (तकनीक), a rotating "Namaste" greeting in six Indian languages (Hindi, Punjabi, Tamil, Telugu, Kannada, Bengali), live IST clock in the nav, red/black brand kept.
- **Audience:** industry tiles for Indian buyers (manufacturing/exports, healthcare, real estate, startups, EdTech, D2C); copy speaks to SMEs and entrepreneurs.
- **Trust & friction:** INR pricing, GST-compliant billing and IST-timezone ops called out; form placeholders use `+91` numbers and Indian names; phone validation accepts Indian formats; WhatsApp/phone field prioritised.
- **Global-hub story:** time-zone cards show India as the primary operations centre serving US/UK clients.

## What improved over the current site
Clear value proposition above the fold · audit → plan → build → optimize process · real reviews with verified source · before/after and agency comparison tables · one working lead pipeline with admin · accessibility (skip link, focus rings, `prefers-reduced-motion`, ARIA on dialogs) · performance (no framework, deferred JS, non-blocking font load, cacheable assets, reduced font weights) · SEO (per-page title/description/canonical/OG).

## Notes
Reviewer names are localised sample content for this assessment; swap in real, permissioned testimonials before going live.
Replace `ethixweb-india.vercel.app` in the `canonical` tags with your real URL. Add PageSpeed screenshots (mobile + desktop) to `/docs` before submitting.
