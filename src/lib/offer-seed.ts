import type { Offer } from "./offer-schema";

const SPARTAMAX_AFFILIATE_URL = "https://7e081yh-r3w3q8dizw6gp9dv71.hop.clickbank.net";

// ────────────────────────────────────────────────────────────────────────────
// Seed offers — loaded into the DB on first run only. After that the admin
// owns the data. The Spartamax entry intentionally mirrors the prior
// hand-coded landing page so the rendered template is pixel-identical.
// ────────────────────────────────────────────────────────────────────────────

const spartamax: Offer = {
  slug: "spartamax",
  title: "Spartamax",
  tagline:
    "The daily gummy helping men over 40 reclaim their stamina and confidence.",
  category: "Health & Wellness",
  tags: ["Male Performance", "Natural", "Gummies", "Testosterone Support"],
  affiliateUrl: SPARTAMAX_AFFILIATE_URL,
  heroImage: "",
  badge: "Editor's Pick",
  price: { from: 49, to: 69, unit: "per bottle" },
  guarantee: { days: 365, label: "365-Day Money-Back Guarantee" },
  rating: { score: 4.8, label: "Based on verified buyer reports" },
  featured: true,
  publishedAt: "2026-05-01",
  vendor: "ClickBank",
  productForm: "Gummies",
  seo: {
    title:
      "Spartamax Review — The Daily Gummy Men Are Talking About (365-Day Guarantee)",
    description:
      "Spartamax gummies support stamina, blood flow, and confidence naturally. 7 clinically studied ingredients. Risk-free with a 365-day money-back guarantee.",
    ogImage: "",
  },
  stickyBar: {
    text: "365-Day Risk-Free Guarantee — Try Spartamax With Zero Risk",
    ctaLabel: "Get Spartamax →",
  },
  trustBadges: {
    guaranteeText: "365-Day Money Back",
    shippingText: "Free US Shipping (3+)",
    vendorVerifiedText: "ClickBank Verified",
    manufacturingText: "FDA-Registered Facility",
  },
  hero: {
    headline:
      "The Daily Gummy Helping Men Over 40 Feel Like Themselves Again",
    subheadline:
      "Spartamax combines 7 research-backed ingredients — including Tongkat Ali, Ashwagandha, and Maca Root — to support stamina, blood flow, and confidence naturally.",
    ctaLabel: "Claim Your Discounted Spartamax →",
  },
  problem: {
    heading: "Modern Life Is Quietly Draining Men's Vitality",
    points: [
      {
        icon: "BatteryLow",
        label: "Chronic fatigue",
        description: "Energy crashes that hit by mid-afternoon.",
      },
      {
        icon: "Activity",
        label: "Low stamina",
        description: "Less endurance in the gym and in the bedroom.",
      },
      {
        icon: "TrendingDown",
        label: "Reduced drive",
        description: "That competitive edge you used to have feels gone.",
      },
      {
        icon: "Droplets",
        label: "Poor circulation",
        description:
          "Sluggish blood flow affects performance more than most men realize.",
      },
      {
        icon: "Brain",
        label: "Brain fog",
        description: "Difficulty staying sharp and focused throughout the day.",
      },
      {
        icon: "HeartCrack",
        label: "Low confidence",
        description: "The psychological spiral that follows physical decline.",
      },
    ],
  },
  solution: {
    heading: "Spartamax Was Formulated For Exactly This",
    body: "Spartamax is a daily gummy — not a drug, not a stack of pills. One chewable in the morning, alongside your coffee. Seven natural, research-backed ingredients designed for men 35–60 who want to support stamina, drive, and circulation without prescriptions. Built as a ritual you'll actually stick with.",
  },
  ingredients: [
    {
      name: "L-Arginine",
      benefit:
        "Precursor to nitric oxide. Supports healthy blood flow and circulation, which is foundational for physical performance.",
    },
    {
      name: "Tongkat Ali",
      benefit:
        "Used for centuries in Southeast Asian traditional medicine. Studied for its ability to support healthy testosterone levels and libido.",
    },
    {
      name: "Maca Root",
      benefit:
        "Andean root used by Incan warriors. Associated with increased energy, stamina, and sexual function in multiple studies.",
    },
    {
      name: "Ashwagandha",
      benefit:
        "Adaptogenic herb clinically studied for stress reduction. Lower cortisol directly supports better hormonal balance and drive.",
    },
    {
      name: "Horny Goat Weed",
      benefit:
        "Contains icariin, a compound that supports blood flow by inhibiting PDE5 — the same mechanism as pharmaceutical options.",
    },
    {
      name: "Beet Root",
      benefit:
        "High in dietary nitrates that convert to nitric oxide. Supports endurance, blood pressure, and circulation.",
    },
    {
      name: "Grape Seed Extract",
      benefit:
        "Rich in OPCs (oligomeric proanthocyanidins). Supports vascular health and antioxidant protection.",
    },
  ],
  beforeAfter: [
    { before: "Dragging through the day", after: "Consistent energy from morning to night" },
    { before: "Avoiding the gym and intimacy", after: "Back to performing at my best" },
    { before: "Frustrated and off my game", after: "Confident, driven, and motivated" },
  ],
  testimonials: [
    {
      name: "Jason M.",
      age: 53,
      initials: "JM",
      rating: 5,
      quote:
        "I was skeptical because I'd tried other stuff before. But after about three weeks of taking Spartamax every morning, I genuinely noticed more energy and a lot more confidence. My wife noticed too.",
      verified: true,
    },
    {
      name: "Eric T.",
      age: 44,
      initials: "ET",
      rating: 5,
      quote:
        "The gummies made it easy — I just take one with my coffee. More stamina at the gym, and I just feel sharper during the day. Solid product.",
      verified: true,
    },
    {
      name: "Daniel R.",
      age: 47,
      initials: "DR",
      rating: 4,
      quote:
        "Took about 3–4 weeks to really feel a difference. Energy came back first, then the drive. Wish I'd started sooner honestly.",
      verified: true,
    },
  ],
  faq: [
    {
      question: "Is this actually a gummy?",
      answer:
        "Yes. Spartamax comes as a chewable gummy, not a capsule or pill. Take one daily, preferably in the morning.",
    },
    {
      question: "How long until I notice results?",
      answer:
        "Most men report noticing a difference in energy and drive within 2–4 weeks of consistent daily use. For full results, the vendor recommends at least 90 days.",
    },
    {
      question: "What's the price?",
      answer:
        "A single bottle (1-month supply) is $69 + shipping. Three bottles drop to $59/bottle with free US shipping. Six bottles are $49/bottle with free US shipping and 2 bonus digital guides.",
    },
    {
      question: "Is there a guarantee?",
      answer:
        "Yes — 365 days. The longest guarantee I've seen on a supplement. If it doesn't work for you, contact ClickBank for a full refund, no questions asked.",
    },
    {
      question: "Who is this for?",
      answer:
        "Men 35–65 who want to support stamina, energy, circulation, and confidence naturally, without prescription medications.",
    },
  ],
  footerDisclosure:
    "OfferSendly may earn a commission on purchases made through links on this page, at no extra cost to you. This page is not affiliated with or endorsed by Spartamax's manufacturer. Results vary. These statements have not been evaluated by the FDA.",
};

