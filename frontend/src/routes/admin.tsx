import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, CalendarHeart, Inbox, LogOut, ExternalLink, Lock, Loader2, Menu, X, Gem, ShoppingBag, HeartHandshake, Mail, Users, Settings } from "lucide-react";
import { useIsAuthed, login, logout } from "@/lib/charityStore";
import { resetOrdersSession } from "@/lib/shopStore";
import { resetSubmissionsSession } from "@/lib/submissionsStore";
import logo from "@/assets/btmc-logo.jpg";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — BTMC Foundation India" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const NAV_SECTIONS = [
  {
    heading: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    heading: "Charity Events",
    items: [
      { to: "/admin/charity-events", label: "Manage Events", icon: CalendarHeart },
      { to: "/admin/bookings", label: "Bookings", icon: Inbox },
    ],
  },
  {
    heading: "Healing Items",
    items: [
      { to: "/admin/healing-items", label: "Products", icon: Gem },
      { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
    ],
  },
  {
    heading: "Inbox",
    items: [
      { to: "/admin/donations", label: "Donations", icon: HeartHandshake },
      { to: "/admin/messages", label: "Messages", icon: Mail },
    ],
  },
  {
    heading: "Content",
    items: [
      { to: "/admin/team", label: "Team", icon: Users },
      { to: "/admin/settings", label: "Site Settings", icon: Settings },
    ],
  },
];

function AdminLayout() {
  const authed = useIsAuthed();
  const [mounted, setMounted] = useState(false);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => setMounted(true), []);

  // Avoid SSR/hydration flash — auth state only exists in the browser.
  if (!mounted) {
    return (
      <div className="min-h-screen grid place-items-center bg-secondary/40">
        <Loader2 className="size-6 animate-spin text-maroon" />
      </div>
    );
  }

  if (!authed) return <AdminLogin />;

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Fixed sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 z-30">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <aside className="relative w-64 max-w-[80%]">
            <Sidebar onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-maroon text-cream flex items-center gap-3 px-4 py-3">
          <button onClick={() => setDrawer(true)} aria-label="Open menu" className="size-9 grid place-items-center rounded hover:bg-cream/15">
            <Menu className="size-5" />
          </button>
          <span className="font-display text-lg">BTMC Admin</span>
        </div>

        <main className="flex-1 px-5 md:px-8 py-8">
          <Outlet />
        </main>
        <footer className="border-t border-border py-4 px-8 text-center text-xs text-muted-foreground">
          BTMC Foundation India — Admin Panel
        </footer>
      </div>
    </div>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname.startsWith(to));

  return (
    <div className="flex flex-col w-full h-full bg-maroon text-cream border-r border-maroon-deep/40">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-16 shrink-0 border-b border-cream/10">
        <img src={logo} alt="" className="size-9 rounded bg-white object-contain p-0.5" />
        <div className="leading-tight">
          <div className="font-display text-lg">BTMC Admin</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Control Panel</div>
        </div>
        {onNavigate && (
          <button onClick={onNavigate} aria-label="Close menu" className="ml-auto size-8 grid place-items-center rounded hover:bg-cream/15">
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading} className="mb-4 last:mb-0">
            <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.2em] text-cream/50 font-semibold">{section.heading}</div>
            <div className="space-y-1">
              {section.items.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive(n.to, (n as { exact?: boolean }).exact)
                      ? "bg-cream/15 text-gold shadow-inner"
                      : "text-cream/80 hover:bg-cream/10 hover:text-cream"
                  }`}
                >
                  <n.icon className="size-4 shrink-0" /> {n.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="p-3 border-t border-cream/10 space-y-1">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream/80 hover:bg-cream/10 hover:text-cream transition">
          <ExternalLink className="size-4" /> View site
        </a>
        <button onClick={() => { logout(); resetOrdersSession(); resetSubmissionsSession(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cream/80 hover:bg-cream/10 hover:text-cream transition">
          <LogOut className="size-4" /> Logout
        </button>
      </div>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  const inputCls = "mt-1 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <div className="min-h-screen grid place-items-center bg-secondary/40 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-soft)]">
        <div className="size-14 mx-auto grid place-items-center rounded-full bg-maroon text-gold">
          <Lock className="size-6" />
        </div>
        <h1 className="font-display text-2xl text-maroon text-center mt-4">Admin Login</h1>
        <p className="text-sm text-muted-foreground text-center mt-1">Sign in to manage the site.</p>

        <div className="mt-6">
          <label className="text-sm font-semibold text-foreground/80">Email</label>
          <input
            type="email"
            autoFocus
            autoComplete="username"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            placeholder="admin@btmcfoundation.in"
            className={inputCls}
          />
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold text-foreground/80">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            className={inputCls}
          />
        </div>

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full justify-center mt-5 py-3 disabled:opacity-70">
          {busy ? (<><Loader2 className="size-4 animate-spin" /> Signing in…</>) : "Sign In"}
        </button>
      </form>
    </div>
  );
}
