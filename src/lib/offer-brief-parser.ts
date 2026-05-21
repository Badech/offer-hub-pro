import type { Offer } from "./offer-schema";

// ────────────────────────────────────────────────────────────────────────────
// parseOfferBrief — convert a markdown "offer brief" (see admin paste UI) into
// a partial Offer ready to hand to <OfferForm initialOffer={…} />.
//
// The brief format is:
//
//   # Basics
//   ## Title
//   Java Burn
//   ## Slug
//   java-burn
//   ...
//   # Pricing & Trust
//   ## Price From
//   49
//   ...
//   # Ingredients
//   ## Ingredient 1
//   Green Tea Extract
//   Supports metabolism and antioxidant activity.
//   ## Ingredient 2
//   ...
//
// Each "## Heading" maps to a key. Lines under it (until the next ## or # or
// horizontal rule) are the value. Repeated heading patterns like
// "## Ingredient N", "## Pair N", "## Testimonial N", "## FAQ N", "## Problem
// Points" populate the corresponding arrays.
//
// Parser philosophy: be forgiving. Missing sections are simply skipped, the
// form opens with whatever was extracted and the rest defaulted. Upload
// placeholders like "(Upload Java Burn product image)" are recognised and
// dropped so the field stays empty.
// ────────────────────────────────────────────────────────────────────────────

type Section = Map<string, string>; // h2 key (normalised) -> body text

function isPlaceholder(s: string): boolean {
  const t = s.trim();
  if (!t) return true;
  // Common "(Insert your X)" / "(Upload Y image)" placeholders in briefs
  return /^\(\s*(insert|upload|paste|add|your)\b/i.test(t);
}

function normaliseKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[/&]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "_");
}

/** Split the markdown into `# Section` blocks, each mapped to its h2 fields. */
function splitSections(markdown: string): Map<string, Section> {
  const sections = new Map<string, Section>();
  // Strip leading BOM, normalise line endings.
  const lines = markdown.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");

  let currentSection: string | null = null;
  let currentH2: string | null = null;
  let currentH2Buffer: string[] = [];
  let currentMap: Section | null = null;

  const flushH2 = () => {
    if (currentMap && currentH2) {
      const body = currentH2Buffer.join("\n").trim();
      // Don't overwrite a previous block with the same heading (very rare,
      // but safe): keep the longer of the two.
      const existing = currentMap.get(currentH2);
      if (!existing || body.length > existing.length) currentMap.set(currentH2, body);
    }
    currentH2 = null;
    currentH2Buffer = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/g, "");
    // Horizontal rules end the current h2 buffer (they're used as separators
    // between top-level sections in the brief).
    if (/^---+\s*$/.test(line)) {
      flushH2();
      continue;
    }
    const h1 = line.match(/^#\s+(.+)/);
    if (h1) {
      flushH2();
      currentSection = normaliseKey(h1[1]);
      currentMap = sections.get(currentSection) ?? new Map();
      sections.set(currentSection, currentMap);
      continue;
    }
    const h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      flushH2();
      if (!currentMap) {
        // h2 before any h1 — bucket into a synthetic "root" section
        currentSection = "_root";
        currentMap = sections.get(currentSection) ?? new Map();
        sections.set(currentSection, currentMap);
      }
      currentH2 = normaliseKey(h2[1]);
      currentH2Buffer = [];
      continue;
    }
    if (currentH2) currentH2Buffer.push(raw);
  }
  flushH2();
  return sections;
}

function take(section: Section | undefined, key: string): string | undefined {
  if (!section) return;
  const v = section.get(key);
  if (v === undefined) return;
  const trimmed = v.trim();
  if (isPlaceholder(trimmed)) return;
  return trimmed;
}

