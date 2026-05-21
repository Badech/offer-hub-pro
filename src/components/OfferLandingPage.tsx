import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Offer, ProblemPoint } from "@/lib/offer-schema";
import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  Factory,
  Lock,
  Package,
  RotateCcw,
  Leaf,
  Star,
  BatteryLow,
  Activity,
  Brain,
  TrendingDown,
  Droplets,
  HeartCrack,
  CloudFog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// Reusable Spartamax-style conversion landing page. Renders any Offer.
// Section visibility is data-driven — empty sections are skipped.
// ────────────────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  BatteryLow,
  Activity,
  Brain,
  TrendingDown,
  Droplets,
  HeartCrack,
  CloudFog,
};

export function OfferLandingPage({ offer }: { offer: Offer }) {
  return (
    <div className="min-h-screen bg-[var(--background)] font-sans text-[var(--text-primary)]">
      <StickyBar offer={offer} />
      <Hero offer={offer} />
      {offer.problem.heading && offer.problem.points.length > 0 && <Problem offer={offer} />}
      <Solution offer={offer} />
      {offer.ingredients.length > 0 && <Ingredients offer={offer} />}
      {offer.beforeAfter.length > 0 && <BeforeAfter offer={offer} />}
      {offer.testimonials.length > 0 && <Testimonials offer={offer} />}
      <Guarantee offer={offer} />
      {offer.faq.length > 0 && <FAQ offer={offer} />}
      <FinalCTA offer={offer} />
      <Footer offer={offer} />
    </div>
  );
}

function CTAButton({
  offer,
  children,
  variant = "amber",
}: {
  offer: Offer;
  children: React.ReactNode;
  variant?: "amber" | "white";
}) {
  return (
    <a
      href={offer.affiliateUrl}
      target="_blank"
      rel="noopener sponsored"
      className={variant === "white" ? "btn-on-dark" : "btn-primary"}
    >
      {children}
    </a>
  );
}

