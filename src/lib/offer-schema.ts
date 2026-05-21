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
});

export const FaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const StickyBarSchema = z.object({
  text: z.string().default("365-Day Risk-Free Guarantee"),
  ctaLabel: z.string().default("Get It Now →"),
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
