import { z } from "zod";

// ────────────────────────────────────────────────────────────────────────────
// Canonical Offer schema — single source of truth for DB rows, server
// functions, admin forms, and the public landing template.
// ────────────────────────────────────────────────────────────────────────────

export const PriceSchema = z.object({
  from: z.number().nonnegative(),
  to: z.number().nonnegative(),
  unit: z.string().min(1),
});

export const GuaranteeSchema = z.object({
  days: z.number().int().nonnegative(),
  label: z.string().min(1),
});

export const HeroSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  ctaLabel: z.string().min(1),
});

export const SeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ogImage: z.string().default(""),
});

export const ProblemPointSchema = z.object({
  icon: z.string().default("TrendingDown"),
  /** Optional emoji shown before the label (e.g. "⚡"). When set, takes
   *  visual priority over the lucide icon in the redesigned template. */
  emoji: z.string().optional(),
  label: z.string().min(1),
  description: z.string().min(1),
});

export const ProblemSchema = z.object({
  heading: z.string().min(1),
  points: z.array(ProblemPointSchema).default([]),
});

export const SolutionSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
});

export const IngredientSchema = z.object({
  name: z.string().min(1),
  image: z.string().optional(),
  benefit: z.string().min(1),
  /** Optional dose/format line shown above the benefit, e.g. "200mg · Standardized 2%". */
  dose: z.string().optional(),
});

export const BeforeAfterSchema = z.object({
  before: z.string().min(1),
  after: z.string().min(1),
});

export const TestimonialSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive(),
  initials: z.string().min(1).max(4),
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(1),
  verified: z.boolean().default(true),
  /** Optional "City, ST" line shown after the name. */
  location: z.string().optional(),
  /** Optional occupation line shown below name+location. */
  occupation: z.string().optional(),
  /** Optional tier (e.g. "6-bottle customer") shown next to occupation. */
  bottleTier: z.string().optional(),
});

export const FaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const StickyBarSchema = z.object({
  text: z.string().default("365-Day Risk-Free Guarantee"),
  ctaLabel: z.string().default("Get It Now →"),
});

/** Top urgency bar above the hero — opt-in per offer. */
export const TopBarSchema = z.object({
  /** Leading emoji (e.g. "🔥"). Defaults to empty so older offers stay clean. */
  emoji: z.string().default("🔥"),
  /** Main text. Often something like
   *  "LIMITED TIME: 6-Bottle Bundle Now 29% Off + 2 Free Guides — Today Only". */
  text: z.string().default(""),
});

/** Single price-tier badge shown in the hero pricing strip. */
export const PriceTierSchema = z.object({
  label: z.string().min(1), // "1 Bottle"
  price: z.number().nonnegative(), // 69
  per: z.string().default(""), // "/ bottle · free ship"
  featured: z.boolean().default(false),
  bestValueTag: z.string().optional(), // "Best Value" pill on the featured tier
});

/**
 * Pre-sell / advertorial page configuration. Optional per offer.
 *
 * When present, an offer can be reached at /presell/<slug> with this
 * fixed-height single-screen layout (mobile-bottle, dark hero, urgency
 * top bar). Designed for Facebook/Instagram traffic where the user
 * arrives via an ad and needs a fast pattern-interrupt before the
 * affiliate redirect.
 *
 * The "headlineLead" + "headlineMain" split lets us style the two halves
 * differently (lead in red, main in red+serif on a new line) without
 * the editor having to write HTML.
 */
