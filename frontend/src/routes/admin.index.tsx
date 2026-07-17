import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarHeart, Inbox, Gem, ShoppingBag, CheckCircle2, ArrowRight, Plus } from "lucide-react";
import { useEvents, useBookings } from "@/lib/charityStore";
import { useProducts, useOrders } from "@/lib/shopStore";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const events = useEvents();
  const bookings = useBookings();
  const products = useProducts();
  const orders = useOrders();

  const upcoming = events.filter((e) => e.status === "upcoming").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue =
    bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + (b.amount || 0), 0) +
    orders.filter((o) => o.status === "paid" || o.status === "shipped").reduce((s, o) => s + (o.amount || 0), 0);

  const stats = [
    { label: "Charity Events", value: events.length, sub: `${upcoming} upcoming`, icon: CalendarHeart, to: "/admin/charity-events" },
    { label: "Total Bookings", value: bookings.length, sub: `${pending} pending`, icon: Inbox, to: "/admin/bookings" },
    { label: "Healing Products", value: products.length, sub: "in the shop", icon: Gem, to: "/admin/healing-items" },
    { label: "Orders", value: orders.length, sub: `${pendingOrders} pending`, icon: ShoppingBag, to: "/admin/orders" },
    { label: "Confirmed Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, sub: "bookings + orders", icon: CheckCircle2, to: "/admin/orders" },
  ];

  const recent = bookings.slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your charity events and booking submissions.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/healing-items" search={{ new: true }} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-maroon hover:border-gold">
            <Plus className="size-4" /> Add Product
          </Link>
          <Link to="/admin/charity-events" search={{ new: true }} className="btn-primary">
            <Plus className="size-4" /> New Event
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="bg-card border border-border rounded-2xl p-5 hover:border-gold hover:shadow-[var(--shadow-soft)] transition">
            <div className="flex items-center justify-between">
              <div className="size-10 grid place-items-center rounded-lg bg-secondary text-gold-deep"><s.icon className="size-5" /></div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </div>
            <div className="font-display text-3xl text-maroon mt-4">{s.value}</div>
            <div className="text-sm font-medium text-foreground mt-1">{s.label}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display text-xl text-maroon">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm font-semibold text-gold-deep hover:text-maroon inline-flex items-center gap-1">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No bookings yet. Submissions from the event booking form will appear here.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((b) => (
              <Link key={b.id} to="/admin/bookings" className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/40 transition">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">{b.fullName} <span className="text-muted-foreground font-normal">· {b.sessionLabel}</span></div>
                  <div className="text-xs text-muted-foreground truncate">{b.eventTitle}</div>
                </div>
                <div className="text-sm font-semibold text-maroon">₹{b.amount.toLocaleString("en-IN")}</div>
                <StatusPill status={b.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-gold/15 text-gold-deep",
    confirmed: "bg-green-100 text-green-700",
    rejected: "bg-destructive/10 text-destructive",
  };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[status] ?? ""}`}>{status}</span>;
}
