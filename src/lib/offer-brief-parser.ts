import type { Offer } from "./offer-schema";

// ────────────────────────────────────────────────────────────────────────────
// parseOfferBrief — convert a markdown "offer brief" into an Offer ready to
// hand to <OfferForm initialOffer={…} />.
//
// SUPPORTED STRUCTURES
//
// The parser is **structure-agnostic**: it walks the document collecting every
// heading (# or ##) into a flat bucket map keyed by the normalised heading
// text. Heading depth doesn't matter — `# Title` and `## Title` are both
// recognised. This means BOTH of the following layouts work for the same
// fields:
//
//   ┌─ Layout A (flat, sub-headed) ─────────┐
//   │ # Basics                              │
//   │ ## Title                              │
//   │ Java Burn                             │
//   │ ## Slug                               │
//   │ java-burn                             │
//   └───────────────────────────────────────┘
//
//   ┌─ Layout B (deeply nested with --- separators) ─┐
//   │ # BASICS                                       │
//   │ ## Title                                       │
//   │ WaterSmart Box                                 │
//   │ ---                                            │
//   │ # Problem Point 1                              │
//   │ ## Icon                                        │
//   │ AlertTriangle                                  │
//   │ ## Label                                       │
//   │ Unknown Contaminants                           │
//   └────────────────────────────────────────────────┘
//
// REPEATED ITEMS
//
// Anything matching `Problem Point N`, `Ingredient N`, `Feature N`,
// `Pair N`, `Testimonial N`, `FAQ N` is gathered as an ordered list of
// "item buckets". An item bucket is a *child map* of the sub-headings that
// followed the item heading, so you can write:
//
//   # Testimonial 1
//   ## Name
//   Michael R.
//   ## Age
//   41
//   ## Quote
//   "It really worked."
//
// Or the older compact form:
//
//   ## Testimonial 1
//   Name: Michael R. – 41
//   Quote:
//   "It really worked."
// ────────────────────────────────────────────────────────────────────────────

type Bucket = Map<string, string>;

interface Item {
  /** The h2 sub-fields gathered under this item heading (e.g. "name", "age"). */
  fields: Bucket;
  /** The free-text body if the item didn't use sub-headings (compact form). */
  body: string;
}

interface Doc {
  /** Top-level field bucket — all "## Title", "## Slug", … at any depth go here. */
  fields: Bucket;
  /** Item lists keyed by item type ("ingredient", "feature", "pair", …). */
  items: Map<string, Map<number, Item>>;
}

// ────────────────────────────────────────────────────────────────────────────
// Lexer & normalisation helpers
// ────────────────────────────────────────────────────────────────────────────

// normaliseKey() replaces all non-alphanumeric runs with a single underscore,
// so "FAQ 1" becomes "faq_1" and "Problem Point 1" becomes "problem_point_1".
// All regexes here must use `[\s_]*` (NOT `\s*`) between word and number.
const ITEM_TYPES = [
  { match: /^problem[\s_]*point[\s_]*(\d+)$/, type: "problem_point" },
  { match: /^ingredient[\s_]*(\d+)$/, type: "ingredient" },
  { match: /^feature[\s_]*(\d+)$/, type: "ingredient" }, // alias
  { match: /^pair[\s_]*(\d+)$/, type: "pair" },
  { match: /^before[\s_]*after[\s_]*(\d+)$/, type: "pair" }, // alias
  { match: /^testimonial[\s_]*(\d+)$/, type: "testimonial" },
  { match: /^review[\s_]*(\d+)$/, type: "testimonial" }, // alias
  { match: /^faq[\s_]*(\d+)$/, type: "faq" },
  { match: /^question[\s_]*(\d+)$/, type: "faq" }, // alias
] as const;

function isPlaceholder(s: string): boolean {
  const t = s.trim();
  if (!t) return true;
  return /^\(\s*(insert|upload|paste|add|your|todo|tbd|optional)\b/i.test(t);
}

function normaliseKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/[/&]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "_");
}

