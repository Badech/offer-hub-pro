import { Link } from "@tanstack/react-router";
import { Star, ShieldCheck } from "lucide-react";
import type { Offer } from "@/data/offers";

export function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Link
      to="/offers/$slug"
      params={{ slug: offer.slug }}
      className="group relative flex flex-col card overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
    >
      {offer.badge && (
        <span className="absolute top-3 left-3 z-10 pill bg-[var(--accent)] text-white">
          {offer.badge}
        </span>
      )}
      <div className="aspect-[16/9] w-full bg-[var(--surface)] flex items-center justify-center border-b border-[var(--border)]">
        <span className="text-3xl font-medium text-[var(--text-muted)] tracking-tight">
          {offer.title}
        </span>
      </div>
      <div className="flex flex-col gap-3 p-5 flex-1">
        <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
          {offer.category}
        </span>
        <h3 className="text-[var(--text-primary)]">{offer.title}</h3>
        <p className="text-[15px] text-[var(--text-secondary)] line-clamp-2">
          {offer.tagline}
        </p>
        <div className="flex items-center gap-3 text-[13px] text-[var(--text-secondary)] mt-1">
          {offer.rating && (
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]" />
              {offer.rating.score.toFixed(1)}
            </span>
          )}
          <span className="text-[var(--border)]">·</span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {offer.guarantee.days}-day guarantee
          </span>
        </div>
        <div className="text-[14px] text-[var(--text-primary)] font-medium">
          From ${offer.price.from} {offer.price.unit}
        </div>
        <div className="mt-auto pt-3">
          <span className="btn-primary w-full">View Offer →</span>
        </div>
      </div>
    </Link>
  );
}
