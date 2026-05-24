import { createFileRoute, Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { checkAuth, logout } from "@/lib/server-functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Allow /admin/login without auth; everything else requires it.
    if (location.pathname === "/admin/login") return;
    const { authenticated } = await checkAuth();
    if (!authenticated) {
      throw redirect({ to: "/admin/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin — OnlineOnSale" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const onLogout = async () => {
    await logout();
    router.navigate({ to: "/admin/login" });
  };
  const isLogin = router.state.location.pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {!isLogin && (
        <header className="section-dark">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link to="/admin" className="font-semibold text-white text-[15px]">
              OnlineOnSale Admin
            </Link>
            <div className="flex items-center gap-4 text-[14px]">
              <Link to="/admin" className="text-white/80 hover:text-white">
                Offers
              </Link>
              <Link to="/admin/offers/new" className="text-white/80 hover:text-white">
                + New
              </Link>
              <Link to="/" target="_blank" className="text-white/80 hover:text-white">
                View site ↗
              </Link>
              <button
                onClick={onLogout}
                className="text-[13px] rounded-md border border-white/20 px-3 py-1 text-white hover:bg-white/10"
              >
                Log out
              </button>
            </div>
          </div>
        </header>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
