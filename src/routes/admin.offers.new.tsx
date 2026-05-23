import { createFileRoute } from "@tanstack/react-router";
import { OfferForm, emptyOffer } from "@/components/admin/OfferForm";

export const Route = createFileRoute("/admin/offers/new")({
  component: NewOfferPage,
});

function NewOfferPage() {
  return <OfferForm mode="create" initialOffer={emptyOffer()} />;
}
