import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  { to: "/offers", label: "Top Offers" },
  { to: "/how-we-review", label: "How We Review" },
  { to: "/about", label: "About" },
];

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-[20px] font-semibold text-[var(--accent)] tracking-tight">
            OnlineOnSale
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-[15px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline underline-offset-4"
              >
                {l.label}
              </Link>
            ))}
            <Link to="/search" aria-label="Search" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              <Search className="w-5 h-5" />
            </Link>
          </nav>
          <button
            className="md:hidden text-[var(--text-primary)]"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <span className="text-[var(--accent)] font-semibold">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="text-[17px] text-[var(--text-primary)]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/search"
                onClick={() => setOpen(false)}
                className="text-[17px] text-[var(--text-primary)]"
              >
                Search
              </Link>
            </nav>
          </aside>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-24">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <div className="text-[var(--accent)] font-semibold text-[18px]">OnlineOnSale</div>
            <p className="text-[14px] text-[var(--text-secondary)] mt-3 leading-relaxed">
              Curated offers. Honest reviews. One click to get started.
            </p>
          </div>
          <FooterCol
            title="Explore"
            links={[
              { to: "/", label: "Home" },
              { to: "/offers", label: "All Offers" },
              { to: "/search", label: "Search" },
            ]}
          />
          <FooterCol
            title="Trust"
            links={[
              { to: "/how-we-review", label: "How We Review" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { to: "/privacy", label: "Privacy" },
              { to: "/terms", label: "Terms" },
              { to: "/disclosure", label: "Affiliate Disclosure" },
              { to: "/disclaimer", label: "Disclaimer" },
            ]}
          />
        </div>
        <div className="border-t border-[var(--border)] py-6 px-6 text-[13px] text-[var(--text-muted)] text-center">
          © 2026 OnlineOnSale · All rights reserved · Disclosure: OnlineOnSale earns commissions from
          purchases made through links on this site.
        </div>
      </footer>
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ to: string; label: string }>;
}) {
  return (
    <div>
      <div className="text-[13px] uppercase tracking-wider text-[var(--text-muted)] mb-4">
        {title}
      </div>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
