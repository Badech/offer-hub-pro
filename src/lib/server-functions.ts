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
