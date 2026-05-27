# OfferSendly

Curated affiliate offers + bespoke conversion landing pages.
**Stack:** TanStack Start · React 19 · Tailwind 4 · Neon Postgres · Vercel Blob · deployed on Vercel.

---

## Local development

```bash
npm install
cp .env.example .env.local
# Fill in DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET, BLOB_READ_WRITE_TOKEN
npm run dev
```

On first DB connection, the `offers` table is created and the 5 starter offers (Spartamax, IronForge Pro, WealthCompass, Lumea, FocusForge AI) are seeded automatically.

---

## Required environment variables

| Var | Where to get it |
|---|---|
| `DATABASE_URL` | Neon dashboard → your project → connection string (use the **pooled** one) |
| `ADMIN_PASSWORD` | Your choice — this is the password you type into `/admin/login` |
| `AUTH_SECRET` | Generate with `openssl rand -hex 32`. Signs the admin session cookie. |
| `R2_ACCOUNT_ID` | Cloudflare dashboard → R2 → the URL shows your account ID, or any API token page |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 → Manage R2 API Tokens → Create (Object Read & Write) |
| `R2_SECRET_ACCESS_KEY` | Same token creation step |
| `R2_BUCKET` | Name of the bucket you created in Cloudflare R2 |
| `R2_PUBLIC_BASE_URL` | Bucket Settings → Public Access → the `pub-xxxxx.r2.dev` URL Cloudflare assigns (no trailing slash) |

**Why R2 instead of Vercel Blob:** 10 GB free storage (vs Vercel's 1 GB), **unlimited free egress bandwidth** (Vercel charges $0.15/GB past quota), S3-compatible API.

Set all four in:
1. `.env.local` (for local dev — never commit)
2. **Vercel project Settings → Environment Variables** (Production + Preview)

---

## Admin

- `/admin/login` — sign in with `ADMIN_PASSWORD`
- `/admin` — list / delete offers, link to "+ New Offer"
- `/admin/offers/new` — create an offer with the full landing-page schema
- All public `/offers/<slug>` URLs render the same conversion template against the DB row

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. **Vercel → Add New Project → Import** the repo.
3. Framework preset: **Other**. Build command: `vite build`. Output: `.vercel/output`. (Already set in `vercel.json`.)
4. Add the four env vars above.
5. **Storage tab → Create Database → Neon** (or connect an existing Neon project).
6. **Storage tab → Create Store → Blob** — Vercel will inject `BLOB_READ_WRITE_TOKEN` automatically.
7. Deploy.

---

## Project structure

```
src/
  components/
    OfferLandingPage.tsx   ← reusable Spartamax-style template, renders any Offer row
    OfferCard.tsx
    GlobalLayout.tsx       ← public site shell (nav + footer)
    ConversionLayout.tsx   ← bridge-page shell (legacy, no nav)
    admin/
      ImageUpload.tsx      ← Vercel Blob upload widget
  lib/
    db.ts                  ← Neon client + schema + seed
    offer-schema.ts        ← Zod schema (single source of truth)
    offer-seed.ts          ← 5 starter offers
    auth.ts                ← HMAC-signed cookie auth
    server-functions.ts    ← TanStack Start server fns (reads, mutations, auth, uploads)
    utils.ts
    error-page.ts
  routes/
    __root.tsx
    index.tsx              ← /
    about.tsx contact.tsx privacy.tsx terms.tsx how-we-review.tsx disclosure.tsx
    offers.index.tsx       ← /offers   (All Offers grid)
    offers.$slug.tsx       ← /offers/:slug — DB-driven, renders OfferLandingPage
    categories.tsx         ← /categories
    categories.$slug.tsx   ← /categories/:slug
    search.tsx
    admin.tsx              ← /admin layout (auth-gated)
    admin.login.tsx        ← /admin/login
    admin.index.tsx        ← /admin (offer list)
    admin.offers.new.tsx   ← /admin/offers/new (create form)
```

---

## What's deferred to the next session

- **Edit form** (`/admin/offers/:slug/edit`). Today you can create + delete; to edit, delete and recreate, or update the DB row directly. The schema is identical so an edit form is mostly a clone of the create form with a loader.
- A more polished testimonial-rating star picker (currently a number input)
- Per-route canonical URLs for the public marketing pages (only `/` and `/offers/$slug` have them)
```
