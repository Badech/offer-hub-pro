import type { Offer } from "@/lib/offer-schema";

// ────────────────────────────────────────────────────────────────────────────
// PresellPage — dark-advertorial single-screen layout used by /presell/$slug.
//
// All copy is data-driven from offer.presell. The body-copy and alert-text
// support a tiny inline-markdown subset so the editor doesn't have to write
// raw HTML:
//
//   *italic-red text*       — eyes-only / urgency italic in red
//   **bold text**           — bold inline emphasis
//   [label text](inline-cta) — clickable inline link to the affiliate URL
//                              (the second placeholder is literal — we
//                              substitute offer.affiliateUrl at render time)
// ────────────────────────────────────────────────────────────────────────────

export function PresellPage({ offer }: { offer: Offer }) {
  const p = offer.presell!;
  return (
    <div className="psl-root">
      <style>{`
        .psl-root, .psl-root * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --psl-red:       #d9232d;
          --psl-teal:      #0e9e8e;
          --psl-teal-dark: #0b8578;
          --psl-text:      #1a1a1a;
          --psl-border:    #e0e0e0;
          --psl-bg:        #ffffff;
        }
        html, body { height: 100%; overflow: hidden; background: #fff; color: var(--psl-text); font-family: 'Source Sans 3', 'DM Sans', sans-serif; }
        .psl-page {
          display: flex; flex-direction: column;
          height: 100vh;
          max-width: 480px; margin: 0 auto;
          padding: 0 18px;
        }
        .psl-topbar {
          flex-shrink: 0;
          background: #1a1a1a; color: #fff;
          text-align: center; font-size: 11px;
          letter-spacing: .07em; padding: 7px 12px;
          font-weight: 700; text-transform: uppercase;
          margin: 0 -18px;
        }
        .psl-topbar span { color: #f0c040; }
        .psl-headline-block { flex-shrink: 0; text-align: center; padding: 14px 0 10px; }
        .psl-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: .14em; text-transform: uppercase;
          color: #888; margin-bottom: 6px;
        }
        .psl-headline {
          font-family: 'Merriweather', 'Fraunces', Georgia, serif;
          font-size: clamp(19px, 5vw, 27px); font-weight: 900;
          line-height: 1.25;
        }
        .psl-headline .hl-red { color: var(--psl-red); }
        .psl-headline .hl-tag { color: var(--psl-red); font-size: .85em; letter-spacing: .04em; }
        .psl-hero {
          flex-shrink: 0; width: 100%;
          height: clamp(90px, 20vh, 160px);
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          border-radius: 6px; margin: 10px 0;
          display: flex; align-items: center; justify-content: center;
          gap: 12px;
          color: #a8d8ea;
          font-size: 13px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          position: relative; overflow: hidden;
        }
        .psl-hero img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
        .psl-hero-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; }
        .psl-hero::before {
          content: '★ ✦ ★ ✦ ★ ✦ ★';
          position: absolute; top: 8px; left: 0; right: 0;
          text-align: center; font-size: 10px;
          color: rgba(255,255,255,.18);
          letter-spacing: 10px;
        }
        .psl-hero-icon { font-size: 32px; filter: drop-shadow(0 0 8px rgba(168,216,234,.6)); }
        .psl-body-copy {
          flex-shrink: 0; text-align: center;
          font-size: clamp(13px, 2.8vw, 15px);
          line-height: 1.65; color: #2a2a2a;
          margin-bottom: 10px;
        }
        .psl-body-copy .eyes { font-style: italic; font-weight: 600; color: var(--psl-red); }
        .psl-body-copy .inline-link {
          color: var(--psl-teal);
          font-weight: 700;
          text-decoration: none;
          border-bottom: 1px dashed var(--psl-teal);
        }
        .psl-alert-box {
          flex-shrink: 0;
          border: 1.5px solid #e8c84a;
          background: #fffdf0; border-radius: 7px;
          padding: 9px 14px;
          font-size: clamp(12px, 2.5vw, 13.5px);
          line-height: 1.55; color: #2a2a2a;
          margin-bottom: 10px;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .psl-alert-box .alert-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .psl-alert-box a { color: var(--psl-teal); font-weight: 700; text-decoration: none; }
        .psl-cta-wrap { flex-shrink: 0; text-align: center; margin-bottom: 8px; }
        .psl-cta-btn {
          display: inline-block;
          background: var(--psl-teal); color: #fff;
          font-size: clamp(14px, 3.2vw, 16px);
          font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase; text-decoration: none;
          padding: 14px 36px; border-radius: 4px;
          box-shadow: 0 4px 16px rgba(14,158,142,.35);
          transition: background .2s, transform .15s;
          animation: psl-pulse 2.2s ease-in-out 1s infinite;
        }
        .psl-cta-btn:hover { background: var(--psl-teal-dark); transform: translateY(-2px); animation: none; }
        .psl-cta-sub { font-size: 11px; color: #999; margin-top: 5px; }
        .psl-important-line {
          flex-shrink: 0;
          border-left: 4px solid var(--psl-red);
          background: #fff8f0; border-radius: 4px;
          padding: 9px 12px;
          font-size: clamp(12px, 2.5vw, 13px);
          line-height: 1.55; color: #2a2a2a;
          margin-bottom: 8px;
        }
        .psl-important-line .imp { color: var(--psl-red); font-weight: 700; }
        .psl-footer {
          flex-shrink: 0; text-align: center;
          font-size: 10px; color: #bbb;
          padding: 5px 0 6px; border-top: 1px solid #eee;
          margin-top: auto;
        }
        .psl-footer p { margin-bottom: 4px; }
        .psl-legal-links { display: flex; justify-content: center; flex-wrap: wrap; gap: 4px 10px; }
        .psl-legal-links a {
          color: #999; text-decoration: none;
          font-size: 10px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
        }
        .psl-legal-links a:hover { color: var(--psl-teal); border-color: var(--psl-teal); }
        @keyframes psl-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .psl-topbar         { animation: psl-fade-up .5s ease both; }
        .psl-headline-block { animation: psl-fade-up .5s .1s ease both; }
        .psl-hero           { animation: psl-fade-up .5s .2s ease both; }
        .psl-body-copy      { animation: psl-fade-up .5s .28s ease both; }
        .psl-alert-box      { animation: psl-fade-up .5s .36s ease both; }
        .psl-cta-wrap       { animation: psl-fade-up .5s .44s ease both; }
        .psl-important-line { animation: psl-fade-up .5s .52s ease both; }
        @keyframes psl-pulse {
          0%,100% { box-shadow: 0 4px 16px rgba(14,158,142,.35); }
          50%     { box-shadow: 0 6px 26px rgba(14,158,142,.6); }
        }
      `}</style>

      <div className="psl-page">
        <div className="psl-topbar">
          {p.topBarPrefix} <span>{p.topBarSpan}</span> {p.topBarText}
        </div>

        <div className="psl-headline-block">
          <p className="psl-label">{p.eyebrowLabel}</p>
          <h1 className="psl-headline">
            {p.headlineLead && <span className="hl-tag">{p.headlineLead}</span>}
            {p.headlineLead && p.headlineMain && " "}
            {p.headlineMain}
            {p.headlineTail && (
              <>
                <br />
                <span className="hl-red">{p.headlineTail}</span>
              </>
            )}
          </h1>
        </div>

        <div className="psl-hero">
          {p.heroImage ? (
            <img src={p.heroImage} alt="" loading="eager" />
          ) : (
            <div className="psl-hero-content">
              <span className="psl-hero-icon">{p.heroIcon}</span>
              <span>{p.heroCaption}</span>
            </div>
          )}
        </div>

        <p className="psl-body-copy">{renderInline(p.bodyCopy, offer.affiliateUrl)}</p>

        {p.alertText && (
          <div className="psl-alert-box">
            <span className="alert-icon">⚠️</span>
            <span>
              {p.alertText}{" "}
              <a href={offer.affiliateUrl} target="_blank" rel="noopener sponsored">
                {p.alertLinkLabel}
              </a>
            </span>
          </div>
        )}

        <div className="psl-cta-wrap">
          <a
            className="psl-cta-btn"
            href={offer.affiliateUrl}
            target="_blank"
            rel="noopener sponsored"
          >
            {p.ctaLabel}
          </a>
          <p className="psl-cta-sub">{p.ctaSub}</p>
        </div>

        {p.importantText && (
          <div className="psl-important-line">
            <span className="imp">{p.importantLabel}</span> {p.importantText}
          </div>
        )}

        <footer className="psl-footer">
          <p>This page contains affiliate links. We may earn a commission at no extra cost to you.</p>
          <div className="psl-legal-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
            <a href="/disclaimer">Disclaimer</a>
            <a href="/contact">Contact Us</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Inline-markdown renderer for body copy: handles *italic-red*, **bold**,
// [text](inline-cta) — where inline-cta is the literal placeholder we
// substitute for offer.affiliateUrl. Returns a React-friendly array of
// strings and elements.
// ────────────────────────────────────────────────────────────────────────────

function renderInline(src: string, affiliateUrl: string): React.ReactNode[] {
  // Split on lines first so explicit \n become <br/>
  const lines = src.split("\n");
  const nodes: React.ReactNode[] = [];
  lines.forEach((line, lineIdx) => {
    if (lineIdx > 0) nodes.push(<br key={`br-${lineIdx}`} />);
    nodes.push(...renderInlineSegment(line, affiliateUrl, `l${lineIdx}`));
  });
  return nodes;
}

function renderInlineSegment(
  src: string,
  affiliateUrl: string,
  keyPrefix: string,
): React.ReactNode[] {
  // Process in this order so nested matches don't collide:
  //   [text](inline-cta)  → <a>
  //   **text**            → <strong>
  //   *text*              → <span class="eyes">  (italic red)
  // We do it with a single combined regex + replace-into-tokens loop.
  const re = /\[([^\]]+)\]\(inline-cta\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push(src.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <a
          key={`${keyPrefix}-${i}`}
          className="inline-link"
          href={affiliateUrl}
          target="_blank"
          rel="noopener sponsored"
        >
          {m[1]}
        </a>,
      );
    } else if (m[2] !== undefined) {
      out.push(<strong key={`${keyPrefix}-${i}`}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      out.push(
        <span key={`${keyPrefix}-${i}`} className="eyes">
          {m[3]}
        </span>,
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}
