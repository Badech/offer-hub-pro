import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { OfferSchema } from "@/lib/offer-schema";
import { createOffer, uploadImage } from "@/lib/server-functions";

export const Route = createFileRoute("/admin/offers/new")({
  component: NewOfferPage,
});

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function NewOfferPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const parsed = OfferSchema.parse({
        slug: slug.trim() || slugify(title),
        title: title.trim(),
        affiliateUrl: affiliateUrl.trim(),
        imageUrl: imageUrl.trim(),
        html,
      });
      await createOffer({ data: parsed });
      await router.invalidate();
      router.navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create offer");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-[32px]">New Offer</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Paste the full HTML for your offer page below. We render it verbatim at{" "}
        <code>/offers/&lt;slug&gt;</code> and add our standard footer (Privacy / Terms /
        Disclaimer / Contact + affiliate disclosure) at the bottom.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <fieldset className="card p-6 space-y-5">
          <legend className="text-[18px] font-semibold text-[var(--brand)] px-2">Basics</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title (required)">
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputCls}
                placeholder="e.g. WaterSmartBox — NASA Leak"
              />
            </Field>
            <Field label="Slug (auto from title if empty)">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={inputCls}
                placeholder="watersmart-box-leak"
              />
            </Field>
          </div>
          <Field label="Affiliate URL — overwrites EVERY link in the pasted HTML">
            <input
              type="url"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              className={inputCls}
              placeholder="https://your-hop-link.hop.clickbank.net"
            />
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">
              Every <code>&lt;a href&gt;</code> in your pasted HTML will be rewritten
              to this URL. <code>mailto:</code> links become{" "}
              <code>support@offersendly.com</code>. Links to <code>offersendly.com</code>{" "}
              and pure anchor links (<code>#faq</code>) are preserved.
            </p>
          </Field>

          <Field label="Image (optional — replaces {{image}} placeholder in HTML)">
            <ImageUploader value={imageUrl} onChange={setImageUrl} />
            <p className="mt-1 text-[12px] text-[var(--text-muted)]">
              Add <code>&#123;&#123;image&#125;&#125;</code> anywhere in your pasted
              HTML and we'll swap it for this image, wrapped in a clickable link to
              your affiliate URL.
            </p>
          </Field>
        </fieldset>

        <fieldset className="card p-6 space-y-3">
          <legend className="text-[18px] font-semibold text-[var(--brand)] px-2">HTML</legend>
          <p className="text-[13px] text-[var(--text-secondary)]">
            Paste the full HTML document (with <code>&lt;head&gt;</code>, <code>&lt;style&gt;</code>,
            and <code>&lt;body&gt;</code>). We auto-extract the style and body content, strip
            any <code>&lt;footer&gt;</code> in your HTML, and append our standard footer.
          </p>
          <p className="text-[12px] text-[var(--text-muted)]">
            Note: inline <code>&lt;script&gt;</code> tags in pasted HTML do not execute (browser
            security). External <code>&lt;script src=…&gt;</code> tags do load. Use CSS animations
            for any motion.
          </p>
          <textarea
            required
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            spellCheck={false}
            placeholder="<!DOCTYPE html>&#10;<html lang=&quot;en&quot;>&#10;<head>&#10;  <style>...</style>&#10;</head>&#10;<body>&#10;  ...your offer page...&#10;</body>&#10;</html>"
            className="w-full min-h-[480px] p-4 font-mono text-[12px] leading-relaxed border border-[var(--border)] rounded-md bg-white focus:outline-none focus:border-[var(--accent)] resize-y"
          />
        </fieldset>

        {error && (
          <div
            className="rounded-md border border-[#fca5a5] bg-[#fef2f2] text-[#7f1d1d] text-[13px] p-3"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 sticky bottom-0 bg-[var(--background)] border-t border-[var(--border)] py-4 -mx-6 px-6">
          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
            {busy ? "Creating…" : "Create offer"}
          </button>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/admin" })}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "mt-1 w-full border border-[var(--border)] rounded-md px-3 py-2 text-[14px] bg-white focus:outline-none focus:border-[var(--accent)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-[var(--brand)]">{label}</label>
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Minimal inline image uploader — calls the uploadImage server fn against
// Vercel Blob, then writes the public URL back to the form state.
// ────────────────────────────────────────────────────────────────────────────

function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onFile = async (file: File) => {
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const { url } = await uploadImage({ data: fd });
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="mt-2 flex flex-wrap items-start gap-3">
      {value ? (
        <img
          src={value}
          alt=""
          className="h-20 w-20 rounded-md border border-[var(--border)] object-cover"
        />
      ) : (
        <div className="h-20 w-20 rounded-md border border-dashed border-[var(--border)] grid place-items-center text-[12px] text-[var(--text-muted)]">
          No image
        </div>
      )}
      <div className="flex-1 min-w-0">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL, or upload below"
          className="w-full border border-[var(--border)] rounded-md px-3 py-2 text-[13px] focus:outline-none focus:border-[var(--accent)]"
        />
        <div className="mt-2 flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
            className="text-[12px]"
          />
          {uploading && (
            <span className="text-[12px] text-[var(--text-secondary)]">Uploading…</span>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[12px] text-[#b91c1c] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        {err && (
          <div className="mt-2 text-[12px] text-[#b91c1c]" role="alert">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}
