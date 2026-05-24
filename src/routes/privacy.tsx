import { createFileRoute } from "@tanstack/react-router";
import { H3, LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — OnlineOnSale" },
      { name: "description", content: "How OnlineOnSale handles your data, cookies, and the Meta (Facebook) Pixel." },
    ],
    links: [{ rel: "canonical", href: "https://onlineonsale.com/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="May 2026">
      <p>
        This website ("Site"), <strong>onlineonsale.com</strong>, is operated by an independent
        affiliate marketer. We respect your privacy and are committed to protecting any
        personal information you share with us.
      </p>

      <H3>Information We Collect</H3>
      <p>
        We may collect non-personally identifiable information automatically when you visit
        our Site, including your browser type, IP address, pages viewed, and referring URL.
        We do not directly collect your name, email, or payment information — those are
        handled by the merchant (ClickBank or its independent vendors) on their own pages.
      </p>

      <H3>Cookies & Tracking</H3>
      <p>
        We use cookies and similar tracking technologies (including the Meta Pixel /
        Facebook Pixel) to measure ad performance, understand our audience, and improve our
        marketing. You can control cookie settings through your browser preferences or opt
        out of Meta ad tracking at{" "}
        <a href="https://www.facebook.com/settings/?tab=ads" target="_blank" rel="noopener noreferrer">
          facebook.com/settings
        </a>
        .
      </p>

      <H3>Facebook / Meta Pixel</H3>
      <p>
        This Site uses the Meta Pixel to track conversions from Facebook and Instagram
        ads, optimize ads, build targeted audiences, and remarket to people who have
        visited the Site. Data collected via the Meta Pixel is subject to Meta's Data
        Policy at{" "}
        <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">
          facebook.com/privacy/policy
        </a>
        .
      </p>

      <H3>Third-Party Links</H3>
      <p>
        Our Site contains links to third-party websites, including merchant product offer
        pages. We are not responsible for the privacy practices or content of those sites.
      </p>

      <H3>Data Retention</H3>
      <p>
        We retain anonymised analytics data for up to 24 months. We do not sell or rent
        personal data to third parties.
      </p>

      <H3>Your Rights</H3>
      <p>
        Depending on your location, you may have the right to access, correct, or delete
        personal data we hold. Contact us at the email below to exercise these rights.
      </p>

      <H3>Contact</H3>
      <p>
        For privacy-related questions: <strong>support@onlineonsale.com</strong>
      </p>
    </LegalPage>
  );
}
