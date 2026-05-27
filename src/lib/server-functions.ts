import { createServerFn } from "@tanstack/react-start";
import {
  ADMIN_COOKIE_NAME,
  COOKIE_MAX_AGE_SECONDS,
  buildSessionCookieValue,
  isValidSessionCookieValue,
  verifyPassword,
} from "./auth";
import {
  createOffer as dbCreateOffer,
  deleteOffer as dbDeleteOffer,
  getOfferBySlug as dbGetOfferBySlug,
  listOffers as dbListOffers,
  updateOffer as dbUpdateOffer,
} from "./db";
import { OfferSchema, type Offer } from "./offer-schema";

import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

// ────────────────────────────────────────────────────────────────────────────
// Public reads
// ────────────────────────────────────────────────────────────────────────────

export const fetchOffers = createServerFn({ method: "GET" }).handler(async () => {
  return await dbListOffers();
});

export const fetchOfferBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: unknown) => {
    if (typeof slug !== "string" || slug.length === 0) throw new Error("invalid slug");
    return slug;
  })
  .handler(async ({ data }) => {
    return await dbGetOfferBySlug(data);
  });

// ────────────────────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────────────────────

function requireAdmin() {
  const raw = getCookie(ADMIN_COOKIE_NAME);
  if (!isValidSessionCookieValue(raw)) {
    throw new Error("Unauthorized");
  }
}

export const login = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    if (
      typeof d !== "object" ||
      d === null ||
      typeof (d as { password?: unknown }).password !== "string"
    ) {
      throw new Error("Password required");
    }
    return { password: (d as { password: string }).password };
  })
  .handler(async ({ data }) => {
    if (!verifyPassword(data.password)) throw new Error("Invalid password");
    setCookie(ADMIN_COOKIE_NAME, buildSessionCookieValue(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });
    return { ok: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(ADMIN_COOKIE_NAME, { path: "/" });
  return { ok: true };
});

export const checkAuth = createServerFn({ method: "GET" }).handler(async () => {
  const raw = getCookie(ADMIN_COOKIE_NAME);
  return { authenticated: isValidSessionCookieValue(raw) };
});

// ────────────────────────────────────────────────────────────────────────────
// Admin mutations
// ────────────────────────────────────────────────────────────────────────────

export const createOffer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => OfferSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; offer: Offer }> => {
    requireAdmin();
    await dbCreateOffer(data);
    return { ok: true, offer: data };
  });

export const updateOffer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => OfferSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: true; offer: Offer }> => {
    requireAdmin();
    await dbUpdateOffer(data);
    return { ok: true, offer: data };
  });

export const deleteOffer = createServerFn({ method: "POST" })
  .inputValidator((slug: unknown) => {
    if (typeof slug !== "string" || slug.length === 0) throw new Error("invalid slug");
    return slug;
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    requireAdmin();
    await dbDeleteOffer(data);
    return { ok: true };
  });

// ────────────────────────────────────────────────────────────────────────────
// Image upload — Cloudflare R2, auth-gated. Returns the public R2 URL the
// admin can paste back into the offer's imageUrl field (or that the upload
// widget populates automatically).
//
// R2 SETUP (do this once in Cloudflare dashboard):
//   1. R2 → Create bucket → name it (e.g. "onlineonsale")
//   2. Settings → Public Access → Allow Access. Cloudflare will assign a
//      URL like https://pub-xxxxx.r2.dev/  — that's R2_PUBLIC_BASE_URL.
//      (Optionally bind a custom domain like images.offersendly.com.)
//   3. Manage R2 API Tokens → Create API Token → Object Read & Write
//      scoped to this bucket. Copy the Access Key ID + Secret.
//   4. Add to Vercel env:
//        R2_ACCOUNT_ID       — from R2 dashboard URL or any token page
//        R2_ACCESS_KEY_ID    — from step 3
//        R2_SECRET_ACCESS_KEY — from step 3
//        R2_BUCKET           — bucket name from step 1
//        R2_PUBLIC_BASE_URL  — from step 2 (no trailing slash)
//
// R2 free tier: 10 GB storage + UNLIMITED egress bandwidth. Charges only
// kick in past 10 GB stored, at $0.015/GB/month. Reads & writes have free
// monthly quotas (10M reads, 1M writes) that are very hard to exceed for
// affiliate site image traffic.
// ────────────────────────────────────────────────────────────────────────────

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    if (!(d instanceof FormData)) throw new Error("Expected FormData");
    const file = d.get("file");
    if (!(file instanceof File)) throw new Error("Missing file field");
    return { file };
  })
  .handler(async ({ data }): Promise<{ url: string }> => {
    requireAdmin();
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucket = process.env.R2_BUCKET;
    const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
      throw new Error(
        "R2 env vars not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, and R2_PUBLIC_BASE_URL.",
      );
    }

    // Dynamic import keeps the heavy AWS SDK out of the SSR graph until
    // an actual upload is requested.
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

    // Build a unique object key — timestamp + random suffix + safe filename
    // so two uploads of the same file don't collide.
    const safeName = data.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const suffix = Math.random().toString(36).slice(2, 8);
    const key = `offers/${Date.now()}-${suffix}-${safeName}`;

    const client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    // PutObjectCommand needs a Uint8Array / Buffer, not a Web File.
    const buffer = new Uint8Array(await data.file.arrayBuffer());

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: data.file.type || "application/octet-stream",
        // Cache-Control: serve from CDN edge for a year (images are
        // content-addressed via the random suffix in the key, so stale
        // cache is never an issue).
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    // Strip trailing slash from base URL, then build the public URL.
    const base = publicBaseUrl.replace(/\/+$/, "");
    return { url: `${base}/${key}` };
  });
