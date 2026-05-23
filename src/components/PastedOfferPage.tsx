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
        specificity tie. Pasted briefs sometimes set:
          html, body { height: 100%; overflow: hidden; }
        which clips everything below the first viewport — including our
        appended footer. Resetting these two properties guarantees the
        footer is always visible without disturbing the pasted CSS
        otherwise (it still owns colours, fonts, layout, etc.).
      */}
      <style>{`
        html, body {
          height: auto !important;
          overflow: visible !important;
        }
      `}</style>
      <div
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
