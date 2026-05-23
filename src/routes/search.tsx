import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlobalLayout } from "@/components/GlobalLayout";
import { fetchOffers } from "@/lib/server-functions";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search — OfferSendly" }] }),
  staleTime: 0,
  shouldReload: true,
  loader: async () => ({ offers: await fetchOffers() }),
  component: SearchPage,
});

function SearchPage() {
  const { offers } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const results = q.trim()
    ? offers.filter((o) => o.title.toLowerCase().includes(q.toLowerCase()))
    : [];
  return (
    <GlobalLayout>
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1>Search</h1>
        <label className="sr-only" htmlFor="q">Search offers</label>
        <input
          id="q"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search offers by title…"
          className="mt-8 w-full border border-[var(--border)] rounded-lg px-5 py-4 text-[17px] bg-white focus:outline-none focus:border-[var(--accent)]"
        />
        <div className="mt-4 text-[14px] text-[var(--text-secondary)]">
          {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Type to begin."}
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((o) => (
            <Link
              key={o.slug}
              to="/offers/$slug"
              params={{ slug: o.slug }}
              className="card p-6 transition-all hover:-translate-y-0.5"
            >
              <h3 className="text-[var(--brand)]">{o.title}</h3>
              <div className="mt-4 text-[var(--accent)] font-medium text-[14px]">View offer →</div>
            </Link>
          ))}
        </div>
      </section>
    </GlobalLayout>
  );
}
