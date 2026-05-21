import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { GlobalLayout } from "@/components/GlobalLayout";
import { OfferCard } from "@/components/OfferCard";
import { offers, categories } from "@/data/offers";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "All Offers — OfferSendly" },
      { name: "description", content: "Every offer in the OfferSendly directory, filterable by category and guarantee." },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [guarantee, setGuarantee] = useState<number>(0);
  const [sort, setSort] = useState<"featured" | "newest" | "rating">("featured");

  const filtered = useMemo(() => {
    let list = [...offers];
    if (selectedCats.length) list = list.filter((o) => selectedCats.includes(o.category));
    if (guarantee) list = list.filter((o) => o.guarantee.days >= guarantee);
    if (sort === "featured") list.sort((a, b) => Number(b.featured) - Number(a.featured));
    if (sort === "newest")
      list.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    if (sort === "rating")
      list.sort((a, b) => (b.rating?.score ?? 0) - (a.rating?.score ?? 0));
    return list;
  }, [selectedCats, guarantee, sort]);

  return (
    <GlobalLayout>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-[var(--text-primary)]">All Offers</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          Showing {filtered.length} offer{filtered.length === 1 ? "" : "s"}
        </p>

        <div className="mt-10 grid md:grid-cols-[260px_1fr] gap-10">
          <aside className="space-y-8">
            <FilterGroup title="Category">
              {categories.map((c) => (
                <label key={c} className="flex items-center gap-2 text-[14px] text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(c)}
                    onChange={(e) =>
                      setSelectedCats((prev) =>
                        e.target.checked ? [...prev, c] : prev.filter((x) => x !== c),
                      )
                    }
                    className="accent-[var(--accent)]"
                  />
                  {c}
                </label>
              ))}
            </FilterGroup>

            <FilterGroup title="Guarantee">
              {[
                { v: 0, l: "Any" },
                { v: 30, l: "30+ days" },
                { v: 60, l: "60+ days" },
                { v: 365, l: "365+ days" },
              ].map((g) => (
                <label key={g.v} className="flex items-center gap-2 text-[14px] text-[var(--text-secondary)] cursor-pointer">
                  <input
                    type="radio"
                    name="guarantee"
                    checked={guarantee === g.v}
                    onChange={() => setGuarantee(g.v)}
                    className="accent-[var(--accent)]"
                  />
                  {g.l}
                </label>
              ))}
            </FilterGroup>

            <FilterGroup title="Sort by">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-[14px] bg-white"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
              </select>
            </FilterGroup>
          </aside>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((o) => (
              <OfferCard key={o.slug} offer={o} />
            ))}
          </div>
        </div>
      </section>
    </GlobalLayout>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] uppercase tracking-wider text-[var(--text-muted)] mb-3">
        {title}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
