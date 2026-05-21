import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlobalLayout } from "@/components/GlobalLayout";
import { OfferCard } from "@/components/OfferCard";
import { fetchCategories, fetchOffers } from "@/lib/server-functions";
import { Search, Lock, DollarSign, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OfferSendly — Curated offers. Honest reviews." },
      {
        name: "description",
        content:
          "We review and handpick the best digital products across health, finance, and lifestyle — so you only see the ones worth your money.",
      },
    ],
  }),
  staleTime: 0,
  shouldReload: true,
  loader: async () => {
    const [offers, categories] = await Promise.all([fetchOffers(), fetchCategories()]);
    return { offers, categories };
  },
  component: HomePage,
});

function HomePage() {
  const { offers, categories } = Route.useLoaderData();
  const [activeCat, setActiveCat] = useState<string>("All");
  const featured = offers.filter((o) => o.featured);
  const healthOffers = offers.filter((o) => o.category === "Health & Wellness");
  const fitnessOffers = offers.filter((o) => o.category === "Fitness");
  const filtered =
    activeCat === "All" ? featured : featured.filter((o) => o.category === activeCat);

  return (
    <GlobalLayout>
      <section className="section-warm border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1>Curated offers that actually deliver.</h1>
            <p className="mt-6 text-[18px] text-[var(--text-secondary)] max-w-xl">
              We review and handpick the best digital products across health, finance, and
              lifestyle — so you only see the ones worth your money.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/offers" className="btn-primary">
                Browse All Offers
              </Link>
              <Link to="/how-we-review" className="btn-ghost">
                How We Review
              </Link>
            </div>
          </div>
          <div className="relative h-[360px] hidden md:block">
            {featured.slice(0, 3).map((o, i) => (
              <div
                key={o.slug}
                className="absolute card p-5 w-[280px]"
                style={{
                  top: `${i * 50}px`,
                  left: `${i * 60}px`,
                  transform: `rotate(${(i - 1) * 4}deg)`,
                  zIndex: 10 - i,
                }}
              >
                <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
                  {o.category}
                </span>
                <h3 className="mt-2 text-[var(--text-primary)]">{o.title}</h3>
                <p className="mt-2 text-[14px] text-[var(--text-secondary)] line-clamp-2">
                  {o.tagline}
                </p>
                <div className="mt-4 text-[13px] text-[var(--accent)] font-medium">
                  From ${o.price.from} {o.price.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex gap-2 overflow-x-auto">
          {["All", ...categories].map((c) => {
            const active = activeCat === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-[14px] font-medium border transition-colors ${
                  active
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface)]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <h2>Editor's Picks This Week</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((o) => (
            <OfferCard key={o.slug} offer={o} />
          ))}
        </div>
        <div className="mt-10">
          <Link to="/offers" className="text-[var(--accent)] font-medium hover:underline">
            View all offers →
          </Link>
        </div>
      </section>

      <section className="section-warm border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
          <TrustItem
            icon={<Search className="w-6 h-6 text-[var(--accent)]" />}
            title="Hands-On Review"
            desc="Every offer is personally evaluated before listing"
          />
          <TrustItem
            icon={<Lock className="w-6 h-6 text-[var(--accent)]" />}
            title="Risk-Free Only"
            desc="We only list offers with a money-back guarantee"
          />
          <TrustItem
            icon={<DollarSign className="w-6 h-6 text-[var(--accent)]" />}
            title="No Hidden Costs"
            desc="What you see is what you pay"
          />
          <TrustItem
            icon={<CheckCircle2 className="w-6 h-6 text-[var(--accent)]" />}
            title="ClickBank Verified"
            desc="All vendors processed through ClickBank's secure platform"
          />
        </div>
      </section>

      {[
        { title: "Health & Wellness", items: healthOffers },
        { title: "Fitness", items: fitnessOffers },
      ].map((row) =>
        row.items.length === 0 ? null : (
          <section key={row.title} className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2>{row.title}</h2>
              <Link to="/offers" className="text-[var(--accent)] font-medium hover:underline">
                See all →
              </Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 snap-x">
              {row.items.map((o) => (
                <div key={o.slug} className="min-w-[300px] md:min-w-[340px] snap-start">
                  <OfferCard offer={o} />
                </div>
              ))}
            </div>
          </section>
        ),
      )}

      <section className="section-dark">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-white">Editorial first. Always.</h2>
          <p className="mt-6 text-[17px] text-white/85 leading-relaxed">
            OfferSendly exists because the internet is full of affiliate sites that list anything
            that pays. We don't. We test, evaluate, and reject far more offers than we publish — so
            when you see something here, it has already cleared a real bar.
          </p>
          <Link
            to="/how-we-review"
            className="inline-block mt-8 text-white underline underline-offset-4 font-medium"
          >
            Read our review process →
          </Link>
        </div>
      </section>
    </GlobalLayout>
  );
}

function TrustItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-[var(--tag-bg)] flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="font-medium text-[var(--text-primary)]">{title}</div>
      <div className="text-[14px] text-[var(--text-secondary)] mt-1">{desc}</div>
    </div>
  );
}
