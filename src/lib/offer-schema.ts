import { z } from "zod";

// ────────────────────────────────────────────────────────────────────────────
// Offer schema — radically simplified.
//
// As of the paste-HTML migration, an offer is a piece of raw HTML the
// admin pasted, served back verbatim at /offers/<slug>. We extract <style>
// tags + <body> content from the paste at render time, strip the original
// <footer> (if any), and replace it with our standard legal footer.
//
// Affiliate URL is optional and only used for analytics/click-tracking
// hooks if we add them later — the pasted HTML already contains its own
// hoplinks.
// ────────────────────────────────────────────────────────────────────────────

export const OfferSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1),
  affiliateUrl: z.string().url().optional().or(z.literal("")),
  html: z.string().min(1, "Paste some HTML — the offer is empty"),
});

export type Offer = z.infer<typeof OfferSchema>;