function takeNumber(section: Section | undefined, key: string): number | undefined {
  const v = take(section, key);
  if (v === undefined) return;
  const n = Number(v.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function takeList(section: Section | undefined, key: string): string[] {
  const v = take(section, key);
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function takeBullets(section: Section | undefined, key: string): string[] {
  const v = take(section, key);
  if (!v) return [];
  return v
    .split("\n")
    .map((s) => s.trim())
    // Strip leading "*", "-", "•", numbered list markers
    .map((s) => s.replace(/^([*\-•]|\d+[.)])\s+/, "").trim())
    .filter(Boolean);
}

function takeBool(section: Section | undefined, key: string): boolean | undefined {
  const v = take(section, key);
  if (!v) return;
  const t = v.toLowerCase();
  if (["enabled", "yes", "true", "on", "y"].includes(t)) return true;
  if (["disabled", "no", "false", "off", "n"].includes(t)) return false;
  return;
}

/**
 * Collect repeated heading blocks: "## Ingredient 1", "## Ingredient 2", ...
 * Returns the body of each numbered heading in order.
 */
function takeNumbered(section: Section | undefined, base: string): string[] {
  if (!section) return [];
  const baseKey = normaliseKey(base);
  // Heading keys look like "ingredient_1", "ingredient_2", etc.
  const entries: Array<{ n: number; body: string }> = [];
  for (const [k, body] of section.entries()) {
    const m = k.match(/^(.+?)_(\d+)$/);
    if (!m) continue;
    if (normaliseKey(m[1]) !== baseKey) continue;
    const trimmed = body.trim();
    if (isPlaceholder(trimmed)) continue;
    entries.push({ n: Number(m[2]), body: trimmed });
  }
  entries.sort((a, b) => a.n - b.n);
  return entries.map((e) => e.body);
}

function splitNameAge(line: string): { name: string; age: number } | undefined {
  // "Michael R. – 42" / "Michael R. - 42" / "Michael R., 42"
  const m = line.match(/^(.+?)\s*[–\-,]\s*(\d{1,3})\s*$/);
  if (!m) return;
  const age = Number(m[2]);
  if (!Number.isFinite(age)) return;
  return { name: m[1].trim(), age };
}

function initials(name: string): string {
  return (
    name
      .replace(/[^\p{L}\s.]/gu, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 3) || "?"
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ────────────────────────────────────────────────────────────────────────────
// Main entry
// ────────────────────────────────────────────────────────────────────────────

/**
 * Returns a complete Offer with sensible defaults so it can be handed straight
 * to <OfferForm>. Everything found in the brief is filled in; everything
 * missing is left as a safe empty/default. The form will still validate via
 * Zod on submit so the admin can fix anything that's required-but-missing.
 */
export function parseOfferBrief(markdown: string): Offer {
  const sections = splitSections(markdown);
  const basics = sections.get("basics") ?? sections.get("_root");
  const pricing = sections.get("pricing_trust") ?? sections.get("pricing_and_trust");
  const hero = sections.get("hero_section");
  const sticky =
    sections.get("sticky_bar_trust_badges") ?? sections.get("sticky_bar_and_trust_badges");
  const problem = sections.get("problem_section");
  const solution = sections.get("solution_section");
  const ingredientsSec = sections.get("ingredients");
  const beforeAfterSec = sections.get("before_after");
  const testimonialsSec = sections.get("testimonials");
  const faqSec = sections.get("faq");
  const seo = sections.get("seo_disclosure") ?? sections.get("seo_and_disclosure");

  const title = take(basics, "title") ?? "";
  const tags = [
    ...takeList(basics, "tags"),
    // Include "Subcategory" as a leading tag if present.
    ...(take(basics, "subcategory") ? [take(basics, "subcategory")!] : []),
  ];

  // Ingredients — each numbered block has: name on first line, benefit on the rest.
  const ingredients = takeNumbered(ingredientsSec, "Ingredient").map((body) => {
    const [first, ...rest] = body.split("\n").map((s) => s.trim()).filter(Boolean);
    return { name: first ?? "", benefit: rest.join(" ").trim(), image: "" };
  });

  // Before/After pairs — body looks like "Before: …\nAfter: …" possibly bullet-prefixed.
  const beforeAfter = takeNumbered(beforeAfterSec, "Pair").map((body) => {
    const lines = body.split("\n").map((s) => s.trim()).filter(Boolean);
    let before = "";
    let after = "";
    for (const l of lines) {
      const b = l.match(/^[*\-•]?\s*before\s*:\s*(.+)$/i);
      const a = l.match(/^[*\-•]?\s*after\s*:\s*(.+)$/i);
      if (b) before = b[1].trim();
      else if (a) after = a[1].trim();
    }
    return { before, after };
  });

  // Testimonials — "Name: X – Age\nQuote:\n"…""…" Be tolerant.
  const testimonials = takeNumbered(testimonialsSec, "Testimonial").map((body) => {
    const lines = body.split("\n").map((s) => s.trim()).filter(Boolean);
    let name = "";
    let age = 40;
    let quote = "";
    let quoting = false;
    for (const l of lines) {
      const nameMatch = l.match(/^name\s*:\s*(.+)$/i);
      const quoteHeader = /^quote\s*:\s*(.*)$/i.exec(l);
      if (nameMatch) {
        const parsed = splitNameAge(nameMatch[1]);
        if (parsed) {
          name = parsed.name;
          age = parsed.age;
        } else {
          name = nameMatch[1].trim();
        }
        continue;
      }
      if (quoteHeader) {
        quoting = true;
        const tail = quoteHeader[1].trim();
        if (tail) quote = stripQuotes(tail);
        continue;
      }
      if (quoting) {
        quote = (quote ? quote + " " : "") + stripQuotes(l);
      }
    }
    return {
      name,
      age,
      initials: initials(name),
      rating: 5 as const,
      quote: quote.trim(),
      verified: true,
    };
  });

  // FAQ — "Q: …\nA: …"
  const faq = takeNumbered(faqSec, "FAQ").map((body) => {
    const qMatch = body.match(/Q\s*:\s*(.+?)(?:\n|$)/i);
    const aMatch = body.match(/A\s*:\s*([\s\S]+?)$/i);
    return {
      question: qMatch?.[1].trim() ?? "",
      answer: (aMatch?.[1] ?? "").trim(),
    };
  });

  // Problem points are bullets under "## Problem Points"
  const problemPoints = takeBullets(problem, "problem_points").map((label) => ({
    icon: "TrendingDown",
    label,
    description: label, // brief format only gives one line; reuse for description
  }));

  const offer: Offer = {
    slug: take(basics, "slug") || slugify(title),
    title,
    tagline: take(basics, "tagline") ?? "",
    category: take(basics, "category") ?? "Health & Wellness",
    tags,
    affiliateUrl: take(basics, "affiliate_url") ?? "",
    heroImage: take(hero, "hero_product_image") ?? "",
    bottleImage: "",
    badge: take(basics, "badge") ?? "",
    price: {
      from: takeNumber(pricing, "price_from") ?? 0,
      to: takeNumber(pricing, "price_to") ?? 0,
      unit: take(pricing, "price_unit") ?? "per bottle",
    },
    guarantee: {
      days: takeNumber(pricing, "guarantee_days") ?? 60,
      label: take(pricing, "guarantee_label") ?? "60-Day Money-Back Guarantee",
    },
    rating: {
      score: takeNumber(pricing, "rating_score") ?? 4.8,
      label: take(pricing, "rating_label") ?? "Based on verified customer experiences",
    },
    featured: takeBool(basics, "featured") ?? false,
    publishedAt: take(basics, "published_date") ?? new Date().toISOString().slice(0, 10),
    vendor: take(basics, "vendor") ?? "ClickBank",
    productForm: take(basics, "product_form") ?? "",
    seo: {
      title: take(seo, "seo_title") ?? title,
      description: take(seo, "seo_description") ?? "",
      ogImage: take(seo, "og_image") ?? "",
    },
    stickyBar: {
      text: take(sticky, "sticky_bar_text") ?? "",
      ctaLabel: take(sticky, "sticky_bar_cta") ?? "",
    },
    trustBadges: {
      guaranteeText: take(sticky, "trust_guarantee_text") ?? "",
      shippingText: take(sticky, "trust_shipping_text") ?? "",
      vendorVerifiedText: take(sticky, "trust_vendor_verified_text") ?? "",
      manufacturingText: take(sticky, "trust_manufacturing_text") ?? "",
    },
    hero: {
      headline: take(hero, "headline") ?? "",
      subheadline: take(hero, "subheadline") ?? "",
      ctaLabel: take(hero, "primary_cta_label") ?? "",
    },
    problem: {
      heading: take(problem, "heading") ?? "",
      points: problemPoints,
    },
    solution: {
      heading: take(solution, "heading") ?? "",
      body: take(solution, "body") ?? "",
    },
    ingredients,
    beforeAfter,
    testimonials,
    faq,
    footerDisclosure: take(seo, "footer_disclaimer") ?? take(seo, "footer_disclosure") ?? "",
  };

  return offer;
}

function stripQuotes(s: string): string {
  return s.replace(/^[“"'']+|[”"'']+$/g, "").trim();
}
