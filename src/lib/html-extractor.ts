// ────────────────────────────────────────────────────────────────────────────
// extractOfferHtml — pulls renderable pieces out of a pasted HTML document
// and applies the per-offer transformations:
//
//   1. Pull all <style> tags out for separate <style> rendering.
//   2. Extract <body>...</body> contents (or fall back to the whole input).
//   3. Strip <footer> blocks (we inject our own legal footer).
//   4. Strip inline <script> tags (dangerouslySetInnerHTML doesn't execute
//      them, see PastedOfferPage.tsx for caveat docs).
//   5. Rewrite ALL <a href> links:
//       - Same-domain (onlineonsale.com) and root-relative links → keep as-is
//       - Pure anchor links (#foo) → keep as-is
//       - mailto:* → mailto:support@onlineonsale.com
//       - tel:* → keep as-is (less impactful)
//       - Everything else (external https, hoplinks, etc.) → replace with
//         the offer's affiliateUrl. If no affiliateUrl set, leave alone.
//   6. Replace {{image}} placeholders with a clickable <img> wrapped in an
//      <a> pointing to affiliateUrl. If no imageUrl, the placeholder is
//      removed silently.
// ────────────────────────────────────────────────────────────────────────────

export interface ExtractedHtml {
  styles: string;
  body: string;
}

export interface ExtractOptions {
  affiliateUrl?: string;
  imageUrl?: string;
}

const STYLE_TAG_RE = /<style[^>]*>([\s\S]*?)<\/style>/gi;
const BODY_RE = /<body[^>]*>([\s\S]*?)<\/body>/i;
const FOOTER_RE = /<footer[\s\S]*?<\/footer>/gi;
const SCRIPT_NO_SRC_RE = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const IMAGE_PLACEHOLDER_RE = /\{\{\s*image\s*\}\}/gi;

/**
 * Domain we consider "our own" — links pointing here are preserved instead of
 * being rewritten to the affiliate URL.
 */
const OWN_DOMAIN = "onlineonsale.com";
const CONTACT_EMAIL = "support@onlineonsale.com";

export function extractOfferHtml(input: string, opts: ExtractOptions = {}): ExtractedHtml {
  if (!input || !input.trim()) return { styles: "", body: "" };

  // 1. Pull all <style> tags.
  const styles: string[] = [];
  let m: RegExpExecArray | null;
  const styleRe = new RegExp(STYLE_TAG_RE.source, "gi");
  while ((m = styleRe.exec(input)) !== null) styles.push(m[1].trim());

  // 2. Extract body content (or whole input).
  const bodyMatch = input.match(BODY_RE);
  let body = bodyMatch ? bodyMatch[1] : input;

  // 3-4. Strip <style>, <footer>, inline <script>.
  body = body.replace(new RegExp(STYLE_TAG_RE.source, "gi"), "");
  body = body.replace(FOOTER_RE, "");
  body = body.replace(
    SCRIPT_NO_SRC_RE,
    (whole) => `<!-- inline <script> stripped on render: ${whole.length} chars -->`,
  );

  // 5. Rewrite <a href> links.
  body = rewriteLinks(body, opts.affiliateUrl ?? "");

  // 6. Replace {{image}} placeholders.
  body = replaceImagePlaceholder(body, opts.imageUrl ?? "", opts.affiliateUrl ?? "");

  return { styles: styles.join("\n\n"), body: body.trim() };
}

// ────────────────────────────────────────────────────────────────────────────
// Link rewriter — surgically replaces the href attribute value on every <a>.
// We use a regex (not a DOM parser) because we're working with pasted text
// that may not be valid HTML; matching attribute-by-attribute is safer than
// stringifying a parsed tree.
// ────────────────────────────────────────────────────────────────────────────

const A_HREF_RE = /(<a\b[^>]*?\bhref\s*=\s*)("([^"]*)"|'([^']*)')/gi;

function rewriteLinks(body: string, affiliateUrl: string): string {
  return body.replace(A_HREF_RE, (whole, prefix, _quoted, dq, sq) => {
    const href = (dq ?? sq ?? "").trim();
    const newHref = rewriteOneLink(href, affiliateUrl);
    if (newHref === href) return whole;
    return `${prefix}"${newHref}"`;
  });
}

function rewriteOneLink(href: string, affiliateUrl: string): string {
  // Empty / fragment-only → preserve
  if (!href || href.startsWith("#")) return href;

  // Root-relative → preserve (these are our own legal pages, /privacy etc.)
  if (href.startsWith("/")) return href;

  // mailto: → swap any address for our support address
  if (/^mailto:/i.test(href)) return `mailto:${CONTACT_EMAIL}`;

  // tel: links — leave alone. Phone numbers in pasted briefs are usually
  // legitimate (e.g. support hotlines) and there's no equivalent on our side.
  if (/^tel:/i.test(href)) return href;

  // Same-domain links (onlineonsale.com) → preserve
  try {
    const u = new URL(href, "https://example.com/"); // base for protocol-relative parsing
    if (u.hostname === OWN_DOMAIN || u.hostname === `www.${OWN_DOMAIN}`) {
      return href;
    }
  } catch {
    // Malformed URL — leave alone rather than guess.
    return href;
  }

  // Everything else (external https, hop links, etc.) → affiliate URL when set
  if (affiliateUrl) return affiliateUrl;
  return href;
}

// ────────────────────────────────────────────────────────────────────────────
// Image placeholder swap. {{image}} → clickable <img> linking to affiliate.
// ────────────────────────────────────────────────────────────────────────────

function replaceImagePlaceholder(body: string, imageUrl: string, affiliateUrl: string): string {
  if (!imageUrl) return body.replace(IMAGE_PLACEHOLDER_RE, "");
  const safeImg = escapeAttr(imageUrl);
  const safeAff = escapeAttr(affiliateUrl || "#");

  // Render the image at its natural intrinsic dimensions (no max-width
  // constraint, no border-radius, no auto-scaling). The image is centered
  // horizontally via text-align on the wrapper; the image itself uses
  // `width: auto; height: auto;` so the browser falls back to the image's
  // own width/height attributes once it loads.
  //
  // On viewports narrower than the image, browsers will let it overflow
  // horizontally — which is the explicit intent ("original size ratio"
  // = original dimensions). If you ever need responsive scaling per
  // image, swap to max-width:100% on a case-by-case basis.
  const imgStyle =
    "width:auto;height:auto;display:inline-block;cursor:pointer;border:0;";
  const wrapperStyle =
    "display:block;text-align:center;margin:24px auto;line-height:0;";

  const html = affiliateUrl
    ? `<a href="${safeAff}" target="_blank" rel="noopener sponsored" style="${wrapperStyle}"><img src="${safeImg}" alt="" style="${imgStyle}"/></a>`
    : `<div style="${wrapperStyle}"><img src="${safeImg}" alt="" style="${imgStyle.replace(
        "cursor:pointer;",
        "",
      )}"/></div>`;
  return body.replace(IMAGE_PLACEHOLDER_RE, html);
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
