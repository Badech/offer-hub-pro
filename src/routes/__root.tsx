import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-[var(--text-primary)]">404</h1>
        <h2 className="mt-4 text-[var(--text-primary)]">Page not found</h2>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-primary">Go home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="max-w-md text-center">
        <h2>This page didn't load</h2>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">
          Something went wrong on our end.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">
            Try again
          </button>
          <a href="/" className="btn-ghost">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OfferSendly — Curated offers. Honest reviews." },
      {
        name: "description",
        content:
          "Curated offers and honest reviews across health, finance, fitness, and lifestyle — only what's worth your money.",
      },
      { property: "og:title", content: "OfferSendly — Curated offers. Honest reviews." },
      {
        property: "og:description",
        content:
          "Curated offers and honest reviews across health, finance, fitness, and lifestyle — only what's worth your money.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "OfferSendly" },
      { property: "og:url", content: "https://offersendly.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      // Meta (Facebook) Business domain ownership verification. Required on
      // every page so the crawler can hit any URL and find it.
      {
        name: "facebook-domain-verification",
        content: "9odni0rlx7hf6pryalzo1cr88wnr9g",
      },
      { name: "twitter:site", content: "@offersendly" },
      { name: "twitter:title", content: "OfferSendly — Curated offers. Honest reviews." },
      {
        name: "twitter:description",
        content:
          "Curated offers and honest reviews across health, finance, fitness, and lifestyle — only what's worth your money.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://offersendly.com/" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Preconnect to Meta's pixel CDN so the first PageView tracks faster.
      { rel: "preconnect", href: "https://connect.facebook.net" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
      },
      // Fonts for the dark-editorial offer landing-page design
      // (Fraunces for serif headlines, DM Sans for body copy).
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// Meta Pixel ID. If you ever rotate it, change it here and nowhere else.
const META_PIXEL_ID = "1649617766249563";

// Meta-supplied Pixel snippet. Rendered directly into <head> via
// dangerouslySetInnerHTML so Meta Pixel Helper and Meta's crawler can
// detect it — TanStack's head().scripts puts inline scripts at the bottom
// of <body>, which Meta's tooling doesn't scan.
const META_PIXEL_SCRIPT = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;

// Meta Pixel noscript fallback URL — `&` characters in the query string
// trip up some JSX parsers when inlined as attribute text, so we bind it
// to a constant first.
const META_PIXEL_NOSCRIPT_SRC = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/*
          Meta Pixel base code MUST live in <head> (Meta's spec + their
          detection tooling looks here, not in <body>). dangerouslySetInnerHTML
          is the only way to inject an inline <script> that runs before
          hydration in TanStack Start.
        */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: META_PIXEL_SCRIPT }}
        />
      </head>
      <body>
        {/*
          Meta Pixel noscript fallback — Meta's spec wants this immediately
          after the opening <body> tag so a tracking pixel fires even when
          JavaScript is disabled.
        */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={META_PIXEL_NOSCRIPT_SRC}
            alt=""
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
