import type { Offer } from "@/lib/offer-schema";

export function ConversionLayout({
  offer,
  children,
}: {
  offer: Offer;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <div className="sticky top-0 z-50 h-11 flex items-center px-4 md:px-6 text-white section-dark">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <a href="/" className="text-[15px] font-semibold tracking-tight shrink-0">
            OfferSendly
          </a>
          <span className="hidden sm:inline text-white/30">/</span>
          <span className="hidden sm:inline text-[13px] text-white/70 truncate">
            {offer.title}
          </span>
        </div>
        <a
          href={offer.affiliateUrl}
          target="_blank"
          rel="noopener sponsored"
          className="shrink-0 inline-flex items-center justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors text-white text-[13px] font-semibold px-3 py-1.5 rounded-md min-h-[36px]"
        >
          Get {offer.title} →
        </a>
      </div>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-[var(--border)] mt-16">
        <div className="max-w-4xl mx-auto px-6 py-10 text-[13px] text-[var(--text-muted)] leading-relaxed">
          <p>
            <strong className="text-[var(--text-secondary)]">Affiliate Disclosure:</strong>{" "}
            OfferSendly receives a commission when you purchase through links on this page, at no
            additional cost to you. We only list offers we've personally evaluated.
          </p>
          <p className="mt-3">
            <strong className="text-[var(--text-secondary)]">FDA Statement:</strong> These statements
            have not been evaluated by the Food and Drug Administration. This product is not
            intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p className="mt-3">
            <strong className="text-[var(--text-secondary)]">ClickBank Notice:</strong> Purchases
            are processed by ClickBank, the retailer of products on this site. ClickBank's role as
            retailer does not constitute an endorsement, approval, or review of these products.
          </p>
          <p className="mt-6 text-center text-[12px]">
            © {new Date().getFullYear()} OfferSendly ·{" "}
            <a href="/privacy" className="underline">Privacy</a> ·{" "}
            <a href="/terms" className="underline">Terms</a> ·{" "}
            <a href="/disclosure" className="underline">Disclosure</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
