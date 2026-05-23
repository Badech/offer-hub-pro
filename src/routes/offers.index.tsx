import { createFileRoute, Link } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";
import { fetchOffers } from "@/lib/server-functions";

export const Route = createFileRoute("/offers/")({
  head: () => ({
    meta: [
      { title: "All Offers — OfferSendly" },
      { name: "description", content: "Every offer in the OfferSendly directory." },
    ],
  }),
  staleTime: 0,
  shouldReload: true,
  loader: async () => ({ offers: await fetchOffers() }),
  component: OffersPage,
});

function OffersPage() {
  const { offers } = Route.useLoaderData();
  return (
    <GlobalLayout>
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1>All Offers</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          {offers.length} offer{offers.length === 1 ? "" : "s"}
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          {offers.length === 0 && (
            <div className="col-span-full card p-10 text-center text-[var(--text-secondary)]">
              No offers yet.
            </div>
          )}
        </div>
      </section>
    </GlobalLayout>
  );
}
