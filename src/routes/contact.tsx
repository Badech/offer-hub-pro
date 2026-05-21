import { createFileRoute } from "@tanstack/react-router";
import { GlobalLayout } from "@/components/GlobalLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — OfferSendly" }] }),
  component: () => (
    <GlobalLayout>
      <article className="max-w-2xl mx-auto px-6 py-20">
        <h1>Contact</h1>
        <p className="mt-6 text-[18px] text-[var(--text-secondary)]">
          We read everything. Most messages get a reply within two business days.
        </p>
        <div className="mt-10 card p-6 space-y-4">
          <Row label="Editorial" value="editorial@offersendly.com" />
          <Row label="Partnerships" value="partners@offersendly.com" />
          <Row label="Privacy" value="privacy@offersendly.com" />
        </div>
      </article>
    </GlobalLayout>
  ),
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[var(--border)] last:border-0 pb-3 last:pb-0">
      <span className="text-[var(--text-muted)] text-[14px]">{label}</span>
      <a href={`mailto:${value}`} className="text-[var(--accent)] font-medium">
        {value}
      </a>
    </div>
  );
}
