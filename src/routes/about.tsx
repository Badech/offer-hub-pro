import { createFileRoute } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About OnlineOnSale" },
      { name: "description", content: "How OnlineOnSale evaluates offers and what makes our editorial approach different." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <GlobalLayout>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <h1>About OnlineOnSale</h1>
        <p className="mt-6 text-[18px] text-[var(--text-secondary)] leading-relaxed">
          OnlineOnSale is a small editorial team that reviews digital products and consumer offers
          across health, fitness, finance, and lifestyle. We exist for one reason: there is too
          much noise online, and most affiliate sites are designed to push anything that pays.
        </p>

        <h2 className="mt-14">Who we are</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          A team of writers and analysts with backgrounds in consumer health, finance, and
          performance research. We've spent years in adjacent industries and started OnlineOnSale
          to build the kind of recommendation site we'd actually trust ourselves.
        </p>

        <h2 className="mt-14">How we select offers</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          Every offer we list has been personally evaluated by a member of our team. We review
          ingredients, marketing claims, vendor reputation, refund policies, and customer
          experience. The vast majority of offers we evaluate never make it onto the site.
        </p>

        <h2 className="mt-14">Our editorial standards</h2>
        <ul className="mt-4 list-disc pl-6 text-[var(--text-secondary)] space-y-2">
          <li>No fake reviews, no fabricated star counts, no invented testimonials.</li>
          <li>Every offer must include a meaningful money-back guarantee.</li>
          <li>Every vendor must process payments through an established platform.</li>
          <li>We disclose every commercial relationship we have.</li>
        </ul>

        <h2 className="mt-14">Affiliate disclosure</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          OnlineOnSale earns a commission when you purchase through a link on this site. This
          never costs you more. Our commission does not influence which offers we cover or how
          we review them. See our full{" "}
          <a href="/disclosure" className="text-[var(--accent)] underline">Affiliate Disclosure</a>.
        </p>
      </article>
    </GlobalLayout>
  );
}