export const PresellSchema = z.object({
  // Top urgency bar
  topBarPrefix: z.string().default("⚠"),
  topBarSpan: z.string().default("CLASSIFIED:"),
  topBarText: z
    .string()
    .default("This file may be scrubbed — view before it disappears"),

  // Headline block
  eyebrowLabel: z.string().default("Confidential leak — eyes only"),
  /** First half of the H1 — appears in red-tag style. e.g. "[LEAKED]" */
  headlineLead: z.string().default("[LEAKED]"),
  /** Middle white text. e.g. "NASA's Secret" */
  headlineMain: z.string().default(""),
  /** Bottom red emphasized text on its own line. e.g. "Shakes the White House" */
  headlineTail: z.string().default(""),

  // Hero image / box
  heroImage: z.string().default(""), // optional URL — falls back to emoji+text
  heroIcon: z.string().default("🛸"), // shown when no heroImage is set
  heroCaption: z.string().default("Classified File — Surfaced Online"),

  // Body copy — plain text with a few light markers handled by the renderer:
  //   *italic-red eyes-only intro*  for the opening italic-red sentence
  //   [text](inline-cta)            for inline links to the affiliate URL
  bodyCopy: z
    .string()
    .default(""),

  // Alert box (yellow)
  alertText: z.string().default(""),
  /** Label of the inline link inside the alert box (links to affiliate URL). */
  alertLinkLabel: z.string().default("it's all right here."),

  // Primary CTA
  ctaLabel: z.string().default("▶  WATCH THIS IMMEDIATELY"),
  ctaSub: z
    .string()
    .default("Free to watch · No sign-up required · May be removed soon"),

  // Important line (red border)
  importantLabel: z.string().default("IMPORTANT:"),
  importantText: z.string().default(""),
});

export const TrustBadgesSchema = z.object({
  guaranteeText: z.string().default(""),
  shippingText: z.string().default(""),
  vendorVerifiedText: z.string().default(""),
  manufacturingText: z.string().default(""),
});

// ────────────────────────────────────────────────────────────────────────────
// The full offer payload
// ────────────────────────────────────────────────────────────────────────────

export const OfferSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1),
  tagline: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  affiliateUrl: z.string().url(),
  heroImage: z.string().default(""),
  bottleImage: z.string().optional(),
  badge: z.string().optional(),
  price: PriceSchema,
  guarantee: GuaranteeSchema,
  rating: z
    .object({
      score: z.number().min(0).max(5),
      label: z.string(),
      /** Optional review count rendered as e.g. "2,300+ customer reviews". */
      count: z.number().int().nonnegative().optional(),
    })
    .optional(),
  featured: z.boolean().default(false),
  publishedAt: z.string().min(1), // ISO date
  vendor: z.string().min(1),
  productForm: z.string().optional(),
  seo: SeoSchema,
  hero: HeroSchema,
  stickyBar: StickyBarSchema.optional(),
  trustBadges: TrustBadgesSchema.optional(),
  /** Top urgency bar above the hero. Optional — falls back to a generic
   *  "{N}-Day Risk-Free Guarantee" message if not set. */
  topBar: TopBarSchema.optional(),
  /** Eyebrow pill above the hero h1, e.g. "Independent Review · Verified ClickBank Offer". */
  eyebrow: z.string().optional(),
  /** Explicit pricing tiers shown in the hero. If unset, the template
   *  derives a 3-tier strip from `price.from`/`price.to`. */
  pricingTiers: z.array(PriceTierSchema).optional(),
  problem: ProblemSchema,
  solution: SolutionSchema,
  ingredients: z.array(IngredientSchema).default([]),
  beforeAfter: z.array(BeforeAfterSchema).default([]),
  testimonials: z.array(TestimonialSchema).default([]),
  faq: z.array(FaqSchema).default([]),
  // Footer disclosure paragraph (per-offer, for FDA/manufacturer compliance)
  footerDisclosure: z.string().default(""),
  // Optional pre-sell page config. When present, /presell/<slug> renders
  // the dark-advertorial layout against this block. Falls back to the
  // standard landing page otherwise.
  presell: PresellSchema.optional(),
});

export type Offer = z.infer<typeof OfferSchema>;
export type ProblemPoint = z.infer<typeof ProblemPointSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type Faq = z.infer<typeof FaqSchema>;
