import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GlobalLayout } from "@/components/GlobalLayout";
import { OfferCard } from "@/components/OfferCard";
import { offers } from "@/data/offers";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [{ title: "Search — OfferSendly" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const results = q.trim()
    ? offers.filter((o) =>
        (o.title + " " + o.tagline + " " + o.category + " " + o.tags.join(" "))
          .toLowerCase()
          .includes(q.toLowerCase()),
      )
    : [];
  return (
    <GlobalLayout>
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1>Search</h1>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search offers, categories, ingredients…"
          className="mt-8 w-full border border-[var(--border)] rounded-lg px-5 py-4 text-[17px] bg-white focus:outline-none focus:border-[var(--accent)]"
        />
        <div className="mt-4 text-[14px] text-[var(--text-secondary)]">
          {q ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Type to begin."}
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((o) => (
            <OfferCard key={o.slug} offer={o} />
          ))}
        </div>
      </section>
    </GlobalLayout>
  );
}
