import { createFileRoute } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — OfferSendly" }] }),
  component: () => (
    <GlobalLayout>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <h1>Terms &amp; Conditions</h1>
        <p className="mt-6 text-[var(--text-secondary)]">Last updated: May 21, 2026</p>
        <h2 className="mt-12">Use of the site</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          OfferSendly provides editorial content and affiliate links to third-party products. By
          using the site, you agree to use it for lawful, personal purposes only.
        </p>
        <h2 className="mt-10">No medical advice</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          Content on OfferSendly is for informational purposes only. It is not medical, legal, or
          financial advice. Always consult a qualified professional before making decisions about
          your health or finances.
        </p>
        <h2 className="mt-10">Third-party products</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          OfferSendly does not manufacture or sell the products we review. All purchases are
          completed on the vendor's website and are subject to that vendor's terms and refund
          policies.
        </p>
        <h2 className="mt-10">Limitation of liability</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          OfferSendly is not liable for outcomes you experience after purchasing a product
          featured on this site.
        </p>
      </article>
    </GlobalLayout>
  ),
});
