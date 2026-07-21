import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HeartHandshake, Download, Trash2, X, Check, HandHeart, Clock, Mail, Phone, Image as ImageIcon,
} from "lucide-react";
import { useDonations, updateDonationStatus, deleteDonation, type Donation, type DonationStatus } from "@/lib/submissionsStore";

export const Route = createFileRoute("/admin/donations")({
  component: DonationsAdmin,
});

const FILTERS: { key: "all" | DonationStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "received", label: "Received" },
  { key: "thanked", label: "Thanked" },
];

function DonationsAdmin() {
  const donations = useDonations();
  const [filter, setFilter] = useState<"all" | DonationStatus>("all");
  const [selected, setSelected] = useState<Donation | null>(null);

  const filtered = filter === "all" ? donations : donations.filter((d) => d.status === filter);
  const counts = {
    all: donations.length,
    pending: donations.filter((d) => d.status === "pending").length,
    received: donations.filter((d) => d.status === "received").length,
    thanked: donations.filter((d) => d.status === "thanked").length,
  };
  const total = donations.filter((d) => d.status !== "pending").reduce((s, d) => s + (d.amount || 0), 0);

  const exportCsv = () => {
    const cols = ["ref", "createdAt", "amount", "fullName", "email", "mobile", "pan", "status", "message"];
    const rows = donations.map((d) => cols.map((c) => `"${String((d as any)[c] ?? "").replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([[cols.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "btmc-donations.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Donations</h1>
          <p className="text-muted-foreground text-sm mt-1">Donations from the Donate page, including payment screenshots. Confirmed total: <span className="font-semibold text-maroon">₹{total.toLocaleString("en-IN")}</span></p>
        </div>
        <button onClick={exportCsv} disabled={!donations.length} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-gold disabled:opacity-50">
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${filter === f.key ? "bg-maroon text-cream border-maroon" : "bg-card border-border hover:border-gold"}`}>
            {f.label} <span className="opacity-70">({counts[f.key]})</span>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <HeartHandshake className="size-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No donations{filter !== "all" ? ` with status "${filter}"` : " yet"}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ref</th>
                  <th className="px-4 py-3 font-semibold">Donor</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setSelected(d)}>
                    <td className="px-4 py-3 font-mono text-xs">{d.ref}</td>
                    <td className="px-4 py-3"><div className="font-medium text-foreground">{d.fullName}</div><div className="text-xs text-muted-foreground">{d.email}</div></td>
                    <td className="px-4 py-3 font-semibold text-maroon">₹{d.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3"><StatusPill status={d.status} /></td>
                    <td className="px-4 py-3 text-right"><button onClick={(e) => { e.stopPropagation(); setSelected(d); }} className="text-gold-deep hover:text-maroon font-semibold text-xs">View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <DonationDrawer donation={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function DonationDrawer({ donation: d, onClose }: { donation: Donation; onClose: () => void }) {
  const setStatus = (s: DonationStatus) => { updateDonationStatus(d.id, s); onClose(); };
  const remove = () => { if (confirm("Delete this donation record?")) { deleteDonation(d.id); onClose(); } };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-maroon text-cream px-5 py-4 flex items-center justify-between">
          <div><div className="font-display text-xl">Donation</div><div className="text-xs opacity-80 font-mono">{d.ref}</div></div>
          <button onClick={onClose} aria-label="Close" className="size-9 grid place-items-center rounded hover:bg-cream/15"><X className="size-5" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <StatusPill status={d.status} />
            <span className="text-xs text-muted-foreground">{new Date(d.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-center rounded-xl border border-border py-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Amount</div>
            <div className="font-display text-4xl text-maroon">₹{d.amount.toLocaleString("en-IN")}</div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="font-display text-lg text-maroon">{d.fullName}</div>
            <div className="mt-2 space-y-1.5 text-sm text-foreground/80">
              <a href={`mailto:${d.email}`} className="flex items-center gap-2 hover:text-maroon"><Mail className="size-4 text-gold-deep" />{d.email}</a>
              <a href={`tel:${d.mobile}`} className="flex items-center gap-2 hover:text-maroon"><Phone className="size-4 text-gold-deep" />{d.mobile}</a>
              {d.pan && <div className="text-xs text-muted-foreground">PAN: {d.pan}</div>}
            </div>
          </div>
          {d.message && <div className="rounded-xl bg-secondary/50 p-4 text-sm"><div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Message</div>{d.message}</div>}
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Payment Screenshot</div>
            {d.proofDataUrl ? (
              <a href={d.proofDataUrl} target="_blank" rel="noreferrer"><img src={d.proofDataUrl} alt="Payment proof" className="w-full rounded-lg border border-border" /></a>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                <ImageIcon className="size-6 mx-auto mb-2 opacity-50" />No screenshot{d.proofName ? ` — ${d.proofName}` : ""}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button onClick={() => setStatus("received")} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700"><Check className="size-4" /> Mark Received</button>
            <button onClick={() => setStatus("thanked")} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-gold-deep text-white py-2.5 text-sm font-semibold hover:opacity-90"><HandHeart className="size-4" /> Thanked</button>
            <button onClick={() => setStatus("pending")} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border py-2.5 text-sm font-medium hover:border-gold"><Clock className="size-4" /> Pending</button>
            <button onClick={remove} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 text-destructive py-2.5 text-sm font-medium hover:bg-destructive/10"><Trash2 className="size-4" /> Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-gold/15 text-gold-deep",
    received: "bg-green-100 text-green-700",
    thanked: "bg-blue-100 text-blue-700",
  };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[status] ?? ""}`}>{status}</span>;
}
