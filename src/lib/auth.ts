import { createHmac, timingSafeEqual } from "node:crypto";

// ────────────────────────────────────────────────────────────────────────────
// Single-user password auth. The admin enters ADMIN_PASSWORD which is compared
// in constant time. On success a signed cookie value is issued — the route
// layer is responsible for actually attaching it via setCookie().
// Cookie value format: "ok|<issued-at>|<hex-signature>"
// ────────────────────────────────────────────────────────────────────────────

export const ADMIN_COOKIE_NAME = "os_admin";
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET is not set or too short. Add a 32+ char random string to .env.local and Vercel env vars.",
    );
  }
  return s;
}

function getAdminPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) {
    throw new Error("ADMIN_PASSWORD is not set. Add it to .env.local and Vercel env vars.");
  }
  return p;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function verifyPassword(submitted: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(submitted);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function buildSessionCookieValue(): string {
  const payload = `ok|${Date.now()}`;
  const signature = sign(payload);
  return `${payload}|${signature}`;
}

export function isValidSessionCookieValue(raw: string | undefined | null): boolean {
  if (!raw) return false;
  const parts = raw.split("|");
  if (parts.length !== 3) return false;
  const [marker, issuedAt, signature] = parts;
  if (marker !== "ok") return false;
  const expected = sign(`${marker}|${issuedAt}`);
  if (expected.length !== signature.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