function StickyBar({ offer }: { offer: Offer }) {
  const text =
    offer.stickyBar?.text ?? `${offer.guarantee.days}-Day Risk-Free Guarantee`;
  const ctaLabel = offer.stickyBar?.ctaLabel ?? `Get ${offer.title} →`;
  return (
    <div className="sticky top-0 z-50 w-full section-dark" role="region" aria-label="Promotional bar">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 md:px-6 h-11">
        <div className="flex items-center gap-2 text-[13px] md:text-[14px] font-medium truncate">
          <span aria-hidden="true">⭐</span>
          <span className="hidden sm:inline">{text}</span>
          <span className="sm:hidden">{offer.guarantee.days}-Day Guarantee</span>
        </div>
        <a
          href={offer.affiliateUrl}
          target="_blank"
          rel="noopener sponsored"
          className="shrink-0 inline-flex items-center justify-center rounded-md font-semibold text-white text-[13px] px-3 py-1.5 min-h-[36px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}

function Hero({ offer }: { offer: Offer }) {
  const tb = offer.trustBadges;
  return (
    <section className="border-b border-[var(--border)] section-warm">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
        <div>
          <h1>{offer.hero.headline}</h1>
          <p className="mt-6 text-[18px] leading-relaxed text-[var(--text-secondary)]">
            {offer.hero.subheadline}
          </p>
          <div className="mt-8">
            <CTAButton offer={offer}>{offer.hero.ctaLabel}</CTAButton>
            <p className="mt-3 text-[13px] text-[var(--text-secondary)]">
              Starting at ${offer.price.from}/{offer.price.unit.replace(/^per\s+/i, "")} ·{" "}
              {offer.guarantee.label}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <TrustBadge
              icon={<ShieldCheck className="h-4 w-4" />}
              text={tb?.guaranteeText || `${offer.guarantee.days}-Day Money Back`}
            />
            <TrustBadge
              icon={<Truck className="h-4 w-4" />}
              text={tb?.shippingText || "Free US Shipping (3+)"}
            />
            <TrustBadge
              icon={<BadgeCheck className="h-4 w-4" />}
              text={tb?.vendorVerifiedText || `${offer.vendor} Verified`}
            />
            <TrustBadge
              icon={<Factory className="h-4 w-4" />}
              text={tb?.manufacturingText || "FDA-Registered Facility"}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <BottleVisual offer={offer} />
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
      <span className="text-[var(--accent)]" aria-hidden="true">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function BottleVisual({ offer }: { offer: Offer }) {
  if (offer.heroImage) {
    return (
      <img
        src={offer.heroImage}
        alt={`${offer.title} product`}
        width={512}
        height={512}
        className="aspect-square w-full max-w-md rounded-2xl border border-[var(--border)] bg-white object-contain"
        loading="eager"
      />
    );
  }
  return (
    <div
      className="aspect-square w-full max-w-md rounded-2xl border border-[var(--border)] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] flex items-center justify-center"
      role="img"
      aria-label={`${offer.title} product visual`}
    >
      <div className="text-center px-8">
        {offer.productForm && (
          <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">
            {offer.productForm}
          </div>
        )}
        <div className="mt-3 text-[44px] font-semibold tracking-tight text-[var(--brand)]">
          {offer.title}
        </div>
      </div>
    </div>
  );
}

function Problem({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--surface)]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center">{offer.problem.heading}</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {offer.problem.points.map((p, i) => (
            <ProblemCard key={i} point={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ point }: { point: ProblemPoint }) {
  const Icon = ICON_MAP[point.icon] ?? TrendingDown;
  return (
    <div className="card flex gap-4 p-6">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-semibold text-[var(--brand)]">{point.label}</div>
        <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-secondary)]">
          {point.description}
        </p>
      </div>
    </div>
  );
}

function Solution({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2>{offer.solution.heading}</h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[var(--text-secondary)]">
          {offer.solution.body}
        </p>
        {offer.ingredients.length > 0 && (
          <a
            href="#ingredients"
            className="mt-8 inline-block font-semibold text-[var(--accent)] hover:underline underline-offset-4"
          >
            See the Full Ingredient Breakdown ↓
          </a>
        )}
      </div>
    </section>
  );
}

function Ingredients({ offer }: { offer: Offer }) {
  return (
    <section id="ingredients" className="bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center">
          {offer.ingredients.length} Ingredients. Each One Chosen For a Reason.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offer.ingredients.map((i) => (
            <div key={i.name} className="card p-6">
              {i.image ? (
                <img
                  src={i.image}
                  alt={i.name}
                  width={56}
                  height={56}
                  className="mb-4 h-14 w-14 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-full text-[20px] font-semibold bg-[var(--accent-soft)] text-[var(--accent)]"
                  aria-hidden="true"
                >
                  {i.name[0]}
                </div>
              )}
              <div className="font-semibold text-[17px] text-[var(--brand)]">{i.name}</div>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {i.benefit}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <CTAButton offer={offer}>
            Try {offer.title} Risk-Free for {offer.guarantee.days} Days →
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--background)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center">
          What People Report After Adding {offer.title} to Their Routine
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {offer.beforeAfter.map((ba, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-[var(--border)] shadow-sm">
              <div className="p-6 bg-[var(--surface)]">
                <div className="mb-2 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                  Before
                </div>
                <p className="text-[15px] text-[var(--text-secondary)]">{ba.before}</p>
              </div>
              <div className="h-px w-full bg-[var(--border)]" />
              <div className="p-6 section-dark">
                <div className="mb-2 text-[11px] uppercase tracking-wider text-[var(--accent)]">
                  After
                </div>
                <p className="text-[15px] text-white/95">{ba.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center">Real People. Real Results.</h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {offer.testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full font-semibold text-white bg-[var(--brand)]"
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-[var(--brand)]">
                    {t.name}, {t.age}
                    {t.verified && (
                      <span className="pill text-[11px] px-2 py-0.5">Verified</span>
                    )}
                  </div>
                  <div className="mt-1 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= t.rating
                            ? "fill-[var(--accent)] text-[var(--accent)]"
                            : "text-[var(--border)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-secondary)]">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[13px] text-[var(--text-muted)]">
          Results may vary. These are individual experiences shared voluntarily.
        </p>
      </div>
    </section>
  );
}

function Guarantee({ offer }: { offer: Offer }) {
  return (
    <section className="section-dark">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <ShieldCheck
          className="mx-auto h-16 w-16 text-[var(--accent)]"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h2 className="mt-6 text-white">
          {offer.guarantee.days} Days. Every Cent Back. No Questions.
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-white/85">
          {offer.title} comes with an ironclad {offer.guarantee.days}-day money-back guarantee.
          If you're not satisfied for any reason — or no reason at all — contact {offer.vendor}{" "}
          and receive a full refund.
        </p>
        <div className="mt-8">
          <CTAButton offer={offer} variant="white">
            Try It Risk-Free →
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

function FAQ({ offer }: { offer: Offer }) {
  return (
    <section id="faq" className="bg-[var(--background)]">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center">Common Questions</h2>
        <div className="mt-10 hidden md:block">
          <Accordion
            type="multiple"
            defaultValue={offer.faq.map((_, i) => `item-${i}`)}
            className="space-y-2"
          >
            {offer.faq.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-[17px] font-semibold text-[var(--brand)]">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-10 md:hidden">
          <Accordion type="single" collapsible className="space-y-2">
            {offer.faq.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-[16px] font-semibold text-[var(--brand)]">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="mt-12 text-center">
          <CTAButton offer={offer}>Try {offer.title} Risk-Free →</CTAButton>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ offer }: { offer: Offer }) {
  return (
    <section className="border-t border-[var(--border)] section-warm">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2>
          Give It {offer.guarantee.days} Days. Decide for Yourself.
        </h2>
        <p className="mt-4 text-[17px] text-[var(--text-secondary)]">
          Starting at ${offer.price.from}/{offer.price.unit.replace(/^per\s+/i, "")}. Backed by{" "}
          {offer.guarantee.label}.
        </p>
        <div className="mt-8">
          <CTAButton offer={offer}>Get My Discounted {offer.title} →</CTAButton>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          <MicroTrust icon={<Lock className="h-4 w-4" />} text={`Secure ${offer.vendor} Checkout`} />
          <MicroTrust icon={<Package className="h-4 w-4" />} text="Ships Within 24 Hours" />
          <MicroTrust
            icon={<RotateCcw className="h-4 w-4" />}
            text={`${offer.guarantee.days}-Day Full Refund`}
          />
          <MicroTrust icon={<Leaf className="h-4 w-4" />} text="Trusted Source" />
        </div>
      </div>
    </section>
  );
}

function MicroTrust({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-[13px] text-[var(--text-secondary)]">
      <span className="text-[var(--accent)]" aria-hidden="true">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Footer({ offer }: { offer: Offer }) {
  const disclosure =
    offer.footerDisclosure ||
    `OfferSendly may earn a commission on purchases made through links on this page, at no extra cost to you. This page is not affiliated with or endorsed by ${offer.title}'s manufacturer. Results vary.`;
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="text-center font-semibold text-[var(--brand)]">OfferSendly</div>
        <p className="mt-3 text-center text-[12px] text-[var(--text-muted)]">
          © {new Date().getFullYear()} OfferSendly ·{" "}
          <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a> ·{" "}
          <a href="/terms" className="underline underline-offset-2">Terms</a> ·{" "}
          <a href="/disclosure" className="underline underline-offset-2">Affiliate Disclosure</a>
        </p>
        <p className="mx-auto mt-5 max-w-3xl text-center text-[12px] leading-relaxed text-[var(--text-muted)]">
          {disclosure}
        </p>
      </div>
    </footer>
  );
}
