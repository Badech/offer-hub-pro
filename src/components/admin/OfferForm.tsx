import { useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { HtmlPreview } from "@/components/admin/HtmlPreview";
import { type Offer, OfferSchema } from "@/lib/offer-schema";
import { createOffer, updateOffer, uploadImage } from "@/lib/server-functions";

// ────────────────────────────────────────────────────────────────────────────
// Shared paste-HTML offer form — used for both /admin/offers/new and
// /admin/offers/<slug>/edit.
//
// Layout: sticky header (title + Cancel + Save), then two-column body with
// the form on the left and a live HtmlPreview iframe on the right. On
// narrow viewports the preview drops below the form.
//
// In edit mode the slug input is locked (it's the primary key) and the
// submit button reads "Save changes". On submit we route back to /admin
// and invalidate the loader caches.
// ────────────────────────────────────────────────────────────────────────────

export function emptyOffer(): Offer {
  return { slug: "", title: "", affiliateUrl: "", imageUrl: "", html: "" };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function OfferForm({
  mode,
  initialOffer,
}: {
  mode: "create" | "edit";
  initialOffer: Offer;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialOffer.title);
  const [slug, setSlug] = useState(initialOffer.slug);
  const [affiliateUrl, setAffiliateUrl] = useState(initialOffer.affiliateUrl ?? "");
  const [imageUrl, setImageUrl] = useState(initialOffer.imageUrl ?? "");
  const [html, setHtml] = useState(initialOffer.html);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const parsed = OfferSchema.parse({
        slug: mode === "edit" ? initialOffer.slug : slug.trim() || slugify(title),
        title: title.trim(),
        affiliateUrl: affiliateUrl.trim(),
        imageUrl: imageUrl.trim(),
        html,
      });
      if (mode === "edit") {
        await updateOffer({ data: parsed });
      } else {
        await createOffer({ data: parsed });
      }
      await router.invalidate();
      router.navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save offer");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-[24px]">
            {mode === "edit" ? "Edit Offer" : "New Offer"}
            {mode === "edit" && (
              <span className="ml-3 text-[13px] font-mono text-[var(--text-muted)]">
                {initialOffer.slug}
              </span>
            )}
          </h1>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            Edit on the left — see how it'll look on the right.{" "}
            {mode === "edit" ? "Save when you're done." : "Submit when you're happy."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <div
              className="rounded-md border border-[#fca5a5] bg-[#fef2f2] text-[#7f1d1d] text-[12px] px-3 py-1.5"
              role="alert"
            >
              {error}
            </div>
          )}
          {mode === "edit" && (
            <a
              href={`/offers/${initialOffer.slug}`}
              target="_blank"
              rel="noopener"
              className="text-[13px] text-[var(--accent)] hover:underline"
            >
              View live ↗
            </a>
          )}
          <button
            type="button"
            onClick={() => router.navigate({ to: "/admin" })}
            className="text-[13px] text-[var(--text-secondary)] hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="offer-form"
            disabled={busy || !title.trim() || !html.trim()}
            className="btn-primary disabled:opacity-50"
          >
            {busy
              ? mode === "edit"
                ? "Saving…"
                : "Creating…"
              : mode === "edit"
                ? "Save changes"
                : "Create offer"}
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-h-0">
        <form
          id="offer-form"
          onSubmit={onSubmit}
          className="overflow-y-auto p-6 space-y-6 border-r border-[var(--border)]"
        >
          <fieldset className="card p-5 space-y-4">
            <legend className="text-[15px] font-semibold text-[var(--brand)] px-2">Basics</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Title (required)">
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                  placeholder="WaterSmartBox — NASA Leak"
                />
              </Field>
              <Field
                label={
                  mode === "edit"
                    ? "Slug (locked — primary key)"
                    : "Slug (auto from title)"
                }
              >
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={inputCls + (mode === "edit" ? " bg-[var(--surface)]" : "")}
                  placeholder="watersmart-box-leak"
                  readOnly={mode === "edit"}
                />
              </Field>
            </div>
            <Field label="Affiliate URL — overwrites every <a href> in HTML">
              <input
                type="url"
                value={affiliateUrl}
                onChange={(e) => setAffiliateUrl(e.target.value)}
                className={inputCls}
                placeholder="https://your-hop-link.hop.clickbank.net"
              />
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                <code>mailto:</code> → <code>support@offersendly.com</code>. Anchors
                (<code>#faq</code>) and links to <code>offersendly.com</code> preserved.
              </p>
            </Field>
            <Field label="Image (replaces {{image}} placeholder in HTML)">
              <ImageUploader value={imageUrl} onChange={setImageUrl} />
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                Write <code>&#123;&#123;image&#125;&#125;</code> in your HTML to insert
                this image at its natural dimensions (clickable → affiliate URL).
              </p>
            </Field>
          </fieldset>

          <fieldset className="card p-5 space-y-3">
            <legend className="text-[15px] font-semibold text-[var(--brand)] px-2">HTML</legend>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Paste the full HTML. Style + body are extracted; pasted{" "}
              <code>&lt;footer&gt;</code> is replaced with ours; all{" "}
              <code>&lt;a&gt;</code> links go to your affiliate URL.
            </p>
            <textarea
              required
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              spellCheck={false}
              placeholder={`<!DOCTYPE html>\n<html lang="en">\n<head>\n  <style>...</style>\n</head>\n<body>\n  <a href="https://example.com">CTA → goes to your affiliate URL</a>\n  {{image}}    ← swapped for your uploaded image\n</body>\n</html>`}
              className="w-full min-h-[600px] p-4 font-mono text-[12px] leading-relaxed border border-[var(--border)] rounded-md bg-white focus:outline-none focus:border-[var(--accent)] resize-y"
            />
          </fieldset>
        </form>

        <div className="hidden lg:flex flex-col min-h-0">
          <HtmlPreview html={html} affiliateUrl={affiliateUrl} imageUrl={imageUrl} />
        </div>
      </div>

      <div className="lg:hidden border-t border-[var(--border)] h-[60vh] flex flex-col">
        <HtmlPreview html={html} affiliateUrl={affiliateUrl} imageUrl={imageUrl} />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Form primitives
// ────────────────────────────────────────────────────────────────────────────

const inputCls =
  "mt-1 w-full border border-[var(--border)] rounded-md px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[var(--accent)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[var(--brand)]">{label}</label>
      {children}
    </div>
  );
}

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
          className="h-16 w-16 rounded-md border border-[var(--border)] object-cover"
        />
      ) : (
        <div className="h-16 w-16 rounded-md border border-dashed border-[var(--border)] grid place-items-center text-[11px] text-[var(--text-muted)]">
          No image
        </div>
      )}
      <div className="flex-1 min-w-0">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL, or upload below"
          className="w-full border border-[var(--border)] rounded-md px-3 py-1.5 text-[12px] focus:outline-none focus:border-[var(--accent)]"
        />
        <div className="mt-1.5 flex items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
            className="text-[11px]"
          />
          {uploading && (
            <span className="text-[11px] text-[var(--text-secondary)]">Uploading…</span>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[11px] text-[#b91c1c] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        {err && (
          <div className="mt-1 text-[11px] text-[#b91c1c]" role="alert">
            {err}
          </div>
        )}
      </div>
    </div>
  );
}
