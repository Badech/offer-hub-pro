import { createFileRoute, Link } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";
import { OfferCard } from "@/components/OfferCard";
import { fetchOffers } from "@/lib/server-functions";

export const Route = createFileRoute("/categories/$slug")({
  loader: async () => {
    return { offers: await fetchOffers() };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { offers } = Route.useLoaderData();
  const decoded = decodeURIComponent(slug);
  const list = offers.filter((o) => o.category === decoded);
  return (
    <GlobalLayout>
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Link to="/categories" className="text-[var(--text-secondary)] text-[14px] hover:underline">
          ← All categories
        </Link>
        <h1 className="mt-4">{decoded}</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          {list.length} offer{list.length === 1 ? "" : "s"} in this category.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((o) => (
            <OfferCard key={o.slug} offer={o} />
          ))}
        </div>
      </section>
    </GlobalLayout>
  );
}
