import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { OfferForm } from "@/components/admin/OfferForm";
import { parseOfferBrief } from "@/lib/offer-brief-parser";
import { mergeOfferBrief } from "@/lib/offer-merge";
import type { Offer } from "@/lib/offer-schema";
import { fetchOfferBySlug } from "@/lib/server-functions";

export const Route = createFileRoute("/admin/offers/$slug/edit")({
  staleTime: 0,
  shouldReload: true,
  loader: async ({ params }) => {
    const offer = await fetchOfferBySlug({ data: params.slug });
    if (!offer) throw notFound();
    return { offer };
  },
  notFoundComponent: () => (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <h1>Offer not found</h1>
      <a href="/admin" className="btn-primary mt-6 inline-flex">
        Back to admin
      </a>
    </div>
  ),
  component: EditOfferPage,
});

const HINT = `Paste a markdown brief. Only fields the brief actually contains will overwrite the current offer — everything else (images, pricing, etc.) stays as-is. Useful for refreshing copy without re-uploading images.`;

function EditOfferPage() {
  const { offer: dbOffer } = Route.useLoaderData();
  // step: which screen are we on
  const [step, setStep] = useState<"choose" | "paste" | "form">("choose");
  // The offer the form is bound to — starts as DB value, swapped to the merged
  // version after the user pastes a brief.
  const [currentOffer, setCurrentOffer] = useState<Offer>(dbOffer);
  const [brief, setBrief] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  // ── FORM step ───────────────────────────────────────────────────────────
  if (step === "form") {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-[32px]">Edit Offer</h1>
          <span className="text-[13px] text-[var(--text-muted)] font-mono">
            {currentOffer.slug}
          </span>
        </div>
        <p className="mt-2 text-[var(--text-secondary)]">
          Changes save to the database immediately on submit.
        </p>
        <OfferForm mode="edit" initialOffer={currentOffer} />
      </div>
    );
  }

  // ── PASTE step ──────────────────────────────────────────────────────────
  if (step === "paste") {
    const onParseAndMerge = () => {
      setParseError(null);
      try {
        const parsed = parseOfferBrief(brief);
        const merged = mergeOfferBrief(dbOffer, parsed);
        setCurrentOffer(merged);
        setStep("form");
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Couldn't parse the brief.");
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px]">Paste an updated brief</h1>
            <p className="mt-2 text-[var(--text-secondary)] max-w-2xl">{HINT}</p>
          </div>
          <button
            type="button"
            onClick={() => setStep("choose")}
            className="text-[13px] text-[var(--text-secondary)] hover:underline shrink-0 mt-2"
          >
            ← Back
          </button>
        </div>

        <div className="mt-8 card p-0 overflow-hidden">
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            spellCheck={false}
            placeholder={`# BASICS\n\n## Title\n${dbOffer.title}\n\n## Tagline\nNew tagline copy here\n\n...`}
            className="w-full min-h-[480px] p-5 font-mono text-[13px] leading-relaxed bg-white border-0 focus:outline-none resize-y"
          />
        </div>

        {parseError && (
          <div
            className="mt-4 rounded-md border border-[#fca5a5] bg-[#fef2f2] text-[#7f1d1d] text-[13px] p-3"
            role="alert"
          >
            {parseError}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onParseAndMerge}
            disabled={!brief.trim()}
            className="btn-primary disabled:opacity-50"
          >
            Merge into form →
          </button>
          <button
            type="button"
            onClick={() => setStep("form")}
            className="btn-ghost"
          >
            Skip — edit manually
          </button>
          <span className="text-[12px] text-[var(--text-muted)] ml-auto">
            Images and unchanged fields are preserved.
          </span>
        </div>
      </div>
    );
  }

  // ── CHOOSE step ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-[32px]">Edit Offer</h1>
        <span className="text-[13px] text-[var(--text-muted)] font-mono">{dbOffer.slug}</span>
      </div>
      <p className="mt-2 text-[var(--text-secondary)]">
        How would you like to edit this offer?
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setStep("paste")}
          className="card p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
        >
          <div className="text-[var(--accent)] font-semibold">Paste a brief</div>
          <h3 className="mt-2 text-[var(--brand)]">Markdown → smart merge</h3>
          <p className="mt-3 text-[14px] text-[var(--text-secondary)] leading-relaxed">
            Paste an updated markdown brief. Only the fields you include will overwrite the
            current offer. Images, pricing, slug, and anything else not in the brief stays
            exactly as it is. Best for refreshing copy or replacing all testimonials at once.
          </p>
          <div className="mt-5 text-[var(--accent)] text-[14px] font-medium">
            Paste brief →
          </div>
        </button>
        <button
          type="button"
          onClick={() => setStep("form")}
          className="card p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
        >
          <div className="text-[var(--text-secondary)] font-semibold">Edit manually</div>
          <h3 className="mt-2 text-[var(--brand)]">Open the full form</h3>
          <p className="mt-3 text-[14px] text-[var(--text-secondary)] leading-relaxed">
            Skip the paste step and edit the form directly. Best for small tweaks — change
            a single price, add one testimonial, upload a new hero image, etc.
          </p>
          <div className="mt-5 text-[var(--text-secondary)] text-[14px] font-medium">
            Open form →
          </div>
        </button>
      </div>
    </div>
  );
}
