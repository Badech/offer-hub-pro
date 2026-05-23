// ────────────────────────────────────────────────────────────────────────────
// extractOfferHtml — pulls renderable pieces out of a pasted HTML document
// so we can serve it as a React tree:
//
//   - styles: contents of all <style> tags (concatenated, source order)
//   - body:   contents of <body>...</body>, with <footer>…</footer> removed
//             (we inject our own footer)
//
// If no <body> or <html> is detected (i.e. the paste is just a fragment),
// we use the whole input as the body and pull any <style> tags out of it.
// ────────────────────────────────────────────────────────────────────────────

export interface ExtractedHtml {
  styles: string;
  body: string;
}

const STYLE_TAG_RE = /<style[^>]*>([\s\S]*?)<\/style>/gi;
const BODY_RE = /<body[^>]*>([\s\S]*?)<\/body>/i;
const FOOTER_RE = /<footer[\s\S]*?<\/footer>/gi;
const SCRIPT_NO_SRC_RE = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

export function extractOfferHtml(input: string): ExtractedHtml {
  if (!input || !input.trim()) return { styles: "", body: "" };

  // 1. Pull all <style> tags out of the source (anywhere — head or body).
  const styles: string[] = [];
  let m: RegExpExecArray | null;
  // Re-create the regex each call so lastIndex is fresh.
  const styleRe = new RegExp(STYLE_TAG_RE.source, "gi");
  while ((m = styleRe.exec(input)) !== null) {
    styles.push(m[1].trim());
  }

  // 2. Extract body content, or fall back to the whole input.
  const bodyMatch = input.match(BODY_RE);
  let body = bodyMatch ? bodyMatch[1] : input;

  // 3. Strip the entire <style> blocks out of the body (we render them
  //    separately) so we don't render duplicate styles.
  body = body.replace(new RegExp(STYLE_TAG_RE.source, "gi"), "");

  // 4. Strip the pasted footer. We inject our own at render time.
  body = body.replace(FOOTER_RE, "");

  // 5. Strip <script> tags that are inline (no `src`) — they include
  //    things like modal-open/close handlers and countdown timers that
  //    React's dangerouslySetInnerHTML WILL NOT execute. Leaving them
  //    in the DOM as inert <script> tags is fine, but pulling them out
  //    keeps the output cleaner. External <script src> tags are left
  //    untouched because the browser will still load them.
  //
  //    NOTE: this means inline JS in pasted HTML won't run. If any of
  //    your pasted pages need JS (modals, countdowns), that's a known
  //    limitation — convert them to <script src=...> or live with the
  //    static render. See README for details.
  body = body.replace(SCRIPT_NO_SRC_RE, (whole) => {
    // Preserve as an HTML comment so the editor can still see what was
    // there if they view source.
    return `<!-- inline <script> stripped on render: ${whole.length} chars -->`;
  });

  return {
    styles: styles.join("\n\n"),
    body: body.trim(),
  };
}
