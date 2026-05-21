import { createFileRoute, notFound } from "@tanstack/react-router";
import { OfferForm } from "@/components/admin/OfferForm";
import { fetchOfferBySlug } from "@/lib/server-functions";

export const Route = createFileRoute("/admin/offers/$slug/edit")({
  staleTime: 0,
  shouldReload: true,
  loader: async ({ params }) => {
    const offer = await fetchOfferBySlug({ data: params.slug });
    if (!offer) throw notFound();
    return { offer };
  },
  notFoundComponent: () => (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1>Offer not found</h1>
      <a href="/admin" className="btn-primary mt-6 inline-flex">
        Back to admin
      </a>
    </div>
  ),
  component: EditOfferPage,
});

function EditOfferPage() {
  const { offer } = Route.useLoaderData();
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-[32px]">Edit Offer</h1>
        <span className="text-[13px] text-[var(--text-muted)] font-mono">{offer.slug}</span>
      </div>
      <p className="mt-2 text-[var(--text-secondary)]">
        Changes save to the database immediately on submit.
      </p>
      <OfferForm mode="edit" initialOffer={offer} />
    </div>
  );
}
