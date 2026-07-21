import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarHeart, Inbox, Gem, ShoppingBag, HeartHandshake, Mail, ArrowRight, Plus,
  TrendingUp, IndianRupee, Users,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { useEvents, useBookings } from "@/lib/charityStore";
import { useProducts, useOrders } from "@/lib/shopStore";
import { useDonations, useMessages } from "@/lib/submissionsStore";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const C = {
  maroon: "#6d2b2b",
  gold: "#c99a3b",
  saffron: "#d98a3d",
  green: "#16a34a",
  blue: "#2563eb",
  red: "#dc2626",
  gray: "#cbd5e1",
  ink: "#57534e",
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function Dashboard() {
  const events = useEvents();
  const bookings = useBookings();
  const products = useProducts();
  const orders = useOrders();
  const donations = useDonations();
  const messages = useMessages();

  /* ---- KPIs ---- */
  const bookingRevenue = bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + (b.amount || 0), 0);
  const orderRevenue = orders.filter((o) => o.status === "paid" || o.status === "shipped").reduce((s, o) => s + (o.amount || 0), 0);
  const donationRevenue = donations.filter((d) => d.status !== "pending").reduce((s, d) => s + (d.amount || 0), 0);
  const totalRevenue = bookingRevenue + orderRevenue + donationRevenue;

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const pendingDonations = donations.filter((d) => d.status === "pending").length;
  const newMessages = messages.filter((m) => m.status === "new").length;

  const kpis = [
    { label: "Total Revenue", value: inr(totalRevenue), sub: "confirmed + paid + received", icon: IndianRupee, to: "/admin/orders" as const, accent: C.green },
    { label: "Bookings", value: bookings.length, sub: `${pendingBookings} pending`, icon: Inbox, to: "/admin/bookings" as const, accent: C.maroon },
    { label: "Orders", value: orders.length, sub: `${pendingOrders} pending`, icon: ShoppingBag, to: "/admin/orders" as const, accent: C.saffron },
    { label: "Donations", value: donations.length, sub: `${pendingDonations} pending`, icon: HeartHandshake, to: "/admin/donations" as const, accent: C.gold },
    { label: "New Messages", value: newMessages, sub: `${messages.length} total`, icon: Mail, to: "/admin/messages" as const, accent: C.blue },
  ];

  /* ---- Revenue trend (last 30 days, gross incoming value) ---- */
  const trend = buildTrend([
    ...bookings.map((b) => ({ at: b.createdAt, amount: b.amount || 0 })),
    ...orders.map((o) => ({ at: o.createdAt, amount: o.amount || 0 })),
    ...donations.map((d) => ({ at: d.createdAt, amount: d.amount || 0 })),
  ]);
  const trendTotal = trend.reduce((s, d) => s + d.amount, 0);

  /* ---- Status pies ---- */
  const bookingPie = statusCounts(bookings, ["pending", "confirmed", "rejected"], {
    pending: C.gold, confirmed: C.green, rejected: C.red,
  });
  const orderPie = statusCounts(orders, ["pending", "paid", "shipped", "cancelled"], {
    pending: C.gold, paid: C.green, shipped: C.blue, cancelled: C.red,
  });

  /* ---- Submissions by type ---- */
  const byType = [
    { name: "Bookings", value: bookings.length, fill: C.maroon },
    { name: "Orders", value: orders.length, fill: C.saffron },
    { name: "Donations", value: donations.length, fill: C.gold },
    { name: "Messages", value: messages.length, fill: C.blue },
  ];

  /* ---- Recent activity ---- */
  const recent = buildActivity({ bookings, orders, donations, messages }).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Live overview of activity across the site.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/healing-items" search={{ new: true }} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-maroon hover:border-gold">
            <Plus className="size-4" /> Product
          </Link>
          <Link to="/admin/charity-events" search={{ new: true }} className="btn-primary">
            <Plus className="size-4" /> New Event
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to} className="group bg-card border border-border rounded-2xl p-5 hover:border-gold hover:shadow-[var(--shadow-soft)] transition">
            <div className="flex items-center justify-between">
              <div className="size-10 grid place-items-center rounded-lg" style={{ background: `${k.accent}1a`, color: k.accent }}>
                <k.icon className="size-5" />
              </div>
              <ArrowRight className="size-4 text-muted-foreground group-hover:text-gold-deep transition" />
            </div>
            <div className="font-display text-3xl text-maroon mt-4">{k.value}</div>
            <div className="text-sm font-medium text-foreground mt-1">{k.label}</div>
            <div className="text-xs text-muted-foreground">{k.sub}</div>
          </Link>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl text-maroon flex items-center gap-2"><TrendingUp className="size-5 text-gold-deep" /> Incoming value — last 30 days</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Gross value from bookings, orders and donations</p>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl text-maroon">{inr(trendTotal)}</div>
            <div className="text-xs text-muted-foreground">30-day total</div>
          </div>
        </div>
        {trendTotal === 0 ? (
          <EmptyChart label="No value recorded yet in the last 30 days." />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.gold} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={C.gold} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d8" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: C.ink }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                <YAxis tick={{ fontSize: 11, fill: C.ink }} tickLine={false} axisLine={false} width={54} tickFormatter={(v) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)} />
                <Tooltip formatter={(v: number) => [inr(v), "Value"]} labelStyle={{ color: C.maroon }} contentStyle={{ borderRadius: 10, border: "1px solid #e7e2d8", fontSize: 13 }} />
                <Area type="monotone" dataKey="amount" stroke={C.gold} strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <StatusPieCard title="Bookings by status" total={bookings.length} data={bookingPie} />
        <StatusPieCard title="Orders by status" total={orders.length} data={orderPie} />
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display text-xl text-maroon mb-1">Submissions by type</h2>
          <p className="text-xs text-muted-foreground mb-3">All-time counts</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byType} margin={{ top: 5, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e2d8" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.ink }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.ink }} tickLine={false} axisLine={false} allowDecimals={false} width={30} />
                <Tooltip cursor={{ fill: "#f5f0e6" }} contentStyle={{ borderRadius: 10, border: "1px solid #e7e2d8", fontSize: 13 }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {byType.map((b) => <Cell key={b.name} fill={b.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Catalog + recent activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display text-xl text-maroon mb-4">Catalog</h2>
          <div className="space-y-3">
            <CatalogRow icon={CalendarHeart} label="Charity Events" value={events.length} sub={`${events.filter((e) => e.status === "upcoming").length} upcoming`} to="/admin/charity-events" />
            <CatalogRow icon={Gem} label="Healing Products" value={products.length} sub="in the shop" to="/admin/healing-items" />
            <CatalogRow icon={Users} label="Team Members" value={undefined} sub="manage team" to="/admin/team" />
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-display text-xl text-maroon">Recent Activity</h2>
          </div>
          {recent.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">No activity yet. Submissions will appear here as they arrive.</div>
          ) : (
            <div className="divide-y divide-border">
              {recent.map((a) => (
                <Link key={a.key} to={a.to} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/40 transition">
                  <div className="size-9 shrink-0 grid place-items-center rounded-lg" style={{ background: `${a.color}1a`, color: a.color }}>
                    <a.icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.subtitle}</div>
                  </div>
                  {a.amount ? <div className="text-sm font-semibold text-maroon">{inr(a.amount)}</div> : null}
                  <div className="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">{timeAgo(a.at)}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- pieces ---------------- */

function StatusPieCard({ title, total, data }: { title: string; total: number; data: { name: string; value: number; fill: string }[] }) {
  const has = data.some((d) => d.value > 0);
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h2 className="font-display text-xl text-maroon mb-1">{title}</h2>
      <p className="text-xs text-muted-foreground mb-3">{total} total</p>
      {!has ? (
        <EmptyChart label="No data yet." small />
      ) : (
        <div className="flex items-center gap-3">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={2} stroke="none">
                  {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e7e2d8", fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex-1 space-y-1.5 text-sm">
            {data.map((d) => (
              <li key={d.name} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: d.fill }} />
                <span className="capitalize text-foreground/80">{d.name}</span>
                <span className="ml-auto font-semibold text-maroon">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function CatalogRow({ icon: Icon, label, value, sub, to }: { icon: typeof CalendarHeart; label: string; value?: number; sub: string; to: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-gold transition">
      <div className="size-9 grid place-items-center rounded-lg bg-secondary text-gold-deep"><Icon className="size-4" /></div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-maroon">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      {value !== undefined && <div className="font-display text-xl text-maroon">{value}</div>}
      <ArrowRight className="size-4 text-muted-foreground" />
    </Link>
  );
}

function EmptyChart({ label, small }: { label: string; small?: boolean }) {
  return (
    <div className={`grid place-items-center text-center text-sm text-muted-foreground rounded-lg bg-secondary/30 ${small ? "h-40" : "h-64"}`}>
      {label}
    </div>
  );
}

/* ---------------- data helpers ---------------- */

function buildTrend(items: { at: string; amount: number }[]) {
  const days = 30;
  const buckets: { key: string; label: string; amount: number }[] = [];
  const idx = new Map<string, number>();
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    idx.set(key, buckets.length);
    buckets.push({ key, label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), amount: 0 });
  }
  for (const it of items) {
    if (!it.at) continue;
    const key = new Date(it.at).toISOString().slice(0, 10);
    const b = idx.get(key);
    if (b !== undefined) buckets[b].amount += it.amount;
  }
  return buckets;
}

function statusCounts<T extends { status: string }>(items: T[], order: string[], colors: Record<string, string>) {
  return order.map((name) => ({
    name,
    value: items.filter((i) => i.status === name).length,
    fill: colors[name],
  }));
}

function buildActivity({ bookings, orders, donations, messages }: {
  bookings: any[]; orders: any[]; donations: any[]; messages: any[];
}) {
  const items = [
    ...bookings.map((b) => ({ key: "b" + b.id, at: b.createdAt, icon: Inbox, color: C.maroon, to: "/admin/bookings" as const, title: `Booking · ${b.fullName}`, subtitle: b.eventTitle || b.sessionLabel, amount: b.amount })),
    ...orders.map((o) => ({ key: "o" + o.id, at: o.createdAt, icon: ShoppingBag, color: C.saffron, to: "/admin/orders" as const, title: `Order · ${o.fullName}`, subtitle: o.productName, amount: o.amount })),
    ...donations.map((d) => ({ key: "d" + d.id, at: d.createdAt, icon: HeartHandshake, color: C.gold, to: "/admin/donations" as const, title: `Donation · ${d.fullName}`, subtitle: d.message || "General donation", amount: d.amount })),
    ...messages.map((m) => ({ key: "m" + m.id, at: m.createdAt, icon: Mail, color: C.blue, to: "/admin/messages" as const, title: `Message · ${m.name}`, subtitle: m.subject || m.message, amount: 0 })),
  ];
  return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
