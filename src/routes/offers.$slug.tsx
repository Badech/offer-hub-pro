import { createFileRoute, notFound } from "@tanstack/react-router";
import { ConversionLayout } from "@/components/ConversionLayout";
import { getOffer, type Offer } from "@/data/offers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  Truck,
  Factory,
  BadgeCheck,
  Package,
  BatteryLow,
  Activity,
  CloudFog,
  TrendingDown,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BatteryLow,
  Activity,
  CloudFog,
  TrendingDown,
};

export const Route = createFileRoute("/offers/$slug")({
  loader: ({ params }) => {
    const offer = getOffer(params.slug);
    if (!offer) throw notFound();
    return { offer };
  },
  head: ({ loaderData }) => {
    const o = loaderData?.offer;
    if (!o) return {};
    return {
      meta: [
        { title: o.seo.title },
        { name: "description", content: o.seo.description },
        { property: "og:title", content: o.seo.title },
        { property: "og:description", content: o.seo.description },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1>Offer not found</h1>
        <a href="/offers" className="btn-primary mt-6 inline-flex">Browse offers</a>
      </div>
    </div>
  ),
  component: OfferPage,
});

function OfferPage() {
  const { offer } = Route.useLoaderData();
  return (
    <ConversionLayout offer={offer}>
      <Hero offer={offer} />
      <Problem offer={offer} />
      <Solution offer={offer} />
      {offer.ingredients && offer.ingredients.length > 0 && <Ingredients offer={offer} />}
      {offer.beforeAfter.length > 0 && <BeforeAfter offer={offer} />}
      {offer.testimonials.length > 0 && <Testimonials offer={offer} />}
      <Guarantee offer={offer} />
      {offer.faq.length > 0 && <FAQ offer={offer} />}
      <FinalCTA offer={offer} />
    </ConversionLayout>
  );
}

function CTA({ offer, label }: { offer: Offer; label?: string }) {
  return (
    <a
      href={offer.affiliateUrl}
      target="_blank"
      rel="noopener sponsored"
      className="inline-flex items-center justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-[17px] px-8 py-4 rounded-md transition-colors"
    >
      {label ?? offer.hero.ctaLabel}
    </a>
  );
}

function Hero({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          {offer.badge && (
            <span className="pill mb-5">{offer.badge}</span>
          )}
          <h1 className="text-[var(--text-primary)]">{offer.hero.headline}</h1>
          <p className="mt-6 text-[18px] text-[var(--text-secondary)] leading-relaxed">
            {offer.hero.subheadline}
          </p>
          <div className="mt-8">
            <CTA offer={offer} />
          </div>
          <div className="mt-4 text-[13px] text-[var(--text-secondary)]">
            From ${offer.price.from} {offer.price.unit} · {offer.guarantee.label} · Free US Shipping (3+ bottles)
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Badge icon={<ShieldCheck className="w-4 h-4" />} text={`${offer.guarantee.days}-Day Money Back`} />
            <Badge icon={<BadgeCheck className="w-4 h-4" />} text={`${offer.vendor} Verified`} />
            <Badge icon={<Package className="w-4 h-4" />} text={`${offer.productForm ?? "Daily"} ritual`} />
            <Badge icon={<Factory className="w-4 h-4" />} text="FDA-Registered Facility" />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md aspect-square bg-white rounded-2xl border border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex items-center justify-center">
            <div className="text-center px-8">
              <div className="text-[var(--text-muted)] text-[12px] uppercase tracking-widest">
                {offer.productForm ?? "Product"}
              </div>
              <div className="mt-3 text-[40px] font-medium text-[var(--accent)] tracking-tight">
                {offer.title}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
      <span className="text-[var(--accent)]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Problem({ offer }: { offer: Offer }) {
  if (!offer.problem.heading) return null;
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-center text-[var(--text-primary)]">{offer.problem.heading}</h2>
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {offer.problem.points.map((p) => {
            const Icon = iconMap[p.icon] ?? TrendingDown;
            return (
              <div key={p.label} className="card p-6 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="font-medium text-[var(--text-primary)]">{p.label}</div>
                  <div className="text-[15px] text-[var(--text-secondary)] mt-1">{p.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Solution({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-[var(--text-primary)]">{offer.solution.heading}</h2>
        <p className="mt-6 text-[17px] text-[var(--text-secondary)] leading-relaxed">
          {offer.solution.body}
        </p>
        {offer.ingredients && (
          <a href="#ingredients" className="inline-block mt-8 text-[var(--accent)] font-medium hover:underline">
            See full ingredients ↓
          </a>
        )}
      </div>
    </section>
  );
}

function Ingredients({ offer }: { offer: Offer }) {
  return (
    <section id="ingredients" className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-[var(--text-primary)]">
          What's Inside — Every Ingredient, Explained
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offer.ingredients!.map((i) => (
            <div key={i.name} className="card p-6">
              <div className="w-12 h-12 rounded-full bg-[var(--tag-bg)] flex items-center justify-center mb-4">
                <span className="text-[var(--tag-fg)] font-medium">{i.name[0]}</span>
              </div>
              <div className="font-medium text-[var(--text-primary)] text-[17px]">{i.name}</div>
              <p className="mt-2 text-[15px] text-[var(--text-secondary)]">{i.benefit}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <CTA offer={offer} />
        </div>
      </div>
    </section>
  );
}

function BeforeAfter({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-[var(--text-primary)]">
          The shift men are reporting after 60 days.
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {offer.beforeAfter.map((ba, idx) => (
            <div key={idx} className="card overflow-hidden">
              <div className="p-6 bg-[#f1efea]">
                <div className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-2">Before</div>
                <p className="text-[15px] text-[var(--text-secondary)]">{ba.before}</p>
              </div>
              <div className="p-6 bg-[var(--accent)] text-white">
                <div className="text-[11px] uppercase tracking-wider text-white/70 mb-2">After</div>
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
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-center text-[var(--text-primary)]">Real People. Real Results.</h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {offer.testimonials.map((t) => (
            <div key={t.name} className="card p-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-medium">
                  {t.initials}
                </div>
                <div>
                  <div className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                    {t.name}, {t.age}
                    {t.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--tag-fg)] bg-[var(--tag-bg)] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= t.rating
                            ? "fill-[var(--accent)] text-[var(--accent)]"
                            : "text-[var(--border)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[15px] text-[var(--text-secondary)] leading-relaxed">
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[13px] text-[var(--text-muted)]">
          Results may vary. Individual experiences shared voluntarily.
        </p>
      </div>
    </section>
  );
}

function Guarantee({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--accent)] text-white">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <ShieldCheck className="w-16 h-16 mx-auto text-white/90" strokeWidth={1.5} />
        <h2 className="mt-6 text-white">{offer.guarantee.label}</h2>
        <p className="mt-6 text-[17px] text-white/85 leading-relaxed">
          Try {offer.title} for a full {offer.guarantee.days} days. If you don't feel the
          difference — for any reason — contact the vendor for a complete refund. Even on empty
          bottles. No questions, no friction.
        </p>
        <div className="mt-8">
          <a
            href={offer.affiliateUrl}
            target="_blank"
            rel="noopener sponsored"
            className="inline-flex items-center justify-center bg-white text-[var(--accent)] hover:bg-white/95 font-medium text-[17px] px-8 py-4 rounded-md transition-colors"
          >
            Try It Risk-Free →
          </a>
        </div>
      </div>
    </section>
  );
}

function FAQ({ offer }: { offer: Offer }) {
  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-center text-[var(--text-primary)]">Common Questions</h2>
        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="mt-10"
        >
          {offer.faq.map((q, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-[17px] font-medium text-[var(--text-primary)]">
                {q.question}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                {q.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-12 text-center">
          <CTA offer={offer} />
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ offer }: { offer: Offer }) {
  return (
    <section className="bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-[var(--text-primary)]">
          Give It {offer.guarantee.days} Days. Decide for Yourself.
        </h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          From ${offer.price.from} {offer.price.unit} · Free US shipping on 3+ bottles · {offer.guarantee.label}
        </p>
        <div className="mt-8">
          <CTA offer={offer} />
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
          <Badge icon={<ShieldCheck className="w-4 h-4" />} text="Money-Back" />
          <Badge icon={<BadgeCheck className="w-4 h-4" />} text={`${offer.vendor} Secure`} />
          <Badge icon={<Truck className="w-4 h-4" />} text="Free Shipping 3+" />
          <Badge icon={<Factory className="w-4 h-4" />} text="FDA-Registered" />
        </div>
      </div>
    </section>
  );
}
