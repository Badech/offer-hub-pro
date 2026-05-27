import { createFileRoute } from "@tanstack/react-router";
import { H3, LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — OfferSendly" },
      { name: "description", content: "Advertising disclosure, results disclaimer, and FDA statements for OfferSendly." },
    ],
    links: [{ rel: "canonical", href: "https://offersendly.com/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" lastUpdated="May 2026">
      <H3>Advertising Disclosure</H3>
      <p>
        <strong>offersendly.com</strong> is an advertising website. The owner is an affiliate
        of the products featured on this Site and may receive compensation when you click
        links and make a purchase.
      </p>

      <H3>Results Disclaimer</H3>
      <p>
        Individual results will vary. The stories, testimonials, and claims presented on
        this Site are illustrative examples and are not guarantees of typical results.
        Your experience may differ based on many factors including effort, background,
        diet, exercise habits, and market conditions.
      </p>

      <H3>Not Official</H3>
      <p>
        This Site is not affiliated with, endorsed by, or sponsored by NASA, the United
        States government, the White House, Facebook, Meta, ClickBank, or any government
        agency. Headlines and copy may be used for illustrative and entertainment purposes
        to drive curiosity about product offers.
      </p>

      <H3>Health & Safety</H3>
      <p>
        Any claims about water quality, supplement effects, weight loss, or other
        health-related outcomes should be verified independently. Always consult a
        qualified healthcare professional before starting any dietary supplement program
        or making significant lifestyle changes. Always follow local regulations regarding
        water collection and use.
      </p>

      <H3>FDA Statement</H3>
      <p>
        Statements on this Site about supplements, food, or health-related products have
        not been evaluated by the U.S. Food and Drug Administration. These products are
        not intended to diagnose, treat, cure, or prevent any disease.
      </p>

      <H3>Forward-Looking Statements</H3>
      <p>
        Any statements on this Site about future outcomes are forward-looking and not
        guarantees. They involve risks and uncertainties that could cause actual results
        to differ materially.
      </p>

      <H3>ClickBank</H3>
      <p>
        ClickBank is the retailer of products on this Site. CLICKBANK® is a registered
        trademark of Click Sales, Inc., a Delaware corporation. ClickBank's role as
        retailer does not constitute an endorsement, approval, or review of these products
        or any claim, statement, or opinion used in promotion of these products.
      </p>
    </LegalPage>
  );
}
