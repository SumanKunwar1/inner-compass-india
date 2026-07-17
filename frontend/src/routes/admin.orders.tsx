import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShoppingBag, Download, Trash2, X, Check, Ban, Clock, Truck, Mail, Phone, Image as ImageIcon,
} from "lucide-react";
import { useOrders, updateOrderStatus, deleteOrder, type Order, type OrderStatus } from "@/lib/shopStore";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersAdmin,
});

const FILTERS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
  { key: "shipped", label: "Shipped" },
  { key: "cancelled", label: "Cancelled" },
];

function OrdersAdmin() {
  const orders = useOrders();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    paid: orders.filter((o) => o.status === "paid").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const exportCsv = () => {
    const cols = ["ref", "createdAt", "productName", "amount", "fullName", "email", "mobile", "pan", "status", "message"];
    const rows = orders.map((o) => cols.map((c) => `"${String((o as any)[c] ?? "").replace(/"/g, '""')}"`).join(","));
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "btmc-orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Healing item orders placed from the shop, including payment screenshots.</p>
        </div>
        <button onClick={exportCsv} disabled={!orders.length} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-gold disabled:opacity-50">
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${filter === f.key ? "bg-maroon text-cream border-maroon" : "bg-card border-border hover:border-gold"}`}
          >
            {f.label} <span className="opacity-70">({counts[f.key]})</span>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="size-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No orders{filter !== "all" ? ` with status "${filter}"` : " yet"}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ref</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Product</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setSelected(o)}>
                    <td className="px-4 py-3 font-mono text-xs">{o.ref}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{o.fullName}</div>
                      <div className="text-xs text-muted-foreground">{o.email}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{o.productName}</td>
                    <td className="px-4 py-3 font-semibold text-maroon">₹{o.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(o); }} className="text-gold-deep hover:text-maroon font-semibold text-xs">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <OrderDrawer order={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function OrderDrawer({ order: o, onClose }: { order: Order; onClose: () => void }) {
  const setStatus = (s: OrderStatus) => { updateOrderStatus(o.id, s); onClose(); };
  const remove = () => { if (confirm("Delete this order permanently?")) { deleteOrder(o.id); onClose(); } };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-maroon text-cream px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-display text-xl">Order Detail</div>
            <div className="text-xs opacity-80 font-mono">{o.ref}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="size-9 grid place-items-center rounded hover:bg-cream/15"><X className="size-5" /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <StatusPill status={o.status} />
            <span className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</span>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="font-display text-lg text-maroon">{o.fullName}</div>
            <div className="mt-2 space-y-1.5 text-sm text-foreground/80">
              <a href={`mailto:${o.email}`} className="flex items-center gap-2 hover:text-maroon"><Mail className="size-4 text-gold-deep" />{o.email}</a>
              <a href={`tel:${o.mobile}`} className="flex items-center gap-2 hover:text-maroon"><Phone className="size-4 text-gold-deep" />{o.mobile}</a>
            </div>
          </div>

          <dl className="rounded-xl border border-border divide-y divide-border text-sm">
            <Row k="Product" v={o.productName} />
            <Row k="Amount" v={`₹${o.amount.toLocaleString("en-IN")}`} />
            {o.pan && <Row k="PAN" v={o.pan} />}
          </dl>

          {o.message && <div className="rounded-xl bg-secondary/50 p-4 text-sm"><div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Message</div>{o.message}</div>}

          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Payment Screenshot</div>
            {o.proofDataUrl ? (
              <a href={o.proofDataUrl} target="_blank" rel="noreferrer">
                <img src={o.proofDataUrl} alt="Payment proof" className="w-full rounded-lg border border-border" />
              </a>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                <ImageIcon className="size-6 mx-auto mb-2 opacity-50" />
                No screenshot{o.proofName ? ` — ${o.proofName}` : ""}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button onClick={() => setStatus("paid")} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700"><Check className="size-4" /> Mark Paid</button>
            <button onClick={() => setStatus("shipped")} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-maroon text-cream py-2.5 text-sm font-semibold hover:bg-maroon-deep"><Truck className="size-4" /> Mark Shipped</button>
            <button onClick={() => setStatus("pending")} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border py-2.5 text-sm font-medium hover:border-gold"><Clock className="size-4" /> Pending</button>
            <button onClick={() => setStatus("cancelled")} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 text-destructive py-2.5 text-sm font-medium hover:bg-destructive/10"><Ban className="size-4" /> Cancel</button>
            <button onClick={remove} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 text-destructive py-2.5 text-sm font-medium hover:bg-destructive/10"><Trash2 className="size-4" /> Delete Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 px-4 py-2.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-foreground text-right">{v}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-gold/15 text-gold-deep",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    cancelled: "bg-destructive/10 text-destructive",
  };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[status] ?? ""}`}>{status}</span>;
}
