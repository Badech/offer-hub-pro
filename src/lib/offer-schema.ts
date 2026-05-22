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
});

export type Offer = z.infer<typeof OfferSchema>;
export type ProblemPoint = z.infer<typeof ProblemPointSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type Testimonial = z.infer<typeof TestimonialSchema>;
export type Faq = z.infer<typeof FaqSchema>;
