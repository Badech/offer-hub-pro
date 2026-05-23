import { neon } from "@neondatabase/serverless";
import type { Offer } from "./offer-schema";

// ────────────────────────────────────────────────────────────────────────────
// Neon Postgres client.
//
// Schema is dead-simple after the paste-HTML migration: one `offers` table
// with a slug PK, a title, an optional affiliate URL, the raw HTML the admin
// pasted, and timestamps. No JSONB payload, no nested fields.
// ────────────────────────────────────────────────────────────────────────────

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Neon connection string to .env.local and your Vercel project env vars.",
    );
  }
  return neon(url);
}

let initialized = false;

/**
 * Idempotent — creates the offers table if it doesn't exist, runs the
 * paste-HTML migration once (drops the legacy `payload` column and DELETEs
 * the legacy seed rows). Safe to call before every query.
 */
export async function ensureSchemaAndSeed(): Promise<void> {
  if (initialized) return;
  const sql = getSql();

  // Create the table in its new minimal shape if it doesn't exist.
  await sql`
    CREATE TABLE IF NOT EXISTS offers (
      slug          TEXT PRIMARY KEY,
      title         TEXT NOT NULL,
      affiliate_url TEXT,
      html          TEXT NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  // ── One-time paste-HTML migration ──────────────────────────────────────
  // The legacy schema had: tagline, category, featured, published_at,
  // payload (JSONB). Drop those columns. Add `html` if it's missing. Wipe
  // every existing row (the user explicitly requested this — see commit
  // history). Idempotent: subsequent runs are no-ops because the columns
  // are already absent.
  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS html TEXT;`;
  await sql`ALTER TABLE offers ADD COLUMN IF NOT EXISTS affiliate_url TEXT;`;
  await sql`ALTER TABLE offers DROP COLUMN IF EXISTS tagline;`;
  await sql`ALTER TABLE offers DROP COLUMN IF EXISTS category;`;
  await sql`ALTER TABLE offers DROP COLUMN IF EXISTS featured;`;
  await sql`ALTER TABLE offers DROP COLUMN IF EXISTS published_at;`;
  await sql`ALTER TABLE offers DROP COLUMN IF EXISTS payload;`;

  // Detect legacy rows (those with NULL html — leftover from the previous
  // schema) and delete them. This is the "delete all existing offers"
  // instruction the user gave us.
  const legacy = (await sql`
    SELECT COUNT(*)::int AS n FROM offers WHERE html IS NULL;
  `) as Array<{ n: number }>;
  if (legacy[0]?.n > 0) {
    await sql`DELETE FROM offers WHERE html IS NULL;`;
  }

  // Make html NOT NULL once any leftover rows are gone.
  await sql`ALTER TABLE offers ALTER COLUMN html SET NOT NULL;`;

  initialized = true;
}

// ────────────────────────────────────────────────────────────────────────────
// CRUD
// ────────────────────────────────────────────────────────────────────────────

type Row = {
  slug: string;
  title: string;
  affiliate_url: string | null;
  html: string;
};

function rowToOffer(r: Row): Offer {
  return {
    slug: r.slug,
    title: r.title,
    affiliateUrl: r.affiliate_url ?? "",
    html: r.html,
  };
}

export async function listOffers(): Promise<Offer[]> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  const rows = (await sql`
    SELECT slug, title, affiliate_url, html FROM offers
    ORDER BY created_at DESC;
  `) as Row[];
  return rows.map(rowToOffer);
}

export async function getOfferBySlug(slug: string): Promise<Offer | null> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  const rows = (await sql`
    SELECT slug, title, affiliate_url, html FROM offers
    WHERE slug = ${slug}
    LIMIT 1;
  `) as Row[];
  return rows[0] ? rowToOffer(rows[0]) : null;
}

export async function createOffer(offer: Offer): Promise<void> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  await sql`
    INSERT INTO offers (slug, title, affiliate_url, html)
    VALUES (${offer.slug}, ${offer.title}, ${offer.affiliateUrl || null}, ${offer.html})
    ON CONFLICT (slug) DO NOTHING;
  `;
}

export async function updateOffer(offer: Offer): Promise<void> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  await sql`
    UPDATE offers
    SET title = ${offer.title},
        affiliate_url = ${offer.affiliateUrl || null},
        html = ${offer.html},
        updated_at = NOW()
    WHERE slug = ${offer.slug};
  `;
}

export async function deleteOffer(slug: string): Promise<void> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  await sql`DELETE FROM offers WHERE slug = ${slug};`;
}

// Legacy compatibility: a few discovery routes used to list categories.
// With the new schema there are no categories — return an empty list so
// any lingering imports don't crash before they're updated.
export async function listCategories(): Promise<string[]> {
  return [];
}
