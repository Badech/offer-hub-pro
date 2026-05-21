export interface Offer {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  tags: string[];
  affiliateUrl: string;
  heroImage: string;
  bottleImage?: string;
  badge?: string;
  price: { from: number; to: number; unit: string };
  guarantee: { days: number; label: string };
  rating?: { score: number; label: string };
  featured: boolean;
  publishedAt: string;
  seo: { title: string; description: string; ogImage: string };
  hero: { headline: string; subheadline: string; ctaLabel: string };
  problem: {
    heading: string;
    points: Array<{ icon: string; label: string; description: string }>;
  };
  solution: { heading: string; body: string };
  ingredients?: Array<{ name: string; image?: string; benefit: string }>;
  beforeAfter: Array<{ before: string; after: string }>;
  testimonials: Array<{
    name: string;
    age: number;
    initials: string;
    rating: number;
    quote: string;
    verified: boolean;
  }>;
  faq: Array<{ question: string; answer: string }>;
  vendor: string;
  productForm?: string;
}

export const offers: Offer[] = [
  {
    slug: "spartamax",
    title: "Spartamax",
    tagline:
      "The daily gummy helping men over 40 reclaim their stamina and confidence.",
    category: "Health & Wellness",
    tags: ["Male Performance", "Natural", "Gummies", "Testosterone Support"],
    affiliateUrl: "https://032b52jyrbl9skep2zzecgmq3e.hop.clickbank.net",
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
      title: "Spartamax Review — A Daily Gummy For Men Over 40 | OfferSendly",
      description:
        "Spartamax combines 7 research-backed ingredients including Tongkat Ali, Ashwagandha, and Maca Root to support stamina and confidence. Backed by a 365-day guarantee.",
      ogImage: "",
    },
    hero: {
      headline:
        "The Daily Gummy Helping Men Over 40 Feel Like Themselves Again",
      subheadline:
        "Spartamax combines 7 research-backed ingredients — including Tongkat Ali, Ashwagandha, and Maca Root — to support stamina, blood flow, and confidence naturally.",
      ctaLabel: "Claim Your Discounted Spartamax →",
    },
    problem: {
      heading: "If you're past 40, you've probably noticed the change.",
      points: [
        {
          icon: "BatteryLow",
          label: "Energy that fades by mid-afternoon",
          description:
            "You used to power through the day. Now the 3pm slump feels inevitable.",
        },
        {
          icon: "Activity",
          label: "Stamina that isn't what it was",
          description:
            "In the gym, in the bedroom — recovery takes longer and output drops.",
        },
        {
          icon: "CloudFog",
          label: "Brain fog when you need to focus",
          description:
            "The sharpness you took for granted in your 30s feels harder to summon.",
        },
        {
          icon: "TrendingDown",
          label: "Confidence quietly slipping",
          description:
            "Small changes add up — and the man in the mirror feels unfamiliar.",
        },
      ],
    },
    solution: {
      heading: "A simple daily ritual — not another prescription.",
      body: "Spartamax is a chewable gummy taken once a day. No pills to swallow, no doctor visits, no awkward conversations. Each gummy delivers a clinically-informed dose of 7 botanical and amino-acid ingredients chosen for their role in supporting healthy testosterone, blood flow, and energy in men over 40. Designed as a daily ritual you'll actually stick to.",
    },
    ingredients: [
      {
        name: "L-Arginine",
        benefit:
          "An amino acid that supports nitric oxide production, which helps maintain healthy blood flow throughout the body.",
      },
      {
        name: "Tongkat Ali",
        benefit:
          "A Southeast Asian botanical traditionally used to support healthy testosterone levels and male vitality.",
      },
      {
        name: "Maca Root",
        benefit:
          "A Peruvian adaptogen used for centuries to support stamina, mood, and balanced energy.",
      },
      {
        name: "Ashwagandha",
        benefit:
          "An adaptogenic herb shown in studies to support stress response, recovery, and hormonal balance.",
      },
      {
        name: "Horny Goat Weed",
        benefit:
          "Contains icariin, a compound traditionally used to support circulation and male performance.",
      },
      {
        name: "Beet Root",
        benefit:
          "A natural source of dietary nitrates that support nitric oxide and cardiovascular function.",
      },
      {
        name: "Grape Seed Extract",
        benefit:
          "Rich in antioxidants that support vascular health and protect cells from oxidative stress.",
      },
    ],
    beforeAfter: [
      {
        before: "Tired by 3pm. Skipping workouts. Coffee just isn't cutting it.",
        after:
          "Steady energy from morning meetings through evening — without the crash.",
      },
      {
        before: "Avoiding intimacy. Making excuses. Feeling disconnected.",
        after:
          "Showing up with confidence. Reconnecting with a partner you love.",
      },
      {
        before: "Hitting plateaus in the gym. Slower recovery week after week.",
        after:
          "Pushing through workouts and feeling recovered the next morning.",
      },
    ],
    testimonials: [
      {
        name: "Marcus T.",
        age: 47,
        initials: "MT",
        rating: 5,
        quote:
          "I was skeptical about gummies — figured it was a gimmick. Three weeks in, my energy in the afternoon is back to where it was a decade ago. Wife noticed before I did.",
        verified: true,
      },
      {
        name: "David R.",
        age: 52,
        initials: "DR",
        rating: 4,
        quote:
          "Took about a month to feel the difference, but the difference is real. Workouts feel like workouts again, not punishment. Sticking with it.",
        verified: true,
      },
      {
        name: "James K.",
        age: 44,
        initials: "JK",
        rating: 5,
        quote:
          "The simplicity is what sold me. Two gummies with coffee and I'm done thinking about it. After 6 weeks I feel sharper and just more present.",
        verified: true,
      },
    ],
    faq: [
      {
        question: "How long until I notice results?",
        answer:
          "Most men report noticeable changes in energy and stamina within 3 to 4 weeks of consistent daily use. Full benefits typically build over 60 to 90 days as the ingredients reach steady levels.",
      },
      {
        question: "Is Spartamax safe to take daily?",
        answer:
          "Yes. Spartamax is made with botanical and amino-acid ingredients in a facility registered with the FDA. As with any supplement, consult your doctor if you take medications or have a medical condition.",
      },
      {
        question: "Do I need a prescription?",
        answer:
          "No. Spartamax is an over-the-counter dietary supplement. No prescription or doctor visit is required.",
      },
      {
        question: "What if it doesn't work for me?",
        answer:
          "Every order is covered by a 365-day money-back guarantee. If you're not satisfied for any reason, contact the vendor for a full refund — even on empty bottles.",
      },
      {
        question: "How is my order shipped?",
        answer:
          "Orders ship discreetly from a US fulfillment center. Free US shipping is included on orders of 3 bottles or more.",
      },
      {
        question: "Is my purchase secure?",
        answer:
          "Yes. All transactions are processed through ClickBank, one of the largest and most established digital retailers, with bank-level encryption and buyer protection.",
      },
    ],
  },
  {
    slug: "ironforge-pro",
    title: "IronForge Pro",
    tagline: "12-week strength program engineered for men returning to the gym after 35.",
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
    seo: { title: "IronForge Pro Review | OfferSendly", description: "A 12-week strength program for men 35+.", ogImage: "" },
    hero: { headline: "Build Real Strength In 12 Weeks — Without Wrecking Your Joints", subheadline: "A progressive program designed for the body you have now, not the one you had at 25.", ctaLabel: "Get IronForge Pro →" },
    problem: { heading: "Why most programs fail men over 35.", points: [] },
    solution: { heading: "Smarter loading. Better recovery.", body: "IronForge Pro is a 12-week strength system built around joint-friendly progressions, intelligent deloads, and a recovery framework that respects how your body actually adapts after 35." },
    beforeAfter: [],
    testimonials: [],
    faq: [],
  },
  {
    slug: "wealthcompass",
    title: "WealthCompass",
    tagline: "A no-nonsense personal finance system for people who hate budgeting apps.",
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
    seo: { title: "WealthCompass Review | OfferSendly", description: "Simple personal finance for real life.", ogImage: "" },
    hero: { headline: "Finally Get Your Money Organized — In One Weekend", subheadline: "A pen-and-paper friendly system that replaces five apps and a spreadsheet.", ctaLabel: "Get WealthCompass →" },
    problem: { heading: "", points: [] },
    solution: { heading: "", body: "" },
    beforeAfter: [],
    testimonials: [],
    faq: [],
  },
  {
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
    seo: { title: "Lumea Renewal Serum Review | OfferSendly", description: "Peptide serum for mature skin.", ogImage: "" },
    hero: { headline: "Wake Up To Smoother, Brighter Skin", subheadline: "Lumea pairs clinical-grade peptides with botanicals proven to support skin renewal overnight.", ctaLabel: "Try Lumea →" },
    problem: { heading: "", points: [] },
    solution: { heading: "", body: "" },
    beforeAfter: [],
    testimonials: [],
    faq: [],
  },
  {
    slug: "focusforge-ai",
    title: "FocusForge AI",
    tagline: "An AI-powered deep work assistant that blocks distractions and plans your day.",
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
    seo: { title: "FocusForge AI Review | OfferSendly", description: "AI deep-work assistant.", ogImage: "" },
    hero: { headline: "Stop Reacting. Start Producing.", subheadline: "FocusForge plans your most important work and protects the hours it takes to do it.", ctaLabel: "Get FocusForge AI →" },
    problem: { heading: "", points: [] },
    solution: { heading: "", body: "" },
    beforeAfter: [],
    testimonials: [],
    faq: [],
  },
];

export const categories = [
  "Health & Wellness",
  "Fitness",
  "Finance",
  "Digital Courses",
  "Skincare",
  "Software",
];

export function getOffer(slug: string) {
  return offers.find((o) => o.slug === slug);
}

export function getOffersByCategory(category: string) {
  return offers.filter((o) => o.category === category);
}
