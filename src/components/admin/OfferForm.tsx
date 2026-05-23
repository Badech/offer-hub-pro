import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  OfferSchema,
  type Faq,
  type Ingredient,
  type Offer,
  type ProblemPoint,
  type Testimonial,
} from "@/lib/offer-schema";
import { createOffer, updateOffer } from "@/lib/server-functions";

// ────────────────────────────────────────────────────────────────────────────
// Shared offer editor — used for both "new" and "edit" admin pages.
// In edit mode the slug is locked (it's the primary key in Postgres).
// ────────────────────────────────────────────────────────────────────────────

const ICON_OPTIONS = [
  "BatteryLow",
  "Activity",
  "Brain",
  "TrendingDown",
  "Droplets",
  "HeartCrack",
  "CloudFog",
] as const;

export function emptyOffer(): Offer {
  return {
    slug: "",
    title: "",
    tagline: "",
    category: "Health & Wellness",
    tags: [],
    affiliateUrl: "",
    heroImage: "",
    bottleImage: "",
    badge: "",
    price: { from: 0, to: 0, unit: "per bottle" },
    guarantee: { days: 365, label: "365-Day Money-Back Guarantee" },
    rating: { score: 4.8, label: "Based on verified buyer reports" },
    featured: false,
    publishedAt: new Date().toISOString().slice(0, 10),
    vendor: "ClickBank",
    productForm: "Gummies",
    seo: { title: "", description: "", ogImage: "" },
    topBar: { emoji: "🔥", text: "" },
    eyebrow: "",
    stickyBar: { text: "", ctaLabel: "" },
    trustBadges: {
      guaranteeText: "",
      shippingText: "",
      vendorVerifiedText: "",
      manufacturingText: "",
    },
    hero: { headline: "", subheadline: "", ctaLabel: "" },
    problem: { heading: "", points: [] },
    solution: { heading: "", body: "" },
    ingredients: [],
    beforeAfter: [],
    testimonials: [],
    faq: [],
    footerDisclosure: "",
  };
}

