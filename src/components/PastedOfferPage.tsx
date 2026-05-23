import { Link } from "@tanstack/react-router";
import { extractOfferHtml } from "@/lib/html-extractor";
import type { Offer } from "@/lib/offer-schema";

// ────────────────────────────────────────────────────────────────────────────
// PastedOfferPage — renders the admin-pasted HTML for an offer.
//
// Pasted HTML pipeline:
//   1. Pull <style> tags out (rendered in our React tree via <style>)
//   2. Strip the original <body>...</body> wrapper and use its contents
//   3. Strip the pasted <footer> (we add our own with legal links)
//   4. Strip inline <script> (dangerouslySetInnerHTML doesn't execute them
//      anyway — see html-extractor.ts for rationale)
//   5. Inject our standard OfferSendly footer at the bottom
// ────────────────────────────────────────────────────────────────────────────

export function PastedOfferPage({ offer }: { offer: Offer }) {
  // Pass the offer's affiliate URL + image URL into the extractor so it can
  // rewrite all <a href>s to the affiliate URL and swap {{image}}
  // placeholders for a clickable image.
  const { styles, body } = extractOfferHtml(offer.html, {
    affiliateUrl: offer.affiliateUrl,
    imageUrl: offer.imageUrl,
  });
  return (
    <>
      {styles && <style dangerouslySetInnerHTML={{ __html: styles }} />}
      {/*
        OVERRIDE STYLE — applied AFTER the pasted <style> so it wins the
        specificity tie. Three rules:
          1. html, body { height: auto; overflow: visible }
             — pasted briefs sometimes set height:100%; overflow:hidden;
             to enforce mobile-bottle layouts. That clips our footer.
             Reset so the document scrolls normally.
          2. body { display: flex; flex-direction: column; min-height: 100vh }
             — classic sticky-footer pattern. Combined with the
             .osl-content wrapper getting flex: 1, this guarantees
             the footer sits at the bottom of the VIEWPORT on tall
             screens (when content is short), and falls in line at
             the end of the content on short screens (when content
             overflows the viewport).
          3. .osl-content { flex: 1 0 auto }
             — wrapper around the pasted body takes all remaining
             vertical space so the footer is pushed to the bottom.
      */}
      <style>{`
        html, body {
          height: auto !important;
          overflow: visible !important;
        }
        body {
          display: flex !important;
          flex-direction: column !important;
          min-height: 100vh !important;
        }
        .osl-content {
          flex: 1 0 auto;
        }
      `}</style>
      <div
        className="osl-content"
        // The pasted HTML is admin-authored content — we trust it by design,
        // since only the authenticated /admin user can paste it.
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <OfferSendlyFooter />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Site-wide standard footer — appended to every pasted-HTML offer page.
// Includes the four legal links Meta requires + the affiliate disclosure.
// ────────────────────────────────────────────────────────────────────────────

function OfferSendlyFooter() {
  return (
    <footer
      style={{
        background: "#080807",
        padding: "32px 24px",
        textAlign: "center",
        fontSize: 12,
        color: "rgba(255,255,255,0.3)",
        lineHeight: 1.7,
        fontFamily: "system-ui, sans-serif",
        marginTop: 0,
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <p>
          ©{" "}
          {new Date().getFullYear()} <strong style={{ color: "rgba(255,255,255,0.65)" }}>OfferSendly</strong>{" "}
          ·{" "}
          <Link to="/privacy" style={legalLinkStyle}>
            Privacy Policy
          </Link>{" "}
          ·{" "}
          <Link to="/terms" style={legalLinkStyle}>
            Terms
          </Link>{" "}
          ·{" "}
          <Link to="/disclaimer" style={legalLinkStyle}>
            Disclaimer
          </Link>{" "}
          ·{" "}
          <Link to="/contact" style={legalLinkStyle}>
            Contact
          </Link>
        </p>
        <p style={{ marginTop: 10, maxWidth: 720, margin: "10px auto 0" }}>
          This page contains affiliate links. OfferSendly may earn a commission on
          purchases made through links on this page, at no extra cost to you. Statements
          on this website have not been evaluated by the U.S. Food and Drug Administration.
          Products are not intended to diagnose, treat, cure, or prevent any disease.
          Individual results may vary.
        </p>
      </div>
    </footer>
  );
}

const legalLinkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.55)",
  textDecoration: "underline",
};
