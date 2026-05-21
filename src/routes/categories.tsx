import { createFileRoute, Link } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";
import { categories, offers } from "@/data/offers";
import { Heart, Dumbbell, DollarSign, GraduationCap, Sparkles, Code } from "lucide-react";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Health & Wellness": Heart,
  Fitness: Dumbbell,
  Finance: DollarSign,
  "Digital Courses": GraduationCap,
  Skincare: Sparkles,
  Software: Code,
};

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Browse by Category — OfferSendly" },
      { name: "description", content: "Explore vetted offers by category." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <GlobalLayout>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1>Browse by Category</h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          Find offers grouped by what you're actually looking for.
        </p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const Icon = icons[c] ?? Sparkles;
            const count = offers.filter((o) => o.category === c).length;
            return (
              <Link
                key={c}
                to="/categories/$slug"
                params={{ slug: encodeURIComponent(c) }}
                className="card p-6 transition-all hover:-translate-y-0.5"
              >
                <Icon className="w-7 h-7 text-[var(--accent)]" strokeWidth={1.5} />
                <div className="mt-5 text-[18px] font-medium text-[var(--text-primary)]">{c}</div>
                <div className="text-[14px] text-[var(--text-secondary)] mt-1">
                  {count} offer{count === 1 ? "" : "s"}
                </div>
                <div className="mt-6 text-[var(--accent)] font-medium text-[14px]">Browse →</div>
              </Link>
            );
          })}
        </div>
      </section>
    </GlobalLayout>
  );
}
