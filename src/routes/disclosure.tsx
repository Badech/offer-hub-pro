import { createFileRoute } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";

export const Route = createFileRoute("/disclosure")({
  head: () => ({ meta: [{ title: "Affiliate Disclosure — OfferSendly" }] }),
  component: () => (
    <GlobalLayout>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <h1>Affiliate Disclosure</h1>
        <p className="mt-6 text-[18px] text-[var(--text-secondary)] leading-relaxed">
          OfferSendly is a participant in affiliate programs — including ClickBank — and earns a
          commission when you purchase through a link on this site. This never costs you more.
        </p>
        <h2 className="mt-12">Why we accept commissions</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          Commissions allow us to operate independently and continue evaluating offers. Without
          them, this site wouldn't exist.
        </p>
        <h2 className="mt-10">How commissions affect coverage</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          They don't. Editorial decisions — which offers we cover, how we review them, and what
          we say — are made independently of commission rate. We reject offers we don't believe
          in, even when the commission is high. We cover offers we believe in, even when the
          commission is low.
        </p>
        <h2 className="mt-10">What you can expect</h2>
        <ul className="mt-4 list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>Honest reviews based on real evaluation.</li>
          <li>Clear pricing and guarantee information up front.</li>
          <li>No artificial urgency, fake review counts, or fabricated testimonials.</li>
        </ul>
        <h2 className="mt-10">Questions?</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          Email editorial@offersendly.com.
        </p>
      </article>
    </GlobalLayout>
  ),
});
