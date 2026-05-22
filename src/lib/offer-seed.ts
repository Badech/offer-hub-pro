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
    "The daily gummy quietly giving men over 40 their edge back.",
  category: "Health & Wellness",
  tags: ["Male Performance", "Natural", "Gummies", "Testosterone Support"],
  affiliateUrl: SPARTAMAX_AFFILIATE_URL,
  heroImage: "",
  badge: "Editor's Pick",
  price: { from: 49, to: 69, unit: "per bottle" },
  guarantee: { days: 365, label: "365-Day Money-Back Guarantee" },
  rating: { score: 4.8, label: "Based on 2,300+ customer reviews", count: 2300 },
  featured: true,
  publishedAt: "2026-05-01",
  vendor: "ClickBank",
  productForm: "Gummies",
  seo: {
    title:
      "Spartamax Review — The Daily Gummy Men Are Talking About (365-Day Guarantee)",
    description:
      "Spartamax combines 7 clinically studied ingredients — Tongkat Ali, Ashwagandha & Maca Root among them — to support stamina, blood flow, and confidence. 365-day money-back guarantee.",
    ogImage: "",
  },
  topBar: {
    emoji: "🔥",
    text: "LIMITED TIME: 6-Bottle Bundle Now 29% Off + 2 Free Guides — Today Only",
  },
  eyebrow: "Independent Review · Verified ClickBank Offer",
  stickyBar: {
    text: "365-Day Risk-Free Guarantee — Try Spartamax With Zero Risk",
    ctaLabel: "Get Spartamax →",
  },
  trustBadges: {
    guaranteeText: "365-Day Guarantee",
    shippingText: "Free US Shipping (3+)",
    vendorVerifiedText: "ClickBank Verified",
    manufacturingText: "FDA-Registered Facility",
  },
  pricingTiers: [
    { label: "1 Bottle", price: 69, per: "/ bottle", featured: false },
    { label: "3 Bottles", price: 59, per: "/ bottle · free ship", featured: false },
    {
      label: "6 Bottles",
      price: 49,
      per: "/ bottle · free ship + bonuses",
      featured: true,
      bestValueTag: "Best Value",
    },
  ],
  hero: {
    headline: "The Daily Gummy Quietly Giving Men Over 40 Their Edge Back",
    subheadline:
      "Spartamax combines 7 clinically studied ingredients — including Tongkat Ali, Ashwagandha & Maca Root — to support stamina, blood flow, and confidence. One gummy with your morning coffee.",
    ctaLabel: "✦ Yes — I Want My Stamina Back",
  },
  problem: {
    heading: "Sound Familiar?",
    points: [
      {
        icon: "BatteryLow",
        emoji: "⚡",
        label: "Energy crashes by 2pm",
        description:
          "Mid-afternoon fatigue that no amount of coffee fixes. You used to power through the whole day.",
      },
      {
        icon: "Activity",
        emoji: "💪",
        label: "Gym performance is down",
        description:
          "The drive to train hard just isn't there. Recovery takes longer. Gains have stalled.",
      },
      {
        icon: "HeartCrack",
        emoji: "🛏",
        label: "Drive has gone quiet",
        description:
          "Less interest in intimacy than you used to have. Your partner has noticed. You definitely have.",
      },
      {
        icon: "Brain",
        emoji: "🧠",
        label: "Brain fog at work",
        description:
          "Struggling to stay sharp in meetings. The mental edge you relied on isn't showing up.",
      },
      {
        icon: "TrendingDown",
        emoji: "😤",
        label: "Low patience, low mood",
        description:
          "Irritable for no clear reason. The psychological toll of feeling \"off\" adds up fast.",
      },
      {
        icon: "Droplets",
        emoji: "🩸",
        label: "Sluggish circulation",
        description:
          "Poor blood flow affects everything from workout pumps to bedroom performance. It's all connected.",
      },
    ],
  },
  solution: {
    heading: "Spartamax Was Formulated For Exactly This",
    body: "Spartamax is a daily gummy — not a drug, not a stack of pills. One chewable in the morning, alongside your coffee. Seven natural, research-backed ingredients designed for men 35–60 who want to support stamina, drive, and circulation without prescriptions. Built as a ritual you'll actually stick with.",
  },
  ingredients: [
    {
      name: "Tongkat Ali",
      dose: "200mg · Standardized 2%",
      benefit:
        "Southeast Asian herb used for centuries. Multiple double-blind studies show support for healthy testosterone levels and libido in men over 40.",
    },
    {
      name: "Ashwagandha",
      dose: "300mg · KSM-66 Form",
      benefit:
        "Adaptogen proven to lower cortisol by up to 27% in clinical trials. Lower cortisol = better hormonal balance, deeper sleep, more drive.",
    },
    {
      name: "Maca Root",
      dose: "500mg · Black Maca",
      benefit:
        "Incan warrior fuel. Studied for energy, endurance, and sexual function. One of the most replicated herbal compounds for male performance.",
    },
    {
      name: "L-Arginine",
      dose: "600mg",
      benefit:
        "Precursor to nitric oxide. Converts to NO in the body, dilating blood vessels and improving circulation to muscles and vital areas.",
    },
    {
      name: "Horny Goat Weed",
      dose: "250mg · 10% Icariin",
      benefit:
        "Contains icariin, which inhibits PDE5 — the same mechanism targeted by prescription ED medications. Works naturally at the source.",
    },
    {
      name: "Beet Root",
      dose: "400mg",
      benefit:
        "High in natural nitrates that boost nitric oxide production. Clinically shown to improve exercise endurance and lower blood pressure.",
    },
    {
      name: "Grape Seed Extract",
      dose: "150mg · 95% OPCs",
      benefit:
        "Powerful antioxidant that protects blood vessels, reduces oxidative stress, and amplifies the effects of the nitric oxide ingredients.",
    },
  ],
  beforeAfter: [
    { before: "Dragging through the afternoon", after: "Consistent energy morning to night" },
    { before: "Avoiding the gym, skipping workouts", after: "Back in the gym, stronger sessions" },
    { before: "Low libido, low confidence", after: "Drive and confidence return naturally" },
    { before: "Foggy, unfocused at work", after: "Mentally sharp, present, in control" },
    { before: "Feeling older than your actual age", after: "Feeling like yourself again" },
  ],
  testimonials: [
    {
      name: "Jason M.",
      age: 53,
      initials: "JM",
      rating: 5,
      quote:
        "I was skeptical because I'd tried other stuff before. But after about three weeks of taking Spartamax every morning, I genuinely noticed more energy and a lot more confidence in the bedroom. My wife noticed too.",
      verified: true,
      location: "Dallas, TX",
      occupation: "Construction Manager",
      bottleTier: "6-bottle customer",
    },
    {
      name: "Eric T.",
      age: 44,
      initials: "ET",
      rating: 5,
      quote:
        "The gummy format made it a habit I actually stick with. I just take one with my morning coffee. Noticed more stamina at the gym, and I feel sharper during the day. Solid product — will keep buying.",
      verified: true,
      location: "Phoenix, AZ",
      occupation: "Project Director",
      bottleTier: "3-bottle customer",
    },
    {
      name: "Daniel R.",
      age: 47,
      initials: "DR",
      rating: 5,
      quote:
        "Took about 3–4 weeks to really feel a difference. Energy came back first, then everything else followed. I feel like I'm 35 again at 47. Wish I'd started sooner honestly. Best supplement I've tried.",
      verified: true,
      location: "Chicago, IL",
      occupation: "Sales Executive",
      bottleTier: "6-bottle customer",
    },
  ],
  faq: [
    {
      question: "How long before I notice results?",
      answer:
        "Most men report a noticeable difference in energy and drive within 2–4 weeks of daily use. For full results, the recommended duration is 90 days — which is why the 6-bottle bundle is most popular.",
    },
    {
      question: "Is this actually a gummy? Why not a pill?",
      answer:
        "Yes, it's a chewable gummy. The format matters — research shows gummies have significantly better adherence than pill stacks. You'll actually remember to take it daily because it's pleasant, not a chore.",
    },
    {
      question: "What's the best value option?",
      answer:
        "The 6-bottle bundle at $49/bottle is the best deal — you get free US shipping, 2 bonus digital guides, and enough supply for a full 6-month run. Most men who see results order this the second time.",
    },
    {
      question: "What if it doesn't work for me?",
      answer:
        "You contact ClickBank — Spartamax's payment processor — and request a full refund. No forms, no return required. They process it within 5 business days. The 365-day window means you can literally try it for a year.",
    },
  ],
  footerDisclosure:
    "OfferSendly may earn a commission on purchases made through links on this page, at no extra cost to you. This page is not affiliated with or endorsed by Spartamax's manufacturer. Individual results vary. These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.",
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
