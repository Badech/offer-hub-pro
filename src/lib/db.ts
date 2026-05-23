import { neon } from "@neondatabase/serverless";
import type { Offer } from "./offer-schema";

// ────────────────────────────────────────────────────────────────────────────
// Neon Postgres client.
//
// Schema: a single `offers` table. Top-level scalar fields are columns for
// efficient listing/filtering; nested rich content is stored as a single JSONB
// `payload` column so the admin form can evolve without migrations.
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
 * Idempotent — creates the `offers` table if it doesn't exist, and seeds the
 * five built-in offers on the first run only. Safe to call before every query.
 */
export async function ensureSchemaAndSeed(): Promise<void> {
  if (initialized) return;
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS offers (
      slug          TEXT PRIMARY KEY,
      title         TEXT NOT NULL,
      tagline       TEXT NOT NULL,
      category      TEXT NOT NULL,
      affiliate_url TEXT NOT NULL,
      featured      BOOLEAN NOT NULL DEFAULT FALSE,
      published_at  TEXT NOT NULL,
      payload       JSONB NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  const rows = (await sql`SELECT COUNT(*)::int AS n FROM offers;`) as Array<{ n: number }>;
  if (rows[0]?.n === 0) {
    const { SEED_OFFERS } = await import("./offer-seed");
    for (const offer of SEED_OFFERS) {
      await insertOfferRow(offer);
    }
  }

  // One-time migration: re-apply the Spartamax seed if its payload doesn't yet
  // include the new `topBar` field (introduced when the landing template was
  // redesigned). Idempotent — runs at most once per cold start, and the check
  // is a fast indexed lookup. Older offers that the admin has edited are left
  // alone.
  await applyRichSpartamaxMigration();
  // Insert WaterSmartBox if it's missing. Safe to call repeatedly because
  // the underlying insertOfferRow() uses ON CONFLICT DO NOTHING.
  await ensureSeededByKey("watersmart-box");
  initialized = true;
}

async function ensureSeededByKey(slug: string): Promise<void> {
  const sql = getSql();
  const exists = (await sql`SELECT 1 FROM offers WHERE slug = ${slug} LIMIT 1;`) as Array<{
    "?column?"?: number;
  }>;
  if (exists.length > 0) return;
  const { SEED_OFFERS } = await import("./offer-seed");
  const offer = SEED_OFFERS.find((o) => o.slug === slug);
  if (offer) await insertOfferRow(offer);
}

async function applyRichSpartamaxMigration(): Promise<void> {
  const sql = getSql();
  const rows = (await sql`
    SELECT slug, payload FROM offers
    WHERE slug = 'spartamax' AND (payload->'topBar') IS NULL
    LIMIT 1;
  `) as Array<{ slug: string }>;
  if (rows.length === 0) return; // already migrated, or admin has customised it

  const { SEED_OFFERS } = await import("./offer-seed");
  const spartamax = SEED_OFFERS.find((o) => o.slug === "spartamax");
  if (!spartamax) return;

  await sql`
    UPDATE offers
    SET title = ${spartamax.title},
        tagline = ${spartamax.tagline},
        category = ${spartamax.category},
        affiliate_url = ${spartamax.affiliateUrl},
        featured = ${spartamax.featured},
        published_at = ${spartamax.publishedAt},
        payload = ${JSON.stringify(spartamax)}::jsonb,
        updated_at = NOW()
    WHERE slug = 'spartamax';
  `;
}

async function insertOfferRow(offer: Offer): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO offers (slug, title, tagline, category, affiliate_url, featured, published_at, payload)
    VALUES (${offer.slug}, ${offer.title}, ${offer.tagline}, ${offer.category},
            ${offer.affiliateUrl}, ${offer.featured}, ${offer.publishedAt}, ${JSON.stringify(offer)}::jsonb)
    ON CONFLICT (slug) DO NOTHING;
  `;
}

// ────────────────────────────────────────────────────────────────────────────
// Public queries
// ────────────────────────────────────────────────────────────────────────────

type Row = {
  slug: string;
  payload: Offer;
};

export async function listOffers(): Promise<Offer[]> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  const rows = (await sql`
    SELECT slug, payload FROM offers
    ORDER BY featured DESC, published_at DESC;
  `) as Row[];
  return rows.map((r) => r.payload);
}

export async function getOfferBySlug(slug: string): Promise<Offer | null> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  const rows = (await sql`
    SELECT slug, payload FROM offers WHERE slug = ${slug} LIMIT 1;
  `) as Row[];
  return rows[0]?.payload ?? null;
}

export async function listCategories(): Promise<string[]> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  const rows = (await sql`SELECT DISTINCT category FROM offers ORDER BY category;`) as Array<{
    category: string;
  }>;
  return rows.map((r) => r.category);
}

export async function createOffer(offer: Offer): Promise<void> {
  await ensureSchemaAndSeed();
  await insertOfferRow(offer);
}

export async function deleteOffer(slug: string): Promise<void> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  await sql`DELETE FROM offers WHERE slug = ${slug};`;
}

export async function updateOffer(offer: Offer): Promise<void> {
  await ensureSchemaAndSeed();
  const sql = getSql();
  await sql`
    UPDATE offers
    SET title = ${offer.title},
        tagline = ${offer.tagline},
        category = ${offer.category},
        affiliate_url = ${offer.affiliateUrl},
        featured = ${offer.featured},
        published_at = ${offer.publishedAt},
        payload = ${JSON.stringify(offer)}::jsonb,
        updated_at = NOW()
    WHERE slug = ${offer.slug};
  `;
}
