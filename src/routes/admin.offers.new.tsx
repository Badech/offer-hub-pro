import { createFileRoute } from "@tanstack/react-router";
import { OfferForm, emptyOffer } from "@/components/admin/OfferForm";

export const Route = createFileRoute("/admin/offers/new")({
  component: NewOfferPage,
});

function NewOfferPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-[32px]">New Offer</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        All fields shown here populate the same landing page template as Spartamax.
      </p>
      <OfferForm mode="create" initialOffer={emptyOffer()} />
    </div>
  );
}
