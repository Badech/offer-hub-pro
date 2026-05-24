import { createFileRoute } from "@tanstack/react-router";
import { H3, LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — OnlineOnSale" },
      { name: "description", content: "Terms that govern your use of onlineonsale.com." },
    ],
    links: [{ rel: "canonical", href: "https://onlineonsale.com/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms of Use" lastUpdated="May 2026">
      <p>
        By accessing and using <strong>onlineonsale.com</strong> ("Site"), you agree to be
        bound by these Terms of Use. If you do not agree, please do not use this Site.
      </p>

      <H3>Purpose of This Site</H3>
      <p>
        This Site is an independent advertising and review page. It is not the official
        website of any product or merchant featured here. The purpose of OnlineOnSale is to
        provide information and direct interested visitors to third-party product offers
        we believe represent good value.
      </p>

      <H3>Affiliate Relationship</H3>
      <p>
        OnlineOnSale participates in the ClickBank affiliate program and may participate in
        other affiliate networks. When you click a link and make a purchase, we may earn a
        commission. This does not affect the price you pay.
      </p>

      <H3>No Warranties</H3>
      <p>
        This Site is provided "as is" without warranties of any kind. We make no guarantees
        about the accuracy, completeness, or reliability of any content on this Site.
      </p>

      <H3>Intellectual Property</H3>
      <p>
        All original content on this Site is owned by the Site operator or used with
        permission. You may not reproduce or redistribute content without prior written
        consent.
      </p>

      <H3>Limitation of Liability</H3>
      <p>
        To the fullest extent permitted by law, we are not liable for any indirect,
        incidental, or consequential damages arising from your use of this Site or any
        linked third-party product.
      </p>

      <H3>Governing Law</H3>
      <p>
        These Terms are governed by applicable law. Disputes shall be resolved through
        binding arbitration where permitted.
      </p>

      <H3>Changes to Terms</H3>
      <p>
        We reserve the right to update these Terms at any time. Continued use of the Site
        constitutes acceptance of the updated Terms.
      </p>
    </LegalPage>
  );
}
