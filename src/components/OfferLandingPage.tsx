import { useEffect, useState } from "react";
import type { Offer, ProblemPoint } from "@/lib/offer-schema";

// ────────────────────────────────────────────────────────────────────────────
// OfferLandingPage — dark/gold editorial landing page used by every offer.
// Rewritten to match the "Spartamax luxe" design brief: Fraunces serif
// headlines, DM Sans body, gold accents, product mockup, animated countdown,
// price-tier badges, sticky mobile CTA, urgency band, security row.
//
// Everything is data-driven from the Offer payload. Optional fields gracefully
// degrade — e.g. an offer with no ingredients will skip the ingredients block,
// an offer without price.to falls back to a single-tier display, etc.
// ────────────────────────────────────────────────────────────────────────────

const PALETTE = `
  --osl-gold: #C8962E;
  --osl-gold-light: #F0C96B;
  --osl-gold-pale: #FBF4E3;
  --osl-dark: #0F0E0B;
  --osl-dark-2: #1A1914;
  --osl-dark-3: #262520;
  --osl-text: #2A2820;
  --osl-text-light: #5C5A52;
  --osl-border: rgba(200,150,46,0.2);
  --osl-white: #FDFCF8;
  --osl-red-urgent: #C0392B;
  --osl-card-border: #E8E4D8;
`;

