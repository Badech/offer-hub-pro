import { createFileRoute } from "@tanstack/react-router";
import { H3, LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — OnlineOnSale" },
      { name: "description", content: "Reach the OnlineOnSale team for editorial, privacy, or ad-related enquiries." },
    ],
    links: [{ rel: "canonical", href: "https://onlineonsale.com/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalPage title="Contact Us">
      <p>
        We're happy to help with any questions about <strong>onlineonsale.com</strong>, the
        products featured here, or our advertising and affiliate practices.
      </p>

      <H3>General Inquiries</H3>
      <p>
        Email: <a href="mailto:support@onlineonsale.com">support@onlineonsale.com</a>
      </p>

      <H3>Product Support</H3>
      <p>
        For questions about your order, billing, or the product itself, please contact the
        merchant or ClickBank directly. Each offer page lists the merchant's support
        details where available.
      </p>

      <H3>ClickBank Support</H3>
      <p>
        For billing and refund requests you can also contact ClickBank directly at{" "}
        <a href="https://www.clickbank.com" target="_blank" rel="noopener noreferrer">
          clickbank.com
        </a>
        .
      </p>

      <H3>Ad-Related Enquiries</H3>
      <p>
        If you reached one of our pages through a Facebook or Instagram ad and have a
        question about the ad itself, please email{" "}
        <a href="mailto:support@onlineonsale.com">support@onlineonsale.com</a> with the
        subject line <em>"Ad Enquiry"</em>.
      </p>

      <p className="mt-8 text-[13px] text-[var(--text-muted)]">
        We aim to respond to all enquiries within 2 business days.
      </p>
    </LegalPage>
  );
}
