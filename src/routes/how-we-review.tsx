import { createFileRoute } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";

export const Route = createFileRoute("/how-we-review")({
  head: () => ({
    meta: [
      { title: "How We Review — OfferSendly" },
      { name: "description", content: "The evaluation process every offer goes through before it appears on OfferSendly." },
    ],
  }),
  component: HowWeReviewPage,
});

function HowWeReviewPage() {
  return (
    <GlobalLayout>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <h1>How We Review</h1>
        <p className="mt-6 text-[18px] text-[var(--text-secondary)] leading-relaxed">
          A short, honest look at what an offer has to clear before it appears on OfferSendly.
        </p>

        <h2 className="mt-14">Our evaluation criteria</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          We evaluate every offer across five dimensions: product quality, claim accuracy, vendor
          reputation, refund policy, and post-purchase experience. We score each privately. Offers
          that fall short on any single dimension are rejected.
        </p>

        <h2 className="mt-14">What disqualifies an offer</h2>
        <ul className="mt-4 list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>Unverifiable medical claims or before/after manipulation.</li>
          <li>Pricing that requires hidden upsells to actually deliver the advertised result.</li>
          <li>Refund policies shorter than 30 days, or refunds that require returning empty bottles only.</li>
          <li>Vendors who do not respond to support tickets within 72 hours.</li>
        </ul>

        <h2 className="mt-14">Guarantee requirements</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          We do not list offers without a money-back guarantee. Where possible, we prefer 60-day
          or longer windows. For consumable products, we require that the guarantee apply even
          to opened bottles.
        </p>

        <h2 className="mt-14">Our testing approach</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          When a product is testable, we test it. We track our own experience over the
          recommended use window before writing about it. For services and software, we use them
          like a real customer would and document friction at each step.
        </p>
      </article>
    </GlobalLayout>
  );
}
