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
      { property: "og:description", content: "Offer Hub Pro is a conversion-focused affiliate marketing website designed to drive clicks and purchases." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "OfferSendly — Curated offers. Honest reviews." },
      { name: "description", content: "Offer Hub Pro is a conversion-focused affiliate marketing website designed to drive clicks and purchases." },
      { name: "twitter:description", content: "Offer Hub Pro is a conversion-focused affiliate marketing website designed to drive clicks and purchases." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d4e11153-ba39-4957-8e35-64ff3f097af9/id-preview-2ae8c5d3--3d53d802-28b5-4b13-b91d-6fc9f23e9587.lovable.app-1779346987016.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d4e11153-ba39-4957-8e35-64ff3f097af9/id-preview-2ae8c5d3--3d53d802-28b5-4b13-b91d-6fc9f23e9587.lovable.app-1779346987016.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
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
