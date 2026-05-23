import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { deleteOffer, fetchOffers } from "@/lib/server-functions";

export const Route = createFileRoute("/admin/")({
  staleTime: 0,
  shouldReload: true,
  loader: async () => ({ offers: await fetchOffers() }),
  component: AdminOffersList,
});

function AdminOffersList() {
  const { offers } = Route.useLoaderData();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const onDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(slug);
    try {
      await deleteOffer({ data: slug });
      await router.invalidate();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[32px]">Offers</h1>
        <Link to="/admin/offers/new" className="btn-primary">+ New Offer</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-[14px]">
          <thead className="bg-[var(--surface)] text-[var(--text-secondary)] text-left text-[12px] uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.slug} className="border-t border-[var(--border)]">
                <td className="px-5 py-3 font-medium text-[var(--brand)]">{o.title}</td>
                <td className="px-5 py-3 text-[var(--text-secondary)] font-mono text-[12px]">{o.slug}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link
                    to="/admin/offers/$slug/edit"
                    params={{ slug: o.slug }}
                    className="text-[var(--accent)] font-medium hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <Link
                    to="/offers/$slug"
                    params={{ slug: o.slug }}
                    target="_blank"
                    className="text-[var(--text-secondary)] hover:underline mr-4"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => onDelete(o.slug, o.title)}
                    disabled={busy === o.slug}
                    className="text-[#b91c1c] hover:underline disabled:opacity-50"
                  >
                    {busy === o.slug ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {offers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-[var(--text-secondary)]">
                  No offers yet. Paste your first HTML to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
