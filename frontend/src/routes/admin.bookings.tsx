import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Inbox, Download, Trash2, X, Check, Ban, Clock, Mail, Phone, MapPin, Image as ImageIcon,
} from "lucide-react";
import { useBookings, updateBookingStatus, deleteBooking, type Booking, type BookingStatus } from "@/lib/charityStore";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsAdmin,
});

const FILTERS: { key: "all" | BookingStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "rejected", label: "Rejected" },
];

function BookingsAdmin() {
  const bookings = useBookings();
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const counts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    rejected: bookings.filter((b) => b.status === "rejected").length,
  };

  const exportCsv = () => {
    const cols = ["ref", "createdAt", "eventTitle", "sessionLabel", "seats", "amount", "fullName", "email", "mobile", "whatsapp", "city", "status", "message"];
    const rows = bookings.map((b) => cols.map((c) => `"${String((b as any)[c] ?? "").replace(/"/g, '""')}"`).join(","));
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "btmc-bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Bookings</h1>
          <p className="text-muted-foreground text-sm mt-1">Booking submissions from the charity event form, including payment screenshots.</p>
        </div>
        <button onClick={exportCsv} disabled={!bookings.length} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-gold disabled:opacity-50">
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
            <Inbox className="size-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">No bookings{filter !== "all" ? ` with status "${filter}"` : " yet"}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ref</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Session</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setSelected(b)}>
                    <td className="px-4 py-3 font-mono text-xs">{b.ref}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{b.fullName}</div>
                      <div className="text-xs text-muted-foreground">{b.city}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{b.sessionLabel} × {b.seats}</td>
                    <td className="px-4 py-3 font-semibold text-maroon">₹{b.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(b); }} className="text-gold-deep hover:text-maroon font-semibold text-xs">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <BookingDrawer booking={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function BookingDrawer({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const b = booking;
  const setStatus = (s: BookingStatus) => { updateBookingStatus(b.id, s); onClose(); };
  const remove = () => { if (confirm("Delete this booking permanently?")) { deleteBooking(b.id); onClose(); } };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-maroon text-cream px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-display text-xl">Booking Detail</div>
            <div className="text-xs opacity-80 font-mono">{b.ref}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="size-9 grid place-items-center rounded hover:bg-cream/15"><X className="size-5" /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <StatusPill status={b.status} />
            <span className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</span>
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="font-display text-lg text-maroon">{b.fullName}</div>
            <div className="mt-2 space-y-1.5 text-sm text-foreground/80">
              <a href={`mailto:${b.email}`} className="flex items-center gap-2 hover:text-maroon"><Mail className="size-4 text-gold-deep" />{b.email}</a>
              <a href={`tel:${b.mobile}`} className="flex items-center gap-2 hover:text-maroon"><Phone className="size-4 text-gold-deep" />{b.mobile}{b.whatsapp ? ` · WA: ${b.whatsapp}` : ""}</a>
              <div className="flex items-center gap-2"><MapPin className="size-4 text-gold-deep" />{b.city}</div>
            </div>
          </div>

          <dl className="rounded-xl border border-border divide-y divide-border text-sm">
            <Row k="Event" v={b.eventTitle} />
            <Row k="Session" v={`${b.sessionLabel} × ${b.seats}`} />
            <Row k="Amount" v={`₹${b.amount.toLocaleString("en-IN")}`} />
          </dl>

          {b.message && <div className="rounded-xl bg-secondary/50 p-4 text-sm"><div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Message</div>{b.message}</div>}

          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Payment Screenshot</div>
            {b.proofDataUrl ? (
              <a href={b.proofDataUrl} target="_blank" rel="noreferrer">
                <img src={b.proofDataUrl} alt="Payment proof" className="w-full rounded-lg border border-border" />
              </a>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                <ImageIcon className="size-6 mx-auto mb-2 opacity-50" />
                No screenshot{b.proofName ? ` — ${b.proofName}` : ""}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button onClick={() => setStatus("confirmed")} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700"><Check className="size-4" /> Confirm</button>
            <button onClick={() => setStatus("rejected")} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-destructive text-white py-2.5 text-sm font-semibold hover:opacity-90"><Ban className="size-4" /> Reject</button>
            <button onClick={() => setStatus("pending")} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border py-2.5 text-sm font-medium hover:border-gold"><Clock className="size-4" /> Mark Pending</button>
            <button onClick={remove} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 text-destructive py-2.5 text-sm font-medium hover:bg-destructive/10"><Trash2 className="size-4" /> Delete</button>
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
    confirmed: "bg-green-100 text-green-700",
    rejected: "bg-destructive/10 text-destructive",
  };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[status] ?? ""}`}>{status}</span>;
}
