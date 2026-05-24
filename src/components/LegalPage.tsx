import { Link } from "@tanstack/react-router";

// Shared layout for the four legal pages (Privacy / Terms / Disclaimer /
// Contact). Plain, indexable, no admin nav. Footer cross-links the others.

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-semibold text-[var(--brand)]">
            OnlineOnSale
          </Link>
          <Link to="/" className="text-[13px] text-[var(--text-secondary)] hover:underline">
            ← Home
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1>{title}</h1>
        {lastUpdated && (
          <p className="mt-2 text-[14px] text-[var(--text-muted)]">
            Last updated: {lastUpdated}
          </p>
        )}
        <div className="prose mt-8 text-[15px] text-[var(--text-secondary)] leading-relaxed space-y-5">
          {children}
        </div>
      </main>
      <footer className="border-t border-[var(--border)] mt-12">
        <div className="max-w-3xl mx-auto px-6 py-6 text-center text-[12px] text-[var(--text-muted)]">
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/disclaimer" className="hover:underline">Disclaimer</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
          <p className="mt-3">© {new Date().getFullYear()} OnlineOnSale</p>
        </div>
      </footer>
    </div>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[var(--brand)] text-[18px] font-semibold mt-8 mb-2">{children}</h3>
  );
}
