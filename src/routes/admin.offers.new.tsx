import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { OfferForm, emptyOffer } from "@/components/admin/OfferForm";
import { parseOfferBrief } from "@/lib/offer-brief-parser";
import type { Offer } from "@/lib/offer-schema";

export const Route = createFileRoute("/admin/offers/new")({
  component: NewOfferPage,
});

// Helper text shown above the paste textarea — a one-line tour of what the
// parser supports so the user knows the format.
const BRIEF_HINT = `Paste a markdown brief structured like the example below. Section headings (## Title, ## Price From, ## Ingredient 1, etc.) are matched case-insensitively. Placeholders like "(Insert your hoplink)" or "(Upload product image)" are ignored. Anything missing is left blank for you to fill in.`;

const EXAMPLE_BRIEF = `# Basics

## Title
Java Burn

## Slug
java-burn

## Tagline
The Coffee Ritual People Are Using To Support Fat Burning Naturally

## Category
Health & Wellness

## Tags
Weight Loss, Fat Burner, Coffee Additive

## Vendor
ClickBank

## Affiliate URL
https://your-hop-link.hop.clickbank.net

## Published Date
2026-05-21

## Featured
Enabled`;

function NewOfferPage() {
  const [step, setStep] = useState<"choose" | "paste" | "form">("choose");
  const [initial, setInitial] = useState<Offer>(emptyOffer());
  const [brief, setBrief] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  if (step === "form") {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-[32px]">New Offer</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Review what was parsed, upload images, and click Create when ready.
        </p>
        <OfferForm mode="create" initialOffer={initial} />
      </div>
    );
  }

  if (step === "paste") {
    const onParse = () => {
      setParseError(null);
      try {
        const parsed = parseOfferBrief(brief);
        if (!parsed.title.trim()) {
          throw new Error(
            "Couldn't find a Title in the brief. Make sure there's a `## Title` heading with the product name underneath.",
          );
        }
        setInitial(parsed);
        setStep("form");
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Couldn't parse the brief.");
      }
    };

    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px]">Paste your offer brief</h1>
            <p className="mt-2 text-[var(--text-secondary)] max-w-2xl">{BRIEF_HINT}</p>
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
            placeholder={EXAMPLE_BRIEF}
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
            onClick={onParse}
            disabled={!brief.trim()}
            className="btn-primary disabled:opacity-50"
          >
            Parse and open form →
          </button>
          <button
            type="button"
            onClick={() => {
              setInitial(emptyOffer());
              setStep("form");
            }}
            className="btn-ghost"
          >
            Skip — start blank
          </button>
          <span className="text-[12px] text-[var(--text-muted)] ml-auto">
            Images are added in the next step.
          </span>
        </div>
      </div>
    );
  }

  // step === "choose"
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-[32px]">New Offer</h1>
      <p className="mt-2 text-[var(--text-secondary)]">How would you like to start?</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setStep("paste")}
          className="card p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
        >
          <div className="text-[var(--accent)] font-semibold">Paste a brief</div>
          <h3 className="mt-2 text-[var(--brand)]">Markdown → pre-filled form</h3>
          <p className="mt-3 text-[14px] text-[var(--text-secondary)] leading-relaxed">
            Paste a structured markdown brief (the format below). Everything I can extract
            — title, hero copy, ingredients, testimonials, FAQ, pricing, SEO — populates
            the form automatically. You can edit anything after.
          </p>
          <div className="mt-5 text-[var(--accent)] text-[14px] font-medium">
            Paste brief →
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            setInitial(emptyOffer());
            setStep("form");
          }}
          className="card p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)]"
        >
          <div className="text-[var(--text-secondary)] font-semibold">Start blank</div>
          <h3 className="mt-2 text-[var(--brand)]">Empty form, fill manually</h3>
          <p className="mt-3 text-[14px] text-[var(--text-secondary)] leading-relaxed">
            Skip the paste step and go straight to a blank offer form. Best for quick
            tests or if you don't have a brief written yet.
          </p>
          <div className="mt-5 text-[var(--text-secondary)] text-[14px] font-medium">
            Open blank form →
          </div>
        </button>
      </div>
    </div>
  );
}