export function OfferForm({
  mode,
  initialOffer,
}: {
  mode: "create" | "edit";
  initialOffer: Offer;
}) {
  const router = useRouter();
  const [offer, setOffer] = useState<Offer>(initialOffer);
  const [tagsInput, setTagsInput] = useState((initialOffer.tags ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof Offer>(key: K, value: Offer[K]) =>
    setOffer((o) => ({ ...o, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const draft: Offer = {
        ...offer,
        slug:
          mode === "edit"
            ? initialOffer.slug
            : offer.slug.trim() || slugify(offer.title),
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const parsed = OfferSchema.parse(draft);
      if (mode === "edit") {
        await updateOffer({ data: parsed });
      } else {
        await createOffer({ data: parsed });
      }
      await router.invalidate();
      router.navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save offer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-10">
      {/* Identity */}
      <Section title="Basics">
        <Row>
          <Field label="Title (required)">
            <input
              required
              value={offer.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputCls}
              placeholder="Spartamax"
            />
          </Field>
          <Field
            label={
              mode === "edit"
                ? "Slug (locked — primary key)"
                : "Slug (lowercase, hyphens, auto from title if empty)"
            }
          >
            <input
              value={offer.slug}
              onChange={(e) => update("slug", e.target.value)}
              className={inputCls + (mode === "edit" ? " bg-[var(--surface)]" : "")}
              placeholder="spartamax"
              readOnly={mode === "edit"}
            />
          </Field>
        </Row>
        <Field label="Tagline">
          <input
            required
            value={offer.tagline}
            onChange={(e) => update("tagline", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Row>
          <Field label="Category">
            <input
              required
              value={offer.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputCls}
              placeholder="Health & Wellness"
            />
          </Field>
          <Field label="Product form (e.g. Gummies, Course)">
            <input
              value={offer.productForm ?? ""}
              onChange={(e) => update("productForm", e.target.value)}
              className={inputCls}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Tags (comma-separated)">
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={inputCls}
              placeholder="Natural, Gummies, Testosterone Support"
            />
          </Field>
          <Field label="Vendor">
            <input
              required
              value={offer.vendor}
              onChange={(e) => update("vendor", e.target.value)}
              className={inputCls}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Affiliate URL (required)">
            <input
              required
              type="url"
              value={offer.affiliateUrl}
              onChange={(e) => update("affiliateUrl", e.target.value)}
              className={inputCls}
              placeholder="https://your-hop-link.hop.clickbank.net"
            />
          </Field>
          <Field label="Badge (e.g. Editor's Pick)">
            <input
              value={offer.badge ?? ""}
              onChange={(e) => update("badge", e.target.value)}
              className={inputCls}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Published date (YYYY-MM-DD)">
            <input
              required
              value={offer.publishedAt}
              onChange={(e) => update("publishedAt", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Featured?">
            <label className="inline-flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={offer.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="accent-[var(--accent)]"
              />
              <span className="text-[14px]">Show in homepage Editor's Picks</span>
            </label>
          </Field>
        </Row>
      </Section>

      {/* Price + guarantee + rating */}
      <Section title="Pricing & Trust">
        <Row>
          <Field label="Price from ($)">
            <input
              required
              type="number"
              min={0}
              value={offer.price.from}
              onChange={(e) =>
                update("price", { ...offer.price, from: Number(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Price to ($)">
            <input
              required
              type="number"
              min={0}
              value={offer.price.to}
              onChange={(e) =>
                update("price", { ...offer.price, to: Number(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Price unit">
            <input
              required
              value={offer.price.unit}
              onChange={(e) => update("price", { ...offer.price, unit: e.target.value })}
              className={inputCls}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Guarantee days">
            <input
              required
              type="number"
              min={0}
              value={offer.guarantee.days}
              onChange={(e) =>
                update("guarantee", { ...offer.guarantee, days: Number(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Guarantee label">
            <input
              required
              value={offer.guarantee.label}
              onChange={(e) =>
                update("guarantee", { ...offer.guarantee, label: e.target.value })
              }
              className={inputCls}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Rating score (0–5)">
            <input
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={offer.rating?.score ?? 0}
              onChange={(e) =>
                update("rating", {
                  score: Number(e.target.value),
                  label: offer.rating?.label ?? "Based on verified buyer reports",
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Rating label">
            <input
              value={offer.rating?.label ?? ""}
              onChange={(e) =>
                update("rating", {
                  score: offer.rating?.score ?? 0,
                  label: e.target.value,
                  count: offer.rating?.count,
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Rating count (optional — shown as '2,300+ customer reviews')">
            <input
              type="number"
              min={0}
              value={offer.rating?.count ?? ""}
              onChange={(e) =>
                update("rating", {
                  score: offer.rating?.score ?? 0,
                  label: offer.rating?.label ?? "",
                  count: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className={inputCls}
            />
          </Field>
        </Row>
      </Section>

      {/* Hero */}
      <Section title="Hero Section">
        <Field label="Headline">
          <input
            required
            value={offer.hero.headline}
            onChange={(e) => update("hero", { ...offer.hero, headline: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Subheadline">
          <textarea
            required
            rows={3}
            value={offer.hero.subheadline}
            onChange={(e) =>
              update("hero", { ...offer.hero, subheadline: e.target.value })
            }
            className={textareaCls}
          />
        </Field>
        <Field label="Primary CTA label">
          <input
            required
            value={offer.hero.ctaLabel}
            onChange={(e) => update("hero", { ...offer.hero, ctaLabel: e.target.value })}
            className={inputCls}
          />
        </Field>
        <ImageUpload
          label="Hero / product image"
          hint="1200 × 1200 px · square · PNG (transparent bg preferred) · < 2 MB"
          value={offer.heroImage}
          onChange={(url) => update("heroImage", url)}
        />
      </Section>

      {/* Top bar + eyebrow (above the hero) */}
      <Section title="Top Bar & Eyebrow">
        <Row>
          <Field label="Top bar emoji (e.g. 🔥)">
            <input
              value={offer.topBar?.emoji ?? ""}
              onChange={(e) =>
                update("topBar", {
                  emoji: e.target.value,
                  text: offer.topBar?.text ?? "",
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Top bar text">
            <input
              value={offer.topBar?.text ?? ""}
              onChange={(e) =>
                update("topBar", {
                  emoji: offer.topBar?.emoji ?? "🔥",
                  text: e.target.value,
                })
              }
              className={inputCls}
              placeholder="LIMITED TIME: 6-Bottle Bundle Now 29% Off — Today Only"
            />
          </Field>
        </Row>
        <Field label="Eyebrow pill (small text above the hero h1)">
          <input
            value={offer.eyebrow ?? ""}
            onChange={(e) => update("eyebrow", e.target.value)}
            className={inputCls}
            placeholder="Independent Review · Verified ClickBank Offer"
          />
        </Field>
      </Section>

      {/* Sticky bar + trust badges */}
      <Section title="Sticky Bar & Trust Badges">
        <Row>
          <Field label="Sticky bar text">
            <input
              value={offer.stickyBar?.text ?? ""}
              onChange={(e) =>
                update("stickyBar", {
                  text: e.target.value,
                  ctaLabel: offer.stickyBar?.ctaLabel ?? "",
                })
              }
              className={inputCls}
              placeholder="365-Day Risk-Free Guarantee…"
            />
          </Field>
          <Field label="Sticky bar CTA">
            <input
              value={offer.stickyBar?.ctaLabel ?? ""}
              onChange={(e) =>
                update("stickyBar", {
                  text: offer.stickyBar?.text ?? "",
                  ctaLabel: e.target.value,
                })
              }
              className={inputCls}
              placeholder="Get Spartamax →"
            />
          </Field>
        </Row>
        <Row>
          <Field label="Trust: guarantee text">
            <input
              value={offer.trustBadges?.guaranteeText ?? ""}
              onChange={(e) =>
                update("trustBadges", {
                  guaranteeText: e.target.value,
                  shippingText: offer.trustBadges?.shippingText ?? "",
                  vendorVerifiedText: offer.trustBadges?.vendorVerifiedText ?? "",
                  manufacturingText: offer.trustBadges?.manufacturingText ?? "",
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Trust: shipping text">
            <input
              value={offer.trustBadges?.shippingText ?? ""}
              onChange={(e) =>
                update("trustBadges", {
                  guaranteeText: offer.trustBadges?.guaranteeText ?? "",
                  shippingText: e.target.value,
                  vendorVerifiedText: offer.trustBadges?.vendorVerifiedText ?? "",
                  manufacturingText: offer.trustBadges?.manufacturingText ?? "",
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Trust: vendor verified text">
            <input
              value={offer.trustBadges?.vendorVerifiedText ?? ""}
              onChange={(e) =>
                update("trustBadges", {
                  guaranteeText: offer.trustBadges?.guaranteeText ?? "",
                  shippingText: offer.trustBadges?.shippingText ?? "",
                  vendorVerifiedText: e.target.value,
                  manufacturingText: offer.trustBadges?.manufacturingText ?? "",
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Trust: manufacturing text">
            <input
              value={offer.trustBadges?.manufacturingText ?? ""}
              onChange={(e) =>
                update("trustBadges", {
                  guaranteeText: offer.trustBadges?.guaranteeText ?? "",
                  shippingText: offer.trustBadges?.shippingText ?? "",
                  vendorVerifiedText: offer.trustBadges?.vendorVerifiedText ?? "",
                  manufacturingText: e.target.value,
                })
              }
              className={inputCls}
            />
          </Field>
        </Row>
      </Section>

      {/* Problem */}
      <Section title="Problem Section">
        <Field label="Heading (leave blank to hide section)">
          <input
            value={offer.problem.heading}
            onChange={(e) => update("problem", { ...offer.problem, heading: e.target.value })}
            className={inputCls}
          />
        </Field>
        <RepeaterList
          label="Problem points"
          items={offer.problem.points}
          empty={(): ProblemPoint => ({
            icon: "TrendingDown",
            label: "",
            description: "",
          })}
          onChange={(points) => update("problem", { ...offer.problem, points })}
          renderItem={(p, onUpdate) => (
            <>
              <Row>
                <Field label="Icon (used when emoji is empty)">
                  <select
                    value={p.icon}
                    onChange={(e) => onUpdate({ ...p, icon: e.target.value })}
                    className={inputCls}
                  >
                    {ICON_OPTIONS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Emoji (overrides icon, e.g. ⚡)">
                  <input
                    value={p.emoji ?? ""}
                    onChange={(e) => onUpdate({ ...p, emoji: e.target.value })}
                    className={inputCls}
                  />
                </Field>
              </Row>
              <Field label="Label">
                <input
                  value={p.label}
                  onChange={(e) => onUpdate({ ...p, label: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={2}
                  value={p.description}
                  onChange={(e) => onUpdate({ ...p, description: e.target.value })}
                  className={textareaCls}
                />
              </Field>
            </>
          )}
        />
      </Section>

      {/* Solution */}
      <Section title="Solution Section">
        <Field label="Heading">
          <input
            value={offer.solution.heading}
            onChange={(e) =>
              update("solution", { ...offer.solution, heading: e.target.value })
            }
            className={inputCls}
          />
        </Field>
        <Field label="Body">
          <textarea
            rows={4}
            value={offer.solution.body}
            onChange={(e) => update("solution", { ...offer.solution, body: e.target.value })}
            className={textareaCls}
          />
        </Field>
      </Section>

      {/* Ingredients */}
      <Section title="Ingredients">
        <RepeaterList
          label="Ingredients"
          items={offer.ingredients}
          empty={(): Ingredient => ({ name: "", benefit: "", image: "" })}
          onChange={(ingredients) => update("ingredients", ingredients)}
          renderItem={(it, onUpdate) => (
            <>
              <Row>
                <Field label="Name">
                  <input
                    value={it.name}
                    onChange={(e) => onUpdate({ ...it, name: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Dose (optional)">
                  <input
                    value={it.dose ?? ""}
                    onChange={(e) => onUpdate({ ...it, dose: e.target.value })}
                    className={inputCls}
                    placeholder="200mg · Standardized 2%"
                  />
                </Field>
              </Row>
              <Field label="Benefit">
                <textarea
                  rows={2}
                  value={it.benefit}
                  onChange={(e) => onUpdate({ ...it, benefit: e.target.value })}
                  className={textareaCls}
                />
              </Field>
              <ImageUpload
                label="Ingredient image (optional)"
                hint="400 × 400 px · square · JPG or PNG · < 300 KB"
                value={it.image ?? ""}
                onChange={(url) => onUpdate({ ...it, image: url })}
              />
            </>
          )}
        />
      </Section>

      {/* Before/After */}
      <Section title="Before / After">
        <RepeaterList
          label="Before/after pairs"
          items={offer.beforeAfter}
          empty={() => ({ before: "", after: "" })}
          onChange={(beforeAfter) => update("beforeAfter", beforeAfter)}
          renderItem={(ba, onUpdate) => (
            <Row>
              <Field label="Before">
                <textarea
                  rows={2}
                  value={ba.before}
                  onChange={(e) => onUpdate({ ...ba, before: e.target.value })}
                  className={textareaCls}
                />
              </Field>
              <Field label="After">
                <textarea
                  rows={2}
                  value={ba.after}
                  onChange={(e) => onUpdate({ ...ba, after: e.target.value })}
                  className={textareaCls}
                />
              </Field>
            </Row>
          )}
        />
      </Section>

      {/* Testimonials */}
      <Section title="Testimonials">
        <RepeaterList
          label="Testimonials"
          items={offer.testimonials}
          empty={(): Testimonial => ({
            name: "",
            age: 40,
            initials: "",
            rating: 5,
            quote: "",
            verified: true,
          })}
          onChange={(testimonials) => update("testimonials", testimonials)}
          renderItem={(t, onUpdate) => (
            <>
              <Row>
                <Field label="Name">
                  <input
                    value={t.name}
                    onChange={(e) => onUpdate({ ...t, name: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Age">
                  <input
                    type="number"
                    min={1}
                    value={t.age}
                    onChange={(e) => onUpdate({ ...t, age: Number(e.target.value) })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Initials (2-3 chars)">
                  <input
                    value={t.initials}
                    onChange={(e) => onUpdate({ ...t, initials: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Rating (1-5)">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={t.rating}
                    onChange={(e) =>
                      onUpdate({
                        ...t,
                        rating: Math.max(
                          1,
                          Math.min(5, Number(e.target.value)),
                        ) as Testimonial["rating"],
                      })
                    }
                    className={inputCls}
                  />
                </Field>
              </Row>
              <Field label="Quote">
                <textarea
                  rows={3}
                  value={t.quote}
                  onChange={(e) => onUpdate({ ...t, quote: e.target.value })}
                  className={textareaCls}
                />
              </Field>
              <Row>
                <Field label="Location (optional)">
                  <input
                    value={t.location ?? ""}
                    onChange={(e) => onUpdate({ ...t, location: e.target.value })}
                    className={inputCls}
                    placeholder="Dallas, TX"
                  />
                </Field>
                <Field label="Occupation (optional)">
                  <input
                    value={t.occupation ?? ""}
                    onChange={(e) => onUpdate({ ...t, occupation: e.target.value })}
                    className={inputCls}
                    placeholder="Construction Manager"
                  />
                </Field>
                <Field label="Bottle tier (optional)">
                  <input
                    value={t.bottleTier ?? ""}
                    onChange={(e) => onUpdate({ ...t, bottleTier: e.target.value })}
                    className={inputCls}
                    placeholder="6-bottle customer"
                  />
                </Field>
              </Row>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.verified}
                  onChange={(e) => onUpdate({ ...t, verified: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                <span className="text-[13px]">Show "Verified" pill</span>
              </label>
            </>
          )}
        />
      </Section>

      {/* FAQ */}
      <Section title="FAQ">
        <RepeaterList
          label="FAQ entries"
          items={offer.faq}
          empty={(): Faq => ({ question: "", answer: "" })}
          onChange={(faq) => update("faq", faq)}
          renderItem={(f, onUpdate) => (
            <>
              <Field label="Question">
                <input
                  value={f.question}
                  onChange={(e) => onUpdate({ ...f, question: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Answer">
                <textarea
                  rows={3}
                  value={f.answer}
                  onChange={(e) => onUpdate({ ...f, answer: e.target.value })}
                  className={textareaCls}
                />
              </Field>
            </>
          )}
        />
      </Section>

      {/* Presell page (optional) */}
      <Section title="Presell Page (optional /presell/<slug> advertorial)">
        <p className="text-[13px] text-[var(--text-secondary)] -mt-2">
          Fill this out to enable a dark-advertorial pre-sell page at <code>/presell/{offer.slug || "your-slug"}</code>.
          Leave blank to skip — the public landing page at <code>/offers/{offer.slug || "your-slug"}</code> always works.
        </p>
        <PresellFields offer={offer} update={update} />
      </Section>

      {/* SEO + Disclosure */}
      <Section title="SEO & Disclosure">
        <Field label="SEO title">
          <input
            required
            value={offer.seo.title}
            onChange={(e) => update("seo", { ...offer.seo, title: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="SEO description">
          <textarea
            required
            rows={2}
            value={offer.seo.description}
            onChange={(e) => update("seo", { ...offer.seo, description: e.target.value })}
            className={textareaCls}
          />
        </Field>
        <ImageUpload
          label="OG / social-share image"
          hint="1200 × 630 px · 1.91:1 · JPG or PNG · < 1 MB · shown in Facebook/Twitter/iMessage previews"
          value={offer.seo.ogImage}
          onChange={(url) => update("seo", { ...offer.seo, ogImage: url })}
        />
        <Field label="Footer disclosure paragraph (FDA / manufacturer / results notice)">
          <textarea
            rows={3}
            value={offer.footerDisclosure}
            onChange={(e) => update("footerDisclosure", e.target.value)}
            className={textareaCls}
          />
        </Field>
      </Section>

      {error && (
        <div
          className="rounded-md border border-[#fca5a5] bg-[#fef2f2] text-[#7f1d1d] text-[13px] p-3"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 sticky bottom-0 bg-[var(--background)] border-t border-[var(--border)] py-4 -mx-6 px-6">
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
          {submitting
            ? mode === "edit"
              ? "Saving…"
              : "Creating…"
            : mode === "edit"
              ? "Save changes"
              : "Create offer"}
        </button>
        <button
          type="button"
          onClick={() => router.navigate({ to: "/admin" })}
          className="btn-ghost"
        >
          Cancel
        </button>
        {mode === "edit" && (
          <a
            href={`/offers/${initialOffer.slug}`}
            target="_blank"
            rel="noopener"
            className="ml-auto text-[var(--accent)] text-[14px] font-medium hover:underline"
          >
            View live page ↗
          </a>
        )}
      </div>
    </form>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Form primitives
// ────────────────────────────────────────────────────────────────────────────

const inputCls =
  "mt-1 w-full border border-[var(--border)] rounded-md px-3 py-2 text-[14px] bg-white focus:outline-none focus:border-[var(--accent)]";
const textareaCls = inputCls + " leading-relaxed";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="card p-6 space-y-5">
      <legend className="text-[18px] font-semibold text-[var(--brand)] px-2">{title}</legend>
      {children}
    </fieldset>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--brand)]">{label}</label>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Presell sub-form (used inside OfferForm). Edits the optional offer.presell
// block. "Enable" toggle creates/destroys the whole sub-object so an offer
// with no presell field stays clean.
// ────────────────────────────────────────────────────────────────────────────

function defaultPresell(): NonNullable<Offer["presell"]> {
  return {
    topBarPrefix: "⚠",
    topBarSpan: "CLASSIFIED:",
    topBarText: "This file may be scrubbed — view before it disappears",
    eyebrowLabel: "Confidential leak — eyes only",
    headlineLead: "[LEAKED]",
    headlineMain: "",
    headlineTail: "",
    heroImage: "",
    heroIcon: "🛸",
    heroCaption: "Classified File — Surfaced Online",
    bodyCopy: "",
    alertText: "",
    alertLinkLabel: "it's all right here.",
    ctaLabel: "▶  WATCH THIS IMMEDIATELY",
    ctaSub: "Free to watch · No sign-up required · May be removed soon",
    importantLabel: "IMPORTANT:",
    importantText: "",
  };
}

function PresellFields({
  offer,
  update,
}: {
  offer: Offer;
  update: <K extends keyof Offer>(key: K, value: Offer[K]) => void;
}) {
  const enabled = !!offer.presell;
  const p = offer.presell ?? defaultPresell();
  const updateP = <K extends keyof NonNullable<Offer["presell"]>>(
    key: K,
    value: NonNullable<Offer["presell"]>[K],
  ) => update("presell", { ...p, [key]: value });

  if (!enabled) {
    return (
      <button
        type="button"
        onClick={() => update("presell", defaultPresell())}
        className="text-[var(--accent)] font-semibold text-[14px] hover:underline"
      >
        + Enable presell page for this offer
      </button>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[var(--brand)]">
          Presell page enabled
        </span>
        <button
          type="button"
          onClick={() => update("presell", undefined)}
          className="text-[12px] text-[#b91c1c] hover:underline"
        >
          Disable
        </button>
      </div>

      <Row>
        <Field label="Top bar prefix (emoji)">
          <input value={p.topBarPrefix} onChange={(e) => updateP("topBarPrefix", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Top bar yellow word">
          <input value={p.topBarSpan} onChange={(e) => updateP("topBarSpan", e.target.value)} className={inputCls} />
        </Field>
      </Row>
      <Field label="Top bar text">
        <input value={p.topBarText} onChange={(e) => updateP("topBarText", e.target.value)} className={inputCls} />
      </Field>

      <Field label="Eyebrow label (small uppercase line)">
        <input value={p.eyebrowLabel} onChange={(e) => updateP("eyebrowLabel", e.target.value)} className={inputCls} />
      </Field>

      <Row>
        <Field label="Headline lead (red tag)">
          <input value={p.headlineLead} onChange={(e) => updateP("headlineLead", e.target.value)} className={inputCls} placeholder="[LEAKED]" />
        </Field>
        <Field label="Headline main (white)">
          <input value={p.headlineMain} onChange={(e) => updateP("headlineMain", e.target.value)} className={inputCls} placeholder="NASA's Secret" />
        </Field>
      </Row>
      <Field label="Headline tail (red, new line)">
        <input value={p.headlineTail} onChange={(e) => updateP("headlineTail", e.target.value)} className={inputCls} placeholder="Shakes the White House" />
      </Field>

      <ImageUpload
        label="Hero image (dark/space-themed)"
        hint="Recommended ~720 × 240 px (3:1) · PNG or JPG · < 200 KB"
        value={p.heroImage}
        onChange={(url) => updateP("heroImage", url)}
      />
      <Row>
        <Field label="Hero icon (fallback if no image)">
          <input value={p.heroIcon} onChange={(e) => updateP("heroIcon", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Hero caption (fallback if no image)">
          <input value={p.heroCaption} onChange={(e) => updateP("heroCaption", e.target.value)} className={inputCls} />
        </Field>
      </Row>

      <Field label="Body copy — supports *italic-red*, **bold**, [text](inline-cta)">
        <textarea
          rows={6}
          value={p.bodyCopy}
          onChange={(e) => updateP("bodyCopy", e.target.value)}
          className={textareaCls}
          placeholder="*This message is for your eyes only.*&#10;Body paragraph here — use [WATCH THIS](inline-cta) for inline CTA links."
        />
      </Field>

      <Field label="Alert box text">
        <textarea
          rows={2}
          value={p.alertText}
          onChange={(e) => updateP("alertText", e.target.value)}
          className={textareaCls}
        />
      </Field>
      <Field label="Alert inline link label">
        <input value={p.alertLinkLabel} onChange={(e) => updateP("alertLinkLabel", e.target.value)} className={inputCls} />
      </Field>

      <Row>
        <Field label="CTA button label">
          <input value={p.ctaLabel} onChange={(e) => updateP("ctaLabel", e.target.value)} className={inputCls} />
        </Field>
        <Field label="CTA sub-text">
          <input value={p.ctaSub} onChange={(e) => updateP("ctaSub", e.target.value)} className={inputCls} />
        </Field>
      </Row>

      <Row>
        <Field label="Important line label (red)">
          <input value={p.importantLabel} onChange={(e) => updateP("importantLabel", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Important line text">
          <input value={p.importantText} onChange={(e) => updateP("importantText", e.target.value)} className={inputCls} />
        </Field>
      </Row>
    </div>
  );
}

function RepeaterList<T>({
  label,
  items,
  empty,
  onChange,
  renderItem,
}: {
  label: string;
  items: T[];
  empty: () => T;
  onChange: (next: T[]) => void;
  renderItem: (item: T, onUpdate: (next: T) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[13px] font-medium text-[var(--text-secondary)]">{label}</div>
        <button
          type="button"
          onClick={() => onChange([...items, empty()])}
          className="text-[13px] text-[var(--accent)] font-medium hover:underline"
        >
          + Add
        </button>
      </div>
      {items.length === 0 && (
        <p className="text-[13px] text-[var(--text-muted)] italic">None yet.</p>
      )}
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-md border border-[var(--border)] p-4 space-y-3 bg-[var(--surface)]"
        >
          <div className="flex items-center justify-between">
            <div className="text-[12px] uppercase tracking-wider text-[var(--text-muted)]">
              #{i + 1}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-[12px] text-[#b91c1c] hover:underline"
            >
              Remove
            </button>
          </div>
          {renderItem(item, (next) => {
            const copy = [...items];
            copy[i] = next;
            onChange(copy);
          })}
        </div>
      ))}
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