function detectItem(heading: string): { type: string; index: number } | null {
  const key = normaliseKey(heading);
  for (const it of ITEM_TYPES) {
    const m = key.match(it.match);
    if (m) return { type: it.type, index: Number(m[1]) };
  }
  return null;
}

// ────────────────────────────────────────────────────────────────────────────
// Parsing — walk the markdown and bucket every heading
// ────────────────────────────────────────────────────────────────────────────

function parseDoc(markdown: string): Doc {
  const doc: Doc = { fields: new Map(), items: new Map() };
  const lines = markdown.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").split("\n");

  // Context: currently we're inside either the top-level doc, or an item.
  // `currentSection` is the most recent non-item top-level heading, used to
  // qualify ambiguous field keys ("Heading" appears under both Problem and
  // Solution sections — we store both qualified and unqualified versions).
  type FieldCtx = { bucket: Bucket; keys: string[]; buffer: string[] };
  // Boxed via objects with explicit declared types — TS narrows let-bindings
  // through closures to `never`, but property reads from a non-narrowing
  // wrapper object stay typed correctly.
  const ctx: {
    item: Item | null;
    itemType: string | null;
    itemIndex: number;
    section: string | null;
    field: FieldCtx | null;
  } = { item: null, itemType: null, itemIndex: 0, section: null, field: null };

  const flushField = () => {
    const f = ctx.field;
    if (!f) return;
    const body = f.buffer.join("\n").trim();
    const value = isPlaceholder(body) ? "" : body;
    for (const key of f.keys) {
      const existing = f.bucket.get(key);
      if (existing === undefined || (value && value.length > existing.length)) {
        f.bucket.set(key, value);
      }
    }
    if (ctx.item && f.bucket === ctx.item.fields) {
      ctx.item.body = (ctx.item.body ? ctx.item.body + "\n" : "") + body;
    }
    ctx.field = null;
  };

  const startItem = (type: string, index: number) => {
    flushField();
    let list = doc.items.get(type);
    if (!list) {
      list = new Map();
      doc.items.set(type, list);
    }
    let existing = list.get(index);
    if (!existing) {
      existing = { fields: new Map(), body: "" };
      list.set(index, existing);
    }
    ctx.item = existing;
    ctx.itemType = type;
    ctx.itemIndex = index;
  };

  const startField = (bucket: Bucket, keys: string[]) => {
    flushField();
    ctx.field = { bucket, keys, buffer: [] };
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/g, "");
    if (/^---+\s*$/.test(line)) {
      // Horizontal rule terminates whatever field/item we were in.
      flushField();
      // Note: items continue across rules until another `# Item N` opens —
      // this matches the user's brief style where `---` separates blocks.
      continue;
    }
    // Match any heading depth (# … ######). We treat them uniformly.
    const h = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!h) {
      if (ctx.field) ctx.field.buffer.push(raw);
      continue;
    }
    const text = h[2];
    const key = normaliseKey(text);

    // Item start? (Problem Point N, Ingredient N, …)
    const item = detectItem(text);
    if (item) {
      startItem(item.type, item.index);
      continue;
    }

    // Heading depth & shape.
    const isLevel1 = h[1] === "#";
    const fieldKey = normaliseKey(text);
    // A "section" heading is one that has no value of its own — it just sets
    // the parent-section context for the ## fields that follow. We treat any
    // level-1 heading as a section, plus any level-2 heading whose text ends
    // in "section" or starts with a known section name. Field headings
    // (## Title, ## Body, etc.) are everything else.
    const looksLikeSection =
      isLevel1 ||
      /\bsection\b/i.test(text) ||
      /^(basics|pricing|hero|sticky|seo|faq)\b/i.test(text);

    // A level-1 heading ALWAYS exits any currently-open item, even if the
    // heading turns out to be another item (handled above) or a section.
    // Without this, `## Heading` under `# SOLUTION SECTION` would end up
    // attached to the still-open `# Problem Point 1` item.
    if (isLevel1) {
      flushField();
      ctx.item = null;
      ctx.itemType = null;
    }

    if (looksLikeSection) {
      ctx.section = fieldKey
        .replace(/_section$/, "")
        .replace(
          /^(basics|pricing.*|hero|sticky.*|seo.*|problem|solution|ingredients?|features?|before.*|testimonials?|reviews?|faq)$/,
          "$1",
        );
      continue;
    }

    const bucket: Bucket = ctx.item ? ctx.item.fields : doc.fields;
    const keys = [fieldKey];
    if (ctx.section && !ctx.item) {
      keys.push(`${ctx.section}__${fieldKey}`);
    }
    startField(bucket, keys);
  }
  flushField();
  return doc;
}