const ironforge: Offer = {
  slug: "ironforge-pro",
  title: "IronForge Pro",
  tagline:
    "12-week strength program engineered for men returning to the gym after 35.",
  category: "Fitness",
  tags: ["Strength", "Program", "Men 35+"],
  affiliateUrl: "https://example.com/ironforge",
  heroImage: "",
  badge: "Best Seller",
  price: { from: 39, to: 79, unit: "one-time" },
  guarantee: { days: 60, label: "60-Day Money-Back Guarantee" },
  rating: { score: 4.7, label: "Based on verified buyer reports" },
  featured: true,
  publishedAt: "2026-04-15",
  vendor: "ClickBank",
  productForm: "Digital Course",
  seo: {
    title: "IronForge Pro Review | OfferSendly",
    description: "A 12-week strength program for men 35+.",
    ogImage: "",
  },
  hero: {
    headline: "Build Real Strength In 12 Weeks — Without Wrecking Your Joints",
    subheadline:
      "A progressive program designed for the body you have now, not the one you had at 25.",
    ctaLabel: "Get IronForge Pro →",
  },
  problem: { heading: "Why most programs fail men over 35.", points: [] },
  solution: {
    heading: "Smarter loading. Better recovery.",
    body: "IronForge Pro is a 12-week strength system built around joint-friendly progressions, intelligent deloads, and a recovery framework that respects how your body actually adapts after 35.",
  },
  ingredients: [],
  beforeAfter: [],
  testimonials: [],
  faq: [],
  footerDisclosure: "",
};

