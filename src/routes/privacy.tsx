import { createFileRoute } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — OfferSendly" }] }),
  component: () => (
    <GlobalLayout>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <h1>Privacy Policy</h1>
        <p className="mt-6 text-[var(--text-secondary)]">Last updated: May 21, 2026</p>
        <h2 className="mt-12">Information we collect</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          OfferSendly collects standard analytics data — pages visited, referring sources, and
          anonymized device information — to improve the site. We do not sell or share personal
          information with third parties.
        </p>
        <h2 className="mt-10">Cookies</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          We use cookies for analytics and to attribute affiliate referrals. You can disable
          cookies in your browser at any time.
        </p>
        <h2 className="mt-10">Third parties</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          When you click an affiliate link, you leave OfferSendly and enter the vendor's site —
          whose privacy policy will apply to your interaction with them.
        </p>
        <h2 className="mt-10">Contact</h2>
        <p className="mt-4 text-[var(--text-secondary)]">
          Privacy questions? Email us at privacy@offersendly.com.
        </p>
      </article>
    </GlobalLayout>
  ),
});