export function OfferLandingPage({ offer }: { offer: Offer }) {
  return (
    <div className="osl-root">
      <style>{`
        .osl-root, .osl-root * { box-sizing: border-box; }
        .osl-root {
          ${PALETTE}
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          background: var(--osl-white);
          color: var(--osl-text);
          line-height: 1.6;
          overflow-x: hidden;
        }
        // .osl-root h1, .osl-root h2, .osl-root h3, .osl-root p {  margin: 0; }

        /* TOP BAR */
        .osl-topbar {
          background: var(--osl-dark);
          color: var(--osl-gold-light);
          text-align: center;
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .osl-topbar strong { color: #fff; font-weight: 700; }

        /* HERO */
        .osl-hero {
          background: var(--osl-dark);
          padding: 60px 24px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .osl-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(200,150,46,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .osl-eyebrow {
          display: inline-block;
          background: rgba(200,150,46,0.15);
          border: 1px solid rgba(200,150,46,0.4);
          color: var(--osl-gold-light);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 24px;
          position: relative; z-index: 1;
        }
        /* Shared content column — every hero text block uses the same
           max-width so headline, sub-headline, and supporting paragraphs
           line up to the same horizontal extent on desktop. */
        .osl-hero h1 {
          font-family: 'Fraunces', serif;
          font-size: clamp(32px, 5vw, 58px);
          font-weight: 900;
          color: #fff;
          line-height: 1.1;
          max-width: 720px;
          margin: 0 auto 20px;
          text-wrap: balance;
          position: relative; z-index: 1;
        }
        .osl-hero h1 em { font-style: italic; color: var(--osl-gold-light); font-weight: 900; }
        .osl-hero-sub {
          font-size: 18px;
          color: rgba(255,255,255,0.65);
          max-width: 720px;
          margin: 0 auto 36px;
          line-height: 1.6;
          text-align: center;
          text-wrap: balance;
          position: relative; z-index: 1;
        }
        .osl-hero-sub strong { color: rgba(255,255,255,0.9); font-weight: 600; }

        /* TRUST ROW */
        .osl-trust-row {
          display: flex; justify-content: center; gap: 24px;
          flex-wrap: wrap; margin-bottom: 36px;
          position: relative; z-index: 1;
        }
        .osl-trust-item {
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; color: rgba(255,255,255,0.6); font-weight: 500;
        }
        .osl-trust-item svg { color: var(--osl-gold); flex-shrink: 0; }

        /* CTA */
        .osl-cta {
          display: inline-block;
          background: linear-gradient(135deg, #D4A520 0%, #C8962E 100%);
          color: var(--osl-dark);
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          font-weight: 700;
          padding: 18px 42px;
          border-radius: 6px;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 24px rgba(200,150,46,0.4);
          position: relative; overflow: hidden; border: none; cursor: pointer;
          z-index: 1;
        }
        .osl-cta::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: osl-shimmer 2.5s infinite;
        }
        @keyframes osl-shimmer { to { left: 200%; } }
        .osl-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(200,150,46,0.5); }
        .osl-cta-sub { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 12px; position: relative; z-index: 1; text-align: center; }
        .osl-cta-large {
          font-size: 19px; padding: 20px 52px;
          box-shadow: 0 8px 36px rgba(200,150,46,0.45);
        }
        .osl-cta-large:hover { box-shadow: 0 12px 44px rgba(200,150,46,0.55); }

        /* PRODUCT SECTION */
        .osl-product {
          background: var(--osl-dark-2);
          padding: 0 24px 60px;
          text-align: center;
          position: relative; z-index: 1;
        }
        .osl-mockup { max-width: 320px; margin: 0 auto 36px; padding-top: 40px; }
        .osl-bottle {
          width: 180px; height: 220px;
          background: linear-gradient(145deg, #2a2820 0%, #1a1914 100%);
          border-radius: 16px 16px 24px 24px;
          margin: 0 auto;
          position: relative;
          border: 1px solid rgba(200,150,46,0.3);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(200,150,46,0.1);
          overflow: hidden;
        }
        .osl-bottle img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .osl-bottle-label {
          background: linear-gradient(135deg, #C8962E, #D4A520);
          color: var(--osl-dark);
          font-family: 'Fraunces', serif;
          font-weight: 900;
          font-size: 22px;
          padding: 8px 20px;
          border-radius: 4px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .osl-bottle-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 600;
        }
        .osl-bottle-dots { display: flex; gap: 5px; margin-top: 4px; }
        .osl-bottle-dots i {
          width: 14px; height: 14px;
          background: var(--osl-gold);
          border-radius: 50%;
          opacity: 0.8;
        }
        .osl-bottle-dots i:nth-child(2) { opacity: 0.6; }
        .osl-bottle-dots i:nth-child(3) { opacity: 0.4; }

        /* RATING */
        .osl-stars-row {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; margin-bottom: 28px; flex-wrap: wrap;
        }
        .osl-stars { color: var(--osl-gold); font-size: 20px; letter-spacing: 2px; }
        .osl-rating-text { font-size: 14px; color: rgba(255,255,255,0.55); }
        .osl-rating-text strong { color: rgba(255,255,255,0.85); }

        /* PRICE TIERS */
        .osl-price-row {
          display: flex; justify-content: center; gap: 12px;
          flex-wrap: wrap; margin-bottom: 32px;
        }
        .osl-price-badge {
          background: var(--osl-dark-3);
          border: 1px solid var(--osl-border);
          border-radius: 10px;
          padding: 14px 20px;
          text-align: center;
          min-width: 120px;
          position: relative;
        }
        .osl-price-badge.featured {
          border-color: var(--osl-gold);
          background: rgba(200,150,46,0.08);
        }
        .osl-price-badge .lbl {
          font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.1em; color: rgba(255,255,255,0.4);
          font-weight: 600; margin-bottom: 4px;
        }
        .osl-price-badge .num {
          font-family: 'Fraunces', serif;
          font-size: 26px; font-weight: 900; color: #fff;
        }
        .osl-price-badge .per { font-size: 11px; color: rgba(255,255,255,0.4); }
        .osl-best-tag {
          position: absolute; top: -10px; left: 50%;
          transform: translateX(-50%);
          background: var(--osl-gold);
          color: var(--osl-dark);
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          padding: 3px 10px; border-radius: 100px; white-space: nowrap;
        }

        /* SECTIONS */
        .osl-section { padding: 70px 24px; max-width: 820px; margin: 0 auto; }
        .osl-section-center { text-align: center; }
        .osl-section h2.osl-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(26px, 4vw, 40px);
          font-weight: 900;
          color: var(--osl-text);
          line-height: 1.15;
          margin-bottom: 16px;
          text-wrap: balance;
        }
        .osl-section h2.osl-title em { font-style: italic; color: var(--osl-gold); font-weight: 900; }
        .osl-subtitle {
          font-size: 17px; color: var(--osl-text-light);
          max-width: 720px; margin: 0 auto 48px; line-height: 1.65;
          text-align: center;
          text-wrap: balance;
        }

        /* PAIN */
        .osl-pain-section { background: #F7F5EF; }
        .osl-pain-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px; margin-top: 40px;
        }
        .osl-pain-card {
          background: #fff;
          border: 1px solid var(--osl-card-border);
          border-radius: 12px;
          padding: 22px 20px;
          border-left: 3px solid var(--osl-red-urgent);
          text-align: left;
        }
        .osl-pain-card h3 { font-size: 15px; font-weight: 700; color: var(--osl-text); margin-bottom: 6px; }
        .osl-pain-card p { font-size: 14px; color: var(--osl-text-light); line-height: 1.55; }

        /* TRANSFORM */
        .osl-transform-section { background: var(--osl-dark); }
        .osl-transform-section h2.osl-title { color: #fff; }
        .osl-transform-section .osl-subtitle { color: rgba(255,255,255,0.55); }
        .osl-transform-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3px; border-radius: 12px; overflow: hidden; margin-top: 40px;
          text-align: left;
        }
        @media (max-width: 500px) { .osl-transform-grid { grid-template-columns: 1fr; } }
        .osl-transform-col { padding: 32px 28px; }
        .osl-transform-col.before { background: rgba(255,255,255,0.05); }
        .osl-transform-col.after  { background: rgba(200,150,46,0.1); }
        .osl-transform-col h3 {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em;
          font-weight: 700; margin-bottom: 20px; padding-bottom: 12px;
        }
        .osl-transform-col.before h3 { color: rgba(255,255,255,0.35); border-bottom: 1px solid rgba(255,255,255,0.08); }
        .osl-transform-col.after  h3 { color: var(--osl-gold); border-bottom: 1px solid rgba(200,150,46,0.3); }
        .osl-transform-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 16px; font-size: 15px; }
        .osl-transform-col.before .osl-transform-item { color: rgba(255,255,255,0.45); }
        .osl-transform-col.after  .osl-transform-item { color: rgba(255,255,255,0.85); }
        .osl-transform-icon { font-size: 16px; flex-shrink: 0; margin-top: 2px; line-height: 1; }

        /* INGREDIENTS */
        .osl-ingredient-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px; margin-top: 40px; text-align: left;
        }
        .osl-ingredient-card {
          border: 1px solid var(--osl-card-border);
          border-radius: 12px;
          padding: 22px 20px;
          background: #fff;
          transition: border-color 0.2s;
        }
        .osl-ingredient-card:hover { border-color: var(--osl-gold); }
        .osl-ingredient-card img {
          width: 56px; height: 56px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 12px;
        }
        .osl-ingredient-name { font-size: 15px; font-weight: 700; color: var(--osl-text); margin-bottom: 6px; }
        .osl-ingredient-desc { font-size: 13px; color: var(--osl-text-light); line-height: 1.55; }

        /* TESTIMONIALS */
        .osl-testimonial-section { background: var(--osl-gold-pale); }
        .osl-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px; margin-top: 40px; text-align: left;
        }
        .osl-testimonial-card {
          background: #fff;
          border-radius: 14px;
          padding: 26px 24px;
          border: 1px solid rgba(200,150,46,0.2);
          position: relative;
        }
        .osl-testimonial-card::before {
          content: '"';
          position: absolute; top: 16px; right: 22px;
          font-family: 'Fraunces', serif;
          font-size: 64px;
          color: var(--osl-gold-light);
          line-height: 1; opacity: 0.5;
        }
        .osl-testimonial-stars { color: var(--osl-gold); font-size: 15px; margin-bottom: 12px; letter-spacing: 2px; }
        .osl-testimonial-text {
          font-size: 15px;
          color: var(--osl-text);
          line-height: 1.65;
          margin-bottom: 18px;
          font-style: italic;
        }
        .osl-testimonial-author { display: flex; align-items: center; gap: 10px; }
        .osl-author-avatar {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: var(--osl-dark-3);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: var(--osl-gold);
          flex-shrink: 0;
        }
        .osl-author-name { font-size: 14px; font-weight: 700; color: var(--osl-text); }
        .osl-verified-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; color: #1a7f4b; font-weight: 600;
          background: #eaf7f0; padding: 2px 8px; border-radius: 100px;
          margin-top: 4px;
        }

        /* GUARANTEE */
        .osl-guarantee-section { background: var(--osl-dark); text-align: center; }
        .osl-guarantee-section h2.osl-title { color: #fff; }
        .osl-guarantee-badge {
          width: 120px; height: 120px;
          border-radius: 50%;
          border: 3px solid var(--osl-gold);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          margin: 0 auto 32px;
          background: rgba(200,150,46,0.08);
        }
        .osl-guarantee-badge .days {
          font-family: 'Fraunces', serif;
          font-size: 32px; font-weight: 900;
          color: var(--osl-gold-light); line-height: 1;
        }
        .osl-guarantee-badge .day-label {
          font-size: 11px; color: rgba(255,255,255,0.5);
          text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;
        }
        .osl-guarantee-text {
          font-size: 17px; color: rgba(255,255,255,0.7);
          max-width: 720px; margin: 0 auto 40px; line-height: 1.65;
          text-align: center;
          text-wrap: balance;
        }
        .osl-guarantee-text strong { color: #fff; }

        /* URGENCY */
        .osl-urgency-section {
          background: var(--osl-dark-2);
          border-top: 1px solid rgba(200,150,46,0.2);
          border-bottom: 1px solid rgba(200,150,46,0.2);
        }
        .osl-urgency-inner { max-width: 600px; margin: 0 auto; padding: 60px 24px; text-align: center; }
        .osl-countdown-label {
          font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em;
          color: var(--osl-gold); font-weight: 700; margin-bottom: 16px;
        }
        .osl-countdown { display: flex; justify-content: center; gap: 12px; margin-bottom: 32px; }
        .osl-countdown-num {
          font-family: 'Fraunces', serif;
          font-size: 42px; font-weight: 900; color: #fff;
          display: block; line-height: 1; min-width: 64px;
          background: var(--osl-dark-3);
          border: 1px solid var(--osl-border);
          border-radius: 8px; padding: 8px 12px;
        }
        .osl-countdown-label-small {
          font-size: 11px; color: rgba(255,255,255,0.4);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-top: 6px; display: block;
        }
        .osl-colon {
          font-family: 'Fraunces', serif;
          font-size: 42px; font-weight: 900;
          color: var(--osl-gold);
          line-height: 1.15; padding-top: 8px;
        }

        /* FINAL CTA — wrapped in an inner max-width container so it lines up
           with the rest of the page sections (which are all max-width: 820px). */
        .osl-final-cta { background: var(--osl-dark); padding: 80px 24px; }
        .osl-final-cta-inner {
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
        }
        .osl-final-cta h2 {
          font-family: 'Fraunces', serif;
          font-size: clamp(28px, 4vw, 46px);
          font-weight: 900; color: #fff;
          line-height: 1.15;
          margin: 0 auto 16px;
          max-width: 720px;
          text-wrap: balance;
        }
        .osl-final-cta h2 em { font-style: italic; color: var(--osl-gold-light); }
        .osl-final-cta p {
          font-size: 16px; color: rgba(255,255,255,0.5);
          max-width: 720px;
          margin: 0 auto 36px;
          text-align: center;
          text-wrap: balance;
        }
        .osl-cta-stack { display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .osl-security-row {
          display: flex; justify-content: center; gap: 20px;
          flex-wrap: wrap; margin-top: 20px;
        }
        .osl-security-item {
          font-size: 12px; color: rgba(255,255,255,0.4);
          font-weight: 500; display: flex; align-items: center; gap: 5px;
        }
        .osl-security-item svg { color: var(--osl-gold); }

        /* FOOTER — same max-width container as the rest of the page so the
           copyright line and disclosure paragraph share the same horizontal
           bounds as the sections above. */
        .osl-footer {
          background: #080807; padding: 32px 24px;
          font-size: 12px;
          color: rgba(255,255,255,0.3); line-height: 1.7;
        }
        .osl-footer-inner {
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
        }
        .osl-footer a { color: rgba(255,255,255,0.4); text-decoration: underline; }
        .osl-footer-disclosure {
          margin-top: 10px;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        /* STICKY MOBILE CTA */
        .osl-sticky-cta {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: var(--osl-dark);
          border-top: 1px solid var(--osl-border);
          padding: 14px 20px;
          display: none;
          z-index: 100;
          align-items: center; justify-content: space-between; gap: 12px;
        }
        @media (max-width: 640px) { .osl-sticky-cta { display: flex; } }
        .osl-sticky-text { font-size: 14px; font-weight: 600; color: #fff; line-height: 1.3; }
        .osl-sticky-text small { display: block; font-size: 11px; color: rgba(255,255,255,0.45); font-weight: 400; }
        .osl-sticky-btn {
          background: linear-gradient(135deg, #D4A520, #C8962E);
          color: var(--osl-dark);
          font-family: 'DM Sans', sans-serif;
          font-weight: 700; font-size: 14px;
          padding: 11px 22px; border-radius: 6px;
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
        }

        /* FAQ */
        .osl-faq-section { background: #F7F5EF; }
        .osl-faq-list {
          max-width: 620px; margin: 40px auto 0;
          display: flex; flex-direction: column; gap: 20px; text-align: left;
        }
        .osl-faq-item {
          background: #fff;
          border-radius: 12px;
          padding: 22px 24px;
          border: 1px solid var(--osl-card-border);
        }
        .osl-faq-q { font-weight: 700; color: var(--osl-text); margin-bottom: 8px; font-size: 15px; }
        .osl-faq-a { font-size: 14px; color: var(--osl-text-light); line-height: 1.65; }

        .osl-gold-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--osl-gold), transparent);
          max-width: 400px; margin: 0 auto;
        }

        @media (max-width: 640px) {
          .osl-hero { padding: 44px 20px 0; }
          .osl-price-row { gap: 8px; }
          .osl-price-badge { min-width: 100px; padding: 12px 14px; }
        }
      `}</style>

      <TopBar offer={offer} />
      <Hero offer={offer} />
      {offer.problem.points.length > 0 && <Pain offer={offer} />}
      {offer.beforeAfter.length > 0 && <Transform offer={offer} />}
      {offer.ingredients.length > 0 && <Ingredients offer={offer} />}
      {offer.testimonials.length > 0 && <Testimonials offer={offer} />}
      <UrgencyCountdown />
      <Guarantee offer={offer} />
      {offer.faq.length > 0 && <Faq offer={offer} />}
      <FinalCTA offer={offer} />
      <Footer offer={offer} />
      <StickyMobileCTA offer={offer} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sections
// ────────────────────────────────────────────────────────────────────────────

function TopBar({ offer }: { offer: Offer }) {
  // Prefer the dedicated topBar block when set; else fall back to stickyBar
  // text; else synthesise something from the guarantee. Same for emoji.
  const emoji = offer.topBar?.emoji || "🔥";
  const text =
    offer.topBar?.text?.trim() ||
    offer.stickyBar?.text?.trim() ||
    `${offer.guarantee.days}-Day Risk-Free Guarantee — Limited-Time Pricing Active`;
  return (
    <div className="osl-topbar">
      {emoji} <strong>{text}</strong>
    </div>
  );
}

function Hero({ offer }: { offer: Offer }) {
  const tb = offer.trustBadges;
  const trustItems = [
    tb?.guaranteeText || `${offer.guarantee.days}-Day Guarantee`,
    tb?.manufacturingText || "FDA-Registered Facility",
    tb?.vendorVerifiedText || `${offer.vendor} Verified`,
    tb?.shippingText || "Free US Shipping (3+)",
  ];

  // Prefer explicit pricingTiers from the DB. Otherwise derive a 1/3/6
  // strip from price.from/price.to, or fall back to a single tier.
  type Tier = { label: string; price: number; per: string; featured: boolean; bestValueTag?: string };
  let tiers: Tier[];
  if (offer.pricingTiers && offer.pricingTiers.length > 0) {
    tiers = offer.pricingTiers;
  } else {
    const single = !offer.price.to || offer.price.to <= offer.price.from;
    tiers = single
      ? [{ label: offer.price.unit || "Bottle", price: offer.price.from, per: offer.price.unit, featured: true }]
      : [
          { label: `1 ${unitNoun(offer.price.unit)}`, price: offer.price.to, per: `/ ${unitNoun(offer.price.unit)}`, featured: false },
          {
            label: `3 ${pluralNoun(offer.price.unit)}`,
            price: midPrice(offer.price.from, offer.price.to),
            per: `/ ${unitNoun(offer.price.unit)} · free ship`,
            featured: false,
          },
          {
            label: `6 ${pluralNoun(offer.price.unit)}`,
            price: offer.price.from,
            per: `/ ${unitNoun(offer.price.unit)} · free ship + bonuses`,
            featured: true,
            bestValueTag: "Best Value",
          },
        ];
  }

  const eyebrow = offer.eyebrow || `Independent Review · Verified ${offer.vendor} Offer`;

  return (
    <section className="osl-hero">
      <div className="osl-eyebrow">{eyebrow}</div>
      <h1>{renderEm(offer.hero.headline)}</h1>
      <p className="osl-hero-sub">{offer.hero.subheadline}</p>

      <div className="osl-trust-row">
        {trustItems.map((t, i) => (
          <div key={i} className="osl-trust-item">
            <CheckIcon /> {t}
          </div>
        ))}
      </div>

      {/*
        Hero has ONE primary CTA — below the product mockup + price tiers.
        We removed the duplicate CTA that previously appeared above the
        product mockup; it read as a near-identical button just inches
        from this one, which felt repetitive in the redesign.
      */}

      <div className="osl-product">
        <div className="osl-mockup">
          <div className="osl-bottle">
            {offer.heroImage ? (
              <img src={offer.heroImage} alt={`${offer.title} product`} />
            ) : (
              <>
                {offer.productForm && <div className="osl-bottle-sub">{offer.productForm}</div>}
                <div className="osl-bottle-label">{offer.title}</div>
                <div className="osl-bottle-sub">Daily · 30ct</div>
                <div className="osl-bottle-dots"><i /><i /><i /></div>
              </>
            )}
          </div>
        </div>

        {offer.rating && (
          <div className="osl-stars-row">
            <span className="osl-stars">★★★★★</span>
            <span className="osl-rating-text">
              <strong>{offer.rating.score.toFixed(1)}/5</strong>
              {" · "}
              {offer.rating.count
                ? `Based on ${offer.rating.count.toLocaleString()}+ customer reviews`
                : offer.rating.label}
            </span>
          </div>
        )}

        <div className="osl-price-row">
          {tiers.map((t, i) => (
            <div key={i} className={`osl-price-badge${t.featured ? " featured" : ""}`}>
              {t.featured && tiers.length > 1 && (
                <span className="osl-best-tag">{t.bestValueTag || "Best Value"}</span>
              )}
              <div className="lbl">{t.label}</div>
              <div className="num">${t.price}</div>
              <div className="per">{t.per}</div>
            </div>
          ))}
        </div>

        {/*
          Wrap the CTA in an explicit flex-center column so it's guaranteed
          to sit horizontally centred regardless of the price-row width or
          any inherited block-level quirks above it.
        */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <a
            href={offer.affiliateUrl}
            target="_blank"
            rel="noopener sponsored"
            className="osl-cta"
          >
            ✦ {withArrow(offer.hero.ctaLabel || `Claim My Discounted ${pluralNoun(offer.price.unit, true)}`)}
          </a>
          <p className="osl-cta-sub">
            Secure {offer.vendor} checkout · {offer.guarantee.label}
          </p>
        </div>
      </div>
    </section>
  );
}

function Pain({ offer }: { offer: Offer }) {
  return (
    <>
      <section className="osl-pain-section">
        <div className="osl-section osl-section-center">
          <h2 className="osl-title">{offer.problem.heading || "Sound Familiar?"}</h2>
          <p className="osl-subtitle">
            If any of these hit close to home, you're not alone — and you're not stuck with them.
          </p>
          <div className="osl-pain-grid">
            {offer.problem.points.map((p, i) => (
              <PainCard key={i} point={p} />
            ))}
          </div>
        </div>
      </section>
      <div className="osl-gold-divider" />
    </>
  );
}

function PainCard({ point }: { point: ProblemPoint }) {
  return (
    <div className="osl-pain-card">
      <h3>
        {point.emoji ? <span style={{ marginRight: 6 }}>{point.emoji}</span> : null}
        {point.label}
      </h3>
      <p>{point.description}</p>
    </div>
  );
}

function Transform({ offer }: { offer: Offer }) {
  return (
    <section className="osl-transform-section">
      <div className="osl-section osl-section-center">
        <h2 className="osl-title">What Changes When You Fix It</h2>
        <p className="osl-subtitle">
          Most people report the shift starts in week 2–3. Here's what they describe.
        </p>
        <div className="osl-transform-grid">
          <div className="osl-transform-col before">
            <h3>Without {offer.title}</h3>
            {offer.beforeAfter.map((ba, i) => (
              <div key={i} className="osl-transform-item">
                <span className="osl-transform-icon">✗</span>
                {ba.before}
              </div>
            ))}
          </div>
          <div className="osl-transform-col after">
            <h3>After 30–60 Days</h3>
            {offer.beforeAfter.map((ba, i) => (
              <div key={i} className="osl-transform-item">
                <span className="osl-transform-icon">✦</span>
                {ba.after}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Ingredients({ offer }: { offer: Offer }) {
  return (
    <section>
      <div className="osl-section osl-section-center">
        <h2 className="osl-title">
          {offer.ingredients.length} Ingredients. Each One <em>Chosen for a Reason.</em>
        </h2>
        <p className="osl-subtitle">
          No fillers. No proprietary blends hiding weak doses. Every ingredient is selected for a
          reason.
        </p>
        <div className="osl-ingredient-grid">
          {offer.ingredients.map((i) => (
            <div key={i.name} className="osl-ingredient-card">
              {i.image && <img src={i.image} alt={i.name} loading="lazy" />}
              <div className="osl-ingredient-name">{i.name}</div>
              {i.dose && (
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--osl-gold)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginTop: 4,
                    marginBottom: 6,
                  }}
                >
                  {i.dose}
                </div>
              )}
              <div className="osl-ingredient-desc">{i.benefit}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 44,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <a href={offer.affiliateUrl} target="_blank" rel="noopener sponsored" className="osl-cta">
            Get {offer.title} at the Lowest Price →
          </a>
          <p className="osl-cta-sub" style={{ color: "var(--osl-text-light)" }}>
            {offer.guarantee.label} · Ships Within 24hrs · {offer.vendor} Secured
          </p>
        </div>
      </div>
    </section>
  );
}

function Testimonials({ offer }: { offer: Offer }) {
  return (
    <section className="osl-testimonial-section">
      <div className="osl-section osl-section-center">
        <h2 className="osl-title">What Real People Are Saying</h2>
        <p className="osl-subtitle">
          Unsolicited reviews from real customers. Individual results vary.
        </p>
        <div className="osl-testimonials-grid">
          {offer.testimonials.map((t) => (
            <div key={t.name} className="osl-testimonial-card">
              <div className="osl-testimonial-stars">
                {"★".repeat(t.rating)}
                <span style={{ color: "var(--osl-card-border)" }}>{"★".repeat(5 - t.rating)}</span>
              </div>
              <p className="osl-testimonial-text">"{t.quote}"</p>
              <div className="osl-testimonial-author">
                <div className="osl-author-avatar">{t.initials}</div>
                <div>
                  <div className="osl-author-name">
                    {t.name}, {t.age}
                    {t.location && (
                      <span style={{ color: "var(--osl-text-light)", fontWeight: 400 }}>
                        {" · "}
                        {t.location}
                      </span>
                    )}
                  </div>
                  {(t.occupation || t.bottleTier) && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--osl-text-light)",
                        marginTop: 2,
                      }}
                    >
                      {[t.occupation, t.bottleTier].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  {t.verified && (
                    <span className="osl-verified-badge">✓ Verified Purchase</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guarantee({ offer }: { offer: Offer }) {
  return (
    <section className="osl-guarantee-section">
      <div className="osl-section osl-section-center">
        <div className="osl-guarantee-badge">
          <span className="days">{offer.guarantee.days}</span>
          <span className="day-label">Day</span>
          <span className="day-label">Guarantee</span>
        </div>
        <h2 className="osl-title">
          {offer.guarantee.days >= 180 ? (
            <>
              The Longest Guarantee <em>I've Ever Seen</em> on a Product Like This
            </>
          ) : (
            <>
              <em>{offer.guarantee.days} Days.</em> Every Cent Back.
            </>
          )}
        </h2>
        <p className="osl-guarantee-text">
          {offer.title} comes with an ironclad <strong>{offer.guarantee.days}-day money-back
          guarantee</strong>. If it doesn't work for you — for any reason, no questions asked —
          contact {offer.vendor} and get every cent back. <strong>You literally cannot lose money
          here.</strong>
        </p>
        <a href={offer.affiliateUrl} target="_blank" rel="noopener sponsored" className="osl-cta">
          Try {offer.title} Risk-Free →
        </a>
      </div>
    </section>
  );
}

function Faq({ offer }: { offer: Offer }) {
  return (
    <section className="osl-faq-section">
      <div className="osl-section">
        <h2 className="osl-title osl-section-center">Common Questions</h2>
        <div className="osl-faq-list">
          {offer.faq.map((f, i) => (
            <div key={i} className="osl-faq-item">
              <div className="osl-faq-q">{f.question}</div>
              <div className="osl-faq-a">{f.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ offer }: { offer: Offer }) {
  return (
    <section className="osl-final-cta">
      <div className="osl-final-cta-inner">
        <h2>
          The Only Risk Is <em>Not Trying It</em>
        </h2>
        <p>
          {offer.guarantee.label}. Starting at ${offer.price.from}/{unitNoun(offer.price.unit)}.
          Ships within 24 hours.
        </p>
        <div className="osl-cta-stack">
          <a
            href={offer.affiliateUrl}
            target="_blank"
            rel="noopener sponsored"
            className="osl-cta osl-cta-large"
          >
            ✦ Claim My {offer.title} Discount Now
          </a>
          <div className="osl-security-row">
            <span className="osl-security-item">
              <LockIcon /> 256-bit SSL
            </span>
            <span className="osl-security-item">
              <CheckIcon /> {offer.vendor} Verified
            </span>
            <span className="osl-security-item">
              <CheckIcon /> {offer.guarantee.days}-Day Full Refund
            </span>
            <span className="osl-security-item">
              <CheckIcon /> Ships Within 24hrs
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ offer }: { offer: Offer }) {
  const disclosure =
    offer.footerDisclosure ||
    `OfferSendly may earn a commission on purchases made through links on this page, at no extra cost to you. This page is not affiliated with or endorsed by ${offer.title}'s manufacturer. Individual results vary. These statements have not been evaluated by the FDA.`;
  return (
    <footer className="osl-footer">
      <div className="osl-footer-inner">
        <p>
          © {new Date().getFullYear()} OfferSendly · <a href="/privacy">Privacy Policy</a> ·{" "}
          <a href="/terms">Terms</a> · <a href="/disclosure">Affiliate Disclosure</a>
        </p>
        <p className="osl-footer-disclosure">{disclosure}</p>
      </div>
    </footer>
  );
}

function StickyMobileCTA({ offer }: { offer: Offer }) {
  return (
    <div className="osl-sticky-cta">
      <div className="osl-sticky-text">
        {offer.title} — {offer.guarantee.days}-Day Guarantee
        <small>
          From ${offer.price.from}/{unitNoun(offer.price.unit)}
        </small>
      </div>
      <a
        href={offer.affiliateUrl}
        target="_blank"
        rel="noopener sponsored"
        className="osl-sticky-btn"
      >
        Get It →
      </a>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Client-only urgency countdown — 3h 47m 22s by default, ticks down each
// second. Resets on every page load (it's a urgency device, not a real
// deadline). Mounted as a useEffect-driven component so SSR renders the
// initial values and hydration doesn't flicker.
// ────────────────────────────────────────────────────────────────────────────

function UrgencyCountdown() {
  const [secs, setSecs] = useState(3 * 3600 + 47 * 60 + 22);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <section className="osl-urgency-section">
      <div className="osl-urgency-inner">
        <div className="osl-countdown-label">⚡ Discount expires in</div>
        <div className="osl-countdown">
          <div>
            <span className="osl-countdown-num">{pad(h)}</span>
            <span className="osl-countdown-label-small">Hours</span>
          </div>
          <span className="osl-colon">:</span>
          <div>
            <span className="osl-countdown-num">{pad(m)}</span>
            <span className="osl-countdown-label-small">Mins</span>
          </div>
          <span className="osl-colon">:</span>
          <div>
            <span className="osl-countdown-num">{pad(s)}</span>
            <span className="osl-countdown-label-small">Secs</span>
          </div>
        </div>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 420, margin: "0 auto" }}>
          The multi-bottle discount and free shipping are promotional pricing. Once the timer hits
          zero, the offer reverts to standard pricing.
        </p>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/** Highlight the last 2-4 words of a headline in italic gold to add visual rhythm. */
function renderEm(headline: string): React.ReactNode {
  const words = headline.trim().split(/\s+/);
  if (words.length < 4) return headline;
  const splitAt = Math.max(words.length - 3, Math.ceil(words.length * 0.6));
  return (
    <>
      {words.slice(0, splitAt).join(" ")} <em>{words.slice(splitAt).join(" ")}</em>
    </>
  );
}

/** Extract a singular noun from a price unit like "per bottle" / "per month" / "one-time". */
function unitNoun(unit: string): string {
  const cleaned = unit.replace(/^per\s+/i, "").trim();
  if (!cleaned || /^one[-\s]?time$/i.test(cleaned)) return "purchase";
  return cleaned.replace(/s$/i, "");
}

function pluralNoun(unit: string, capitalised = false): string {
  const n = unitNoun(unit);
  const plural = n.endsWith("s") ? n : `${n}s`;
  return capitalised ? plural[0].toUpperCase() + plural.slice(1) : plural;
}

/** Midpoint between two prices, rounded down to the nearest whole dollar. */
function midPrice(from: number, to: number): number {
  return Math.floor((from + to) / 2);
}

/** Ensure the CTA label ends with exactly one trailing arrow — many user-written
 *  labels already end in "→", so naively appending would produce "→ →". */
function withArrow(label: string): string {
  const trimmed = label.trim().replace(/\s*→+\s*$/, "");
  return `${trimmed} →`;
}