const wealthcompass: Offer = {
  slug: "wealthcompass",
  title: "WealthCompass",
  tagline:
    "A no-nonsense personal finance system for people who hate budgeting apps.",
  category: "Finance",
  tags: ["Budgeting", "Wealth", "Course"],
  affiliateUrl: "https://example.com/wealthcompass",
  heroImage: "",
  price: { from: 29, to: 99, unit: "one-time" },
  guarantee: { days: 30, label: "30-Day Money-Back Guarantee" },
  rating: { score: 4.6, label: "Based on verified buyer reports" },
  featured: true,
  publishedAt: "2026-03-22",
  vendor: "ClickBank",
  productForm: "Digital Course",
  seo: {
    title: "WealthCompass Review | OfferSendly",
    description: "Simple personal finance for real life.",
    ogImage: "",
  },
  hero: {
    headline: "Finally Get Your Money Organized — In One Weekend",
    subheadline:
      "A pen-and-paper friendly system that replaces five apps and a spreadsheet.",
    ctaLabel: "Get WealthCompass →",
  },
  problem: { heading: "Budgeting apps don't work for everyone.", points: [] },
  solution: {
    heading: "A weekend system, not a daily chore.",
    body: "WealthCompass replaces ongoing app friction with a one-weekend setup that keeps working in the background.",
  },
  ingredients: [],
  beforeAfter: [],
  testimonials: [],
  faq: [],
  footerDisclosure: "",
};

const lumea: Offer = {
  slug: "lumea-skincare",
  title: "Lumea Renewal Serum",
  tagline: "A peptide-rich nightly serum formulated for skin over 40.",
  category: "Skincare",
  tags: ["Anti-Aging", "Peptides", "Nightly"],
  affiliateUrl: "https://example.com/lumea",
  heroImage: "",
  badge: "New",
  price: { from: 39, to: 59, unit: "per bottle" },
  guarantee: { days: 90, label: "90-Day Money-Back Guarantee" },
  rating: { score: 4.5, label: "Based on verified buyer reports" },
  featured: false,
  publishedAt: "2026-05-10",
  vendor: "ClickBank",
  productForm: "Serum",
  seo: {
    title: "Lumea Renewal Serum Review | OfferSendly",
    description: "Peptide serum for mature skin.",
    ogImage: "",
  },
  hero: {
    headline: "Wake Up To Smoother, Brighter Skin",
    subheadline:
      "Lumea pairs clinical-grade peptides with botanicals proven to support skin renewal overnight.",
    ctaLabel: "Try Lumea →",
  },
  problem: { heading: "Most serums don't work past 40.", points: [] },
  solution: {
    heading: "Built for mature skin.",
    body: "Lumea pairs proven peptides with botanicals to support nightly skin renewal.",
  },
  ingredients: [],
  beforeAfter: [],
  testimonials: [],
  faq: [],
  footerDisclosure: "",
};

const focusforge: Offer = {
  slug: "focusforge-ai",
  title: "FocusForge AI",
  tagline:
    "An AI-powered deep work assistant that blocks distractions and plans your day.",
  category: "Software",
  tags: ["Productivity", "AI", "Deep Work"],
  affiliateUrl: "https://example.com/focusforge",
  heroImage: "",
  price: { from: 12, to: 29, unit: "per month" },
  guarantee: { days: 30, label: "30-Day Money-Back Guarantee" },
  rating: { score: 4.7, label: "Based on verified buyer reports" },
  featured: false,
  publishedAt: "2026-02-18",
  vendor: "ClickBank",
  productForm: "Software",
  seo: {
    title: "FocusForge AI Review | OfferSendly",
    description: "AI deep-work assistant.",
    ogImage: "",
  },
  hero: {
    headline: "Stop Reacting. Start Producing.",
    subheadline:
      "FocusForge plans your most important work and protects the hours it takes to do it.",
    ctaLabel: "Get FocusForge AI →",
  },
  problem: { heading: "Distraction is killing your output.", points: [] },
  solution: {
    heading: "Plan, protect, produce.",
    body: "FocusForge plans your most important work and protects the hours it takes to do it.",
  },
  ingredients: [],
  beforeAfter: [],
  testimonials: [],
  faq: [],
  footerDisclosure: "",
};

export const SEED_OFFERS: Offer[] = [spartamax, ironforge, wealthcompass, lumea, focusforge];
