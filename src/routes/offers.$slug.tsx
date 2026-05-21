import { createFileRoute, notFound } from "@tanstack/react-router";
import { OfferLandingPage } from "@/components/OfferLandingPage";
import { fetchOfferBySlug } from "@/lib/server-functions";

export const Route = createFileRoute("/offers/$slug")({
  // Refetch on every visit so admin edits show up immediately on the public
  // page without needing a hard reload.
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
        { title: o.seo.title },
        { name: "description", content: o.seo.description },
        { property: "og:title", content: o.seo.title },
        { property: "og:description", content: o.seo.description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "OfferSendly" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: o.seo.title },
        { name: "twitter:description", content: o.seo.description },
        { name: "robots", content: "index,follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1>Offer not found</h1>
        <a href="/offers" className="btn-primary mt-6 inline-flex">
          Browse offers
        </a>
      </div>
    </div>
  ),
  component: OfferPage,
});

function OfferPage() {
  const { offer } = Route.useLoaderData();
  return <OfferLandingPage offer={offer} />;
}
