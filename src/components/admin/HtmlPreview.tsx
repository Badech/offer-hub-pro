import { useEffect, useMemo, useRef, useState } from "react";
import { extractOfferHtml } from "@/lib/html-extractor";

// ────────────────────────────────────────────────────────────────────────────
// HtmlPreview — live preview of how a pasted-HTML offer will render. Uses
// the SAME extractOfferHtml pipeline as the public route, so the preview is
// byte-for-byte what visitors get (modulo the OfferSendly footer, which we
// stub here with a small placeholder note since rendering React links inside
// an iframe srcdoc is more trouble than it's worth).
//
// Rendered inside an <iframe srcdoc> for two reasons:
//   1. The pasted CSS uses generic selectors (body, *, .hero) that would
//      otherwise leak into and break the admin UI styling
//   2. Inline <script> tags actually execute inside an iframe srcdoc, which
//      means countdown timers / modals from pasted HTML work in the preview
//      (note: they still WON'T execute on the live page — known limitation
//      flagged elsewhere — but at least the preview is more honest about
//      visual intent than a script-stripped render)
// ────────────────────────────────────────────────────────────────────────────

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTH: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

interface PreviewProps {
  html: string;
  affiliateUrl: string;
  imageUrl: string;
}

export function HtmlPreview({ html, affiliateUrl, imageUrl }: PreviewProps) {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Memoise the extraction — only re-runs when the inputs change. The full
  // HTML string is rebuilt and pushed to the iframe via srcdoc.
  const srcdoc = useMemo(
    () => buildPreviewDocument(html, affiliateUrl, imageUrl),
    [html, affiliateUrl, imageUrl],
  );

  // Force-update the iframe srcdoc on every change. Some browsers don't
  // re-render an iframe when srcdoc changes via React — assigning directly
  // is the most reliable approach.
  useEffect(() => {
    if (iframeRef.current) iframeRef.current.srcdoc = srcdoc;
  }, [srcdoc]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] bg-[var(--surface)]">
        <span className="text-[12px] uppercase tracking-wider text-[var(--text-muted)] mr-2">
          Preview
        </span>
        <ViewportButton current={viewport} value="desktop" onChange={setViewport} label="Desktop" />
        <ViewportButton current={viewport} value="tablet" onChange={setViewport} label="Tablet" />
        <ViewportButton current={viewport} value="mobile" onChange={setViewport} label="Mobile" />
        <span className="ml-auto text-[11px] text-[var(--text-muted)]">
          Updates as you type
        </span>
      </div>
      <div className="flex-1 min-h-0 bg-[var(--surface)] overflow-auto flex justify-center">
        <div
          style={{
            width: VIEWPORT_WIDTH[viewport],
            maxWidth: "100%",
            transition: "width 0.2s ease",
          }}
          className="h-full bg-white shadow-sm"
        >
          {html.trim() ? (
            <iframe
              ref={iframeRef}
              title="Offer preview"
              sandbox="allow-same-origin allow-scripts allow-popups"
              style={{ width: "100%", height: "100%", border: 0, display: "block" }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-[14px] p-8 text-center">
              Paste your offer HTML on the left to see a live preview here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ViewportButton({
  current,
  value,
  onChange,
  label,
}: {
  current: Viewport;
  value: Viewport;
  onChange: (v: Viewport) => void;
  label: string;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`text-[12px] px-3 py-1 rounded border transition-colors ${
        active
          ? "bg-[var(--accent)] text-white border-[var(--accent)]"
          : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface)]"
      }`}
    >
      {label}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Build the complete HTML document we hand to the iframe. Re-uses the
// extractor so the preview matches production behaviour 1:1 — same link
// rewriting, same {{image}} swap, same <footer> stripping. We append a
// stub footer note (instead of the real React OfferSendlyFooter) because
// rendering React inside iframe srcdoc is not worth the complexity for
// a preview.
// ────────────────────────────────────────────────────────────────────────────

function buildPreviewDocument(html: string, affiliateUrl: string, imageUrl: string): string {
  if (!html.trim()) return "";
  const { styles, body } = extractOfferHtml(html, { affiliateUrl, imageUrl });
  const footerStub = `
    <footer style="background:#080807;padding:32px 24px;text-align:center;font-size:12px;color:rgba(255,255,255,0.4);line-height:1.7;font-family:system-ui,sans-serif;margin-top:0;">
      <div style="max-width:820px;margin:0 auto;">
        <p>© ${new Date().getFullYear()} <strong style="color:rgba(255,255,255,0.7);">OfferSendly</strong> · Privacy Policy · Terms · Disclaimer · Contact</p>
        <p style="margin-top:10px;max-width:720px;margin:10px auto 0;">
          This page contains affiliate links. (Legal disclosure appears here on the live page.)
        </p>
      </div>
    </footer>
  `;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<base target="_blank" />
${styles ? `<style>${styles}</style>` : ""}
</head>
<body>
${body}
${footerStub}
</body>
</html>`;
}
