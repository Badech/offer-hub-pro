import { createFileRoute, notFound } from "@tanstack/react-router";
import { PastedOfferPage } from "@/components/PastedOfferPage";
import { fetchOfferBySlug } from "@/lib/server-functions";

export const Route = createFileRoute("/offers/$slug")({
  staleTime: 0,
  shouldReload: true,
  loader: async ({ params }) => {
    const offer = await fetchOfferBySlug({ data: params.slug });
    if (!offer) throw notFound();
    return { offer };
  },
  head: ({ loaderData }) => {
    const o = loaderData?.offer;
    if (!o) return {};
    const canonical = `https://offersendly.com/offers/${o.slug}`;
    return {
      meta: [
        { title: o.title },
        { property: "og:title", content: o.title },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "OfferSendly" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: o.title },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1>Offer not found</h1>
        <a href="/" className="btn-primary mt-6 inline-flex">Go home</a>
      </div>
    </div>
  ),
  component: OfferPage,
});

function OfferPage() {
  const { offer } = Route.useLoaderData();
  return <PastedOfferPage offer={offer} />;
}
