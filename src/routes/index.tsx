import { createFileRoute, Link } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";
import { fetchOffers } from "@/lib/server-functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OfferSendly — Curated offers. Honest reviews." },
      {
        name: "description",
        content:
          "Curated affiliate offers across health, finance, fitness, and lifestyle.",
      },
    ],
  }),
  staleTime: 0,
  shouldReload: true,
  loader: async () => ({ offers: await fetchOffers() }),
  component: HomePage,
});

function HomePage() {
  const { offers } = Route.useLoaderData();
  return (
    <GlobalLayout>
      <section className="section-warm border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <h1>Curated offers that actually deliver.</h1>
          <p className="mt-6 text-[18px] text-[var(--text-secondary)] max-w-2xl mx-auto">
            Hand-picked products across health, finance, and lifestyle — every page reviewed
            before publication.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2>All Offers</h2>
        <p className="mt-2 text-[var(--text-secondary)]">
          {offers.length} offer{offers.length === 1 ? "" : "s"} available.
        </p>
        {offers.length === 0 ? (
          <div className="mt-10 card p-10 text-center text-[var(--text-secondary)]">
            No offers yet. Check back soon.
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o) => (
              <Link
                key={o.slug}
                to="/offers/$slug"
                params={{ slug: o.slug }}
                className="card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
              >
                <h3 className="text-[var(--brand)]">{o.title}</h3>
                <div className="mt-4 text-[var(--accent)] font-medium text-[14px]">
                  View offer →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </GlobalLayout>
  );
}
