import { createFileRoute, notFound } from "@tanstack/react-router";
import { PresellPage } from "@/components/PresellPage";
import { fetchOfferBySlug } from "@/lib/server-functions";

export const Route = createFileRoute("/presell/$slug")({
  staleTime: 0,
  shouldReload: true,
  loader: async ({ params }) => {
    const offer = await fetchOfferBySlug({ data: params.slug });
    if (!offer || !offer.presell) throw notFound();
    return { offer };
  },
  head: ({ loaderData }) => {
    const o = loaderData?.offer;
    if (!o) return {};
    const canonical = `https://offersendly.com/presell/${o.slug}`;
    const p = o.presell!;
    const title =
      [p.headlineLead, p.headlineMain, p.headlineTail].filter(Boolean).join(" ") ||
      o.seo.title;
    const description = o.seo.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonical },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: "OfferSendly" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        // Presell pages are paid-traffic LPs — we don't want them indexed
        // by search engines (they're for ad clicks only). Robots also keeps
        // Meta ad review from flagging duplicate landing content.
        { name: "robots", content: "noindex,follow" },
      ],
      links: [{ rel: "canonical", href: canonical }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1>Page not available</h1>
        <a href="/" className="btn-primary mt-6 inline-flex">
          Go home
        </a>
      </div>
    </div>
  ),
  component: PresellRoute,
});

function PresellRoute() {
  const { offer } = Route.useLoaderData();
  return <PresellPage offer={offer} />;
}
