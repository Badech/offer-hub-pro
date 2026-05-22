import type { Offer } from "./offer-schema";

// ────────────────────────────────────────────────────────────────────────────
// mergeOfferBrief — overlay a parsed brief onto an existing offer.
//
// The brief parser always returns a *complete* Offer (every required field
// is filled with defaults if the brief didn't mention it). For the EDIT
// flow that's wrong: we'd silently wipe out the existing affiliate URL,
// images, slug, etc. just because they weren't in the pasted brief.
//
// This helper does a "smart overlay": for each field, prefer the brief
// value IF the brief actually populated it (non-empty string / non-empty
// array / explicit value), otherwise keep the existing value untouched.
//
// Repeated arrays (problem.points, ingredients, beforeAfter, testimonials,
// faq) are replaced wholesale only when the brief supplies a non-empty
// array — pasting a brief without a "# FAQ" block leaves the existing
// FAQ alone.
// ────────────────────────────────────────────────────────────────────────────

function pickStr(briefVal: string | undefined, currentVal: string | undefined): string {
  return briefVal && briefVal.trim() ? briefVal : (currentVal ?? "");
}
function pickOptStr(
  briefVal: string | undefined,
  currentVal: string | undefined,
): string | undefined {
  if (briefVal && briefVal.trim()) return briefVal;
  return currentVal;
}
function pickNum(briefVal: number | undefined, currentVal: number): number {
  return briefVal !== undefined && briefVal !== 0 ? briefVal : currentVal;
}
function pickArr<T>(briefVal: T[] | undefined, currentVal: T[]): T[] {
  return briefVal && briefVal.length > 0 ? briefVal : currentVal;
}
function pickBool(
  briefVal: boolean | undefined,
  currentVal: boolean,
  briefHadKey: boolean,
): boolean {
  return briefHadKey ? !!briefVal : currentVal;
}

export function mergeOfferBrief(current: Offer, brief: Offer): Offer {
  // Some scalars are sentinel-defaulted by the parser (e.g. `featured: false`
  // when no `## Featured` line was present). We can't always tell whether
  // the brief explicitly set them, so for those fields we keep the current
  // value when the parser output matches its default *and* the current
  // value is non-default.
  const briefHadFeatured = brief.featured !== current.featured && brief.featured === true;

  return {
    // PRIMARY KEY — slug never changes in edit mode
    slug: current.slug,

    // Core text fields — keep current when brief left them empty
    title: pickStr(brief.title, current.title),
    tagline: pickStr(brief.tagline, current.tagline),
    category: pickStr(brief.category, current.category),
    tags: pickArr(brief.tags, current.tags),
    vendor: pickStr(brief.vendor, current.vendor),
    badge: pickOptStr(brief.badge, current.badge),
    affiliateUrl: pickStr(brief.affiliateUrl, current.affiliateUrl),
    publishedAt: pickStr(brief.publishedAt, current.publishedAt),
    productForm: pickOptStr(brief.productForm, current.productForm),

    // Images — brief parser leaves these blank unless an actual URL is given
    heroImage: pickStr(brief.heroImage, current.heroImage),
    bottleImage: pickOptStr(brief.bottleImage, current.bottleImage),

    // Featured is treated as "keep current unless brief explicitly opts in"
    featured: pickBool(brief.featured, current.featured, briefHadFeatured),

    // Price + guarantee + rating: shallow merge, prefer brief values when set
    price: {
      from: pickNum(brief.price.from, current.price.from),
      to: pickNum(brief.price.to, current.price.to),
      unit: pickStr(brief.price.unit, current.price.unit),
    },
    guarantee: {
      days: pickNum(brief.guarantee.days, current.guarantee.days),
      label: pickStr(brief.guarantee.label, current.guarantee.label),
    },
    rating: brief.rating?.label?.trim() || brief.rating?.score
      ? {
          score: pickNum(brief.rating.score, current.rating?.score ?? 0),
          label: pickStr(brief.rating.label, current.rating?.label),
          count: brief.rating.count ?? current.rating?.count,
        }
      : current.rating,

    // SEO + branding strip + trust badges + top bar
    seo: {
      title: pickStr(brief.seo.title, current.seo.title),
      description: pickStr(brief.seo.description, current.seo.description),
      ogImage: pickStr(brief.seo.ogImage, current.seo.ogImage),
    },
    eyebrow: pickOptStr(brief.eyebrow, current.eyebrow),
    topBar: brief.topBar?.text?.trim()
      ? {
          emoji: pickStr(brief.topBar.emoji, current.topBar?.emoji ?? "🔥"),
          text: brief.topBar.text,
        }
      : current.topBar,
    stickyBar: brief.stickyBar?.text?.trim() || brief.stickyBar?.ctaLabel?.trim()
      ? {
          text: pickStr(brief.stickyBar.text, current.stickyBar?.text ?? ""),
          ctaLabel: pickStr(brief.stickyBar.ctaLabel, current.stickyBar?.ctaLabel ?? ""),
        }
      : current.stickyBar,
    trustBadges:
      brief.trustBadges?.guaranteeText?.trim() ||
      brief.trustBadges?.shippingText?.trim() ||
      brief.trustBadges?.vendorVerifiedText?.trim() ||
      brief.trustBadges?.manufacturingText?.trim()
        ? {
            guaranteeText: pickStr(
              brief.trustBadges.guaranteeText,
              current.trustBadges?.guaranteeText ?? "",
            ),
            shippingText: pickStr(
              brief.trustBadges.shippingText,
              current.trustBadges?.shippingText ?? "",
            ),
            vendorVerifiedText: pickStr(
              brief.trustBadges.vendorVerifiedText,
              current.trustBadges?.vendorVerifiedText ?? "",
            ),
            manufacturingText: pickStr(
              brief.trustBadges.manufacturingText,
              current.trustBadges?.manufacturingText ?? "",
            ),
          }
        : current.trustBadges,
    pricingTiers: brief.pricingTiers && brief.pricingTiers.length > 0
      ? brief.pricingTiers
      : current.pricingTiers,

    // Hero block — overlay headline/sub/cta individually
    hero: {
      headline: pickStr(brief.hero.headline, current.hero.headline),
      subheadline: pickStr(brief.hero.subheadline, current.hero.subheadline),
      ctaLabel: pickStr(brief.hero.ctaLabel, current.hero.ctaLabel),
    },

    // Problem section: only replace if brief provided points
    problem: {
      heading: pickStr(brief.problem.heading, current.problem.heading),
      points: pickArr(brief.problem.points, current.problem.points),
    },

    // Solution: only replace headings/body if brief provided them
    solution: {
      heading: pickStr(brief.solution.heading, current.solution.heading),
      body: pickStr(brief.solution.body, current.solution.body),
    },

    // Lists: replace wholesale only if non-empty in brief
    ingredients: pickArr(brief.ingredients, current.ingredients),
    beforeAfter: pickArr(brief.beforeAfter, current.beforeAfter),
    testimonials: pickArr(brief.testimonials, current.testimonials),
    faq: pickArr(brief.faq, current.faq),

    footerDisclosure: pickStr(brief.footerDisclosure, current.footerDisclosure),
  };
}