// ────────────────────────────────────────────────────────────────────────────
// Doc → typed Offer
// ────────────────────────────────────────────────────────────────────────────

function take(bucket: Bucket | undefined, ...keys: string[]): string | undefined {
  if (!bucket) return;
  for (const k of keys) {
    const v = bucket.get(k);
    if (v && v.trim()) return v.trim();
  }
}

function takeNumber(bucket: Bucket | undefined, ...keys: string[]): number | undefined {
  const v = take(bucket, ...keys);
  if (v === undefined) return;
  const n = Number(v.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

function takeList(bucket: Bucket | undefined, ...keys: string[]): string[] {
  const v = take(bucket, ...keys);
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function takeBullets(bucket: Bucket | undefined, ...keys: string[]): string[] {
  const v = take(bucket, ...keys);
  if (!v) return [];
  return v
    .split("\n")
    .map((s) => s.trim())
    .map((s) => s.replace(/^([*\-•]|\d+[.)])\s+/, "").trim())
    .filter(Boolean);
}

function takeBool(bucket: Bucket | undefined, ...keys: string[]): boolean | undefined {
  const v = take(bucket, ...keys);
  if (!v) return;
  // Loose match: the first word decides.
  const head = v.toLowerCase().match(/^[a-z]+/);
  if (!head) return;
  if (["yes", "enabled", "true", "on", "y"].includes(head[0])) return true;
  if (["no", "disabled", "false", "off", "n"].includes(head[0])) return false;
}

function sortedItems(map: Map<number, Item> | undefined): Item[] {
  if (!map) return [];
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}

function splitNameAge(line: string): { name: string; age?: number } {
  const m = line.match(/^(.+?)\s*[–\-,]\s*(\d{1,3})\s*$/);
  if (m) return { name: m[1].trim(), age: Number(m[2]) };
  return { name: line.trim() };
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

function stripQuotes(s: string): string {
  return s.replace(/^[\u201C"'\u2018]+|[\u201D"'\u2019]+$/g, "").trim();
}

// ────────────────────────────────────────────────────────────────────────────
// Public entry
// ────────────────────────────────────────────────────────────────────────────

export function parseOfferBrief(markdown: string): Offer {
  const doc = parseDoc(markdown);
  const F = doc.fields;

  // ── Basics ────────────────────────────────────────────────────────────
  const title = take(F, "title") ?? "";
  const tags = [
    ...takeList(F, "tags"),
    ...(take(F, "subcategory") ? [take(F, "subcategory")!] : []),
    ...(take(F, "product_type") ? [take(F, "product_type")!] : []),
  ];

  // ── Problem points ────────────────────────────────────────────────────
  // Two formats: (a) explicit `# Problem Point N` items with Icon/Label/
  // Description sub-fields, or (b) a bullet list under "## Problem Points"
  // at the doc level.
  const explicitProblemItems = sortedItems(doc.items.get("problem_point"));
  let problemPoints = explicitProblemItems
    .map((it) => ({
      icon: take(it.fields, "icon") || "TrendingDown",
      label: take(it.fields, "label") || "",
      description: take(it.fields, "description") || it.body.trim() || "",
    }))
    .filter((p) => p.label || p.description);
  if (problemPoints.length === 0) {
    problemPoints = takeBullets(F, "problem_points").map((label) => ({
      icon: "TrendingDown",
      label,
      description: label,
    }));
  }

  // ── Ingredients / Features ────────────────────────────────────────────
  // Items can have Name/Benefit sub-fields, or a compact body where the first
  // line is the name and the rest is the benefit.
  const ingredients = sortedItems(doc.items.get("ingredient"))
    .map((it) => {
      const name = take(it.fields, "name") ?? "";
      const benefit =
        take(it.fields, "benefit") ?? take(it.fields, "description") ?? "";
      if (name || benefit) {
        return {
          name,
          benefit,
          image: take(it.fields, "image") ?? "",
        };
      }
      const [first, ...rest] = it.body.split("\n").map((s) => s.trim()).filter(Boolean);
      return {
        name: first ?? "",
        benefit: rest.join(" ").trim(),
        image: "",
      };
    })
    .filter((x) => x.name || x.benefit);

  // ── Before / After ────────────────────────────────────────────────────
  const beforeAfter = sortedItems(doc.items.get("pair"))
    .map((it) => {
      let before = take(it.fields, "before") ?? "";
      let after = take(it.fields, "after") ?? "";
      if (!before && !after) {
        for (const l of it.body.split("\n")) {
          const b = l.match(/^[*\-•]?\s*before\s*:\s*(.+)$/i);
          const a = l.match(/^[*\-•]?\s*after\s*:\s*(.+)$/i);
          if (b) before = b[1].trim();
          else if (a) after = a[1].trim();
        }
      }
      return { before, after };
    })
    .filter((x) => x.before || x.after);

  // ── Testimonials ──────────────────────────────────────────────────────
  type Tm = Offer["testimonials"][number];
  const testimonials: Tm[] = sortedItems(doc.items.get("testimonial"))
    .map((it) => {
      // Sub-headed form: ## Name / ## Age / ## Rating / ## Quote
      const nameRaw = take(it.fields, "name");
      const ageRaw = takeNumber(it.fields, "age");
      const ratingRaw = takeNumber(it.fields, "rating");
      const quoteFromField =
        take(it.fields, "quote") ?? take(it.fields, "text") ?? "";

      // Compact form: parse from body "Name: X – Age" + "Quote: …"
      let name = nameRaw ?? "";
      let age = ageRaw ?? 0;
      let quote = quoteFromField;

      if (!name || !age || !quote) {
        const lines = it.body.split("\n").map((s) => s.trim()).filter(Boolean);
        let quoting = false;
        for (const l of lines) {
          const nm = l.match(/^name\s*:\s*(.+)$/i);
          const qh = /^quote\s*:\s*(.*)$/i.exec(l);
          if (nm) {
            const parsed = splitNameAge(nm[1]);
            if (!name) name = parsed.name;
            if (!age && parsed.age) age = parsed.age;
            continue;
          }
          if (qh) {
            quoting = true;
            const tail = qh[1].trim();
            if (tail && !quote) quote = stripQuotes(tail);
            continue;
          }
          if (quoting && !quoteFromField) {
            quote = (quote ? quote + " " : "") + stripQuotes(l);
          }
        }
        // If we *still* have no name but the body is a single line that fits
        // a "Name – Age" pattern, use that.
        if (!name && lines[0]) {
          const parsed = splitNameAge(lines[0]);
          name = parsed.name;
          if (!age && parsed.age) age = parsed.age;
        }
      }

      // Apply the parsed nameRaw split if the user put "Michael R. – 41"
      // straight into the Name field.
      const split = splitNameAge(name);
      name = split.name;
      if (!age && split.age) age = split.age;

      // Strip wrapping quotes from the final quote string.
      quote = stripQuotes(quote);

      const rating = Math.max(1, Math.min(5, Math.round(ratingRaw ?? 5))) as Tm["rating"];
      return {
        name,
        age: age || 40,
        initials: initials(name),
        rating,
        quote,
        verified: true,
      };
    })
    .filter((t) => t.name || t.quote);

  // ── FAQ ───────────────────────────────────────────────────────────────
  const faq = sortedItems(doc.items.get("faq"))
    .map((it) => {
      const question = take(it.fields, "question", "q") ?? "";
      const answer = take(it.fields, "answer", "a") ?? "";
      if (question || answer) return { question, answer };
      // Compact form: "Q: …\nA: …"
      const qMatch = it.body.match(/Q\s*:\s*(.+?)(?:\n|$)/i);
      const aMatch = it.body.match(/A\s*:\s*([\s\S]+?)$/i);
      return {
        question: qMatch?.[1].trim() ?? "",
        answer: (aMatch?.[1] ?? "").trim(),
      };
    })
    .filter((f) => f.question || f.answer);

  const offer: Offer = {
    slug: take(F, "slug") || slugify(title),
    title,
    tagline: take(F, "tagline") ?? "",
    category: take(F, "category") ?? "Health & Wellness",
    tags,
    affiliateUrl: take(F, "affiliate_url", "hoplink", "url") ?? "",
    heroImage: take(F, "hero_product_image", "hero_image", "product_image") ?? "",
    bottleImage: "",
    badge: take(F, "badge") ?? "",
    price: {
      from: takeNumber(F, "price_from") ?? 0,
      to: takeNumber(F, "price_to") ?? 0,
      unit: take(F, "price_unit") ?? "per bottle",
    },
    guarantee: {
      days: takeNumber(F, "guarantee_days") ?? 60,
      label: take(F, "guarantee_label") ?? "60-Day Money-Back Guarantee",
    },
    rating: {
      score: takeNumber(F, "rating_score") ?? 4.8,
      label: take(F, "rating_label") ?? "Based on verified customer experiences",
    },
    featured: takeBool(F, "featured") ?? false,
    publishedAt:
      take(F, "published_date", "published_at") ?? new Date().toISOString().slice(0, 10),
    vendor: take(F, "vendor") ?? "ClickBank",
    productForm: take(F, "product_form") ?? "",
    seo: {
      title: take(F, "seo_title") ?? title,
      description: take(F, "seo_description") ?? "",
      ogImage: take(F, "og_image", "social_share_image") ?? "",
    },
    stickyBar: {
      text: take(F, "sticky_bar_text") ?? "",
      ctaLabel: take(F, "sticky_bar_cta") ?? "",
    },
    trustBadges: {
      guaranteeText: take(F, "trust_guarantee_text") ?? "",
      shippingText: take(F, "trust_shipping_text") ?? "",
      vendorVerifiedText: take(F, "trust_vendor_verified_text") ?? "",
      manufacturingText: take(F, "trust_manufacturing_text") ?? "",
    },
    hero: {
      headline: take(F, "headline") ?? "",
      subheadline: take(F, "subheadline") ?? "",
      ctaLabel: take(F, "primary_cta_label", "cta_label", "cta") ?? "",
    },
    problem: {
      heading:
        take(F, "problem__heading", "problem_heading", "heading_problem") ??
        take(F, "heading") ??
        "",
      points: problemPoints,
    },
    solution: {
      heading:
        take(F, "solution__heading", "solution_heading", "heading_solution") ?? "",
      body: take(F, "solution__body", "body") ?? "",
    },
    ingredients,
    beforeAfter,
    testimonials,
    faq,
    footerDisclosure:
      take(
        F,
        "footer_disclosure_paragraph",
        "footer_disclosure",
        "footer_disclaimer",
        "disclaimer",
      ) ?? "",
  };

  return offer;
}
