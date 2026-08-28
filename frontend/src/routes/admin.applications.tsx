import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download, Trash2, X, Check, Ban, Clock, BadgeCheck, Mail, Phone, Image as ImageIcon,
  Inbox, Building2, Globe, Users,
} from "lucide-react";
import {
  useApplications, updateApplication, deleteApplication,
  PLAN_KINDS, APPLICATION_STATUSES,
  type Application, type ApplicationStatus, type PlanKind,
} from "@/lib/sponsorshipStore";

export const Route = createFileRoute("/admin/applications")({
  component: ApplicationsAdmin,
});

type KindFilter = "all" | PlanKind;

function ApplicationsAdmin() {
  const applications = useApplications();
  const [kind, setKind] = useState<KindFilter>("all");
  const [status, setStatus] = useState<"all" | ApplicationStatus>("all");
  const [selected, setSelected] = useState<Application | null>(null);

  const byKind = kind === "all" ? applications : applications.filter((a) => a.kind === kind);
  const filtered = status === "all" ? byKind : byKind.filter((a) => a.status === status);

  const kindCount = (k: KindFilter) =>
    k === "all" ? applications.length : applications.filter((a) => a.kind === k).length;
  const statusCount = (s: "all" | ApplicationStatus) =>
    s === "all" ? byKind.length : byKind.filter((a) => a.status === s).length;

  const exportCsv = () => {
    const cols = [
      "ref", "createdAt", "kind", "planName", "planPeriod", "amount", "status",
      "fullName", "email", "mobile", "pan", "address",
      "organisation", "designation", "website", "memberCount", "message", "adminNote",
    ];
    const rows = filtered.map((a) =>
      cols.map((c) => `"${String((a as any)[c] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [cols.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `btmc-applications-${kind}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Membership and sponsorship sign-ups submitted from the public site, including payment screenshots.
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={!filtered.length}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:border-gold disabled:opacity-50"
        >
          <Download className="size-4" /> Export CSV
        </button>
      </div>

      {/* Programme sub-tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {([{ key: "all" as KindFilter, label: "All" }, ...PLAN_KINDS.map((k) => ({ key: k.key as KindFilter, label: k.label }))]).map((t) => (
          <button
            key={t.key}
            onClick={() => { setKind(t.key); setStatus("all"); }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition ${
              kind === t.key ? "border-maroon text-maroon" : "border-transparent text-muted-foreground hover:text-maroon"
            }`}
          >
            {t.label}
            <span className="text-xs bg-secondary rounded-full px-2 py-0.5">{kindCount(t.key)}</span>
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {([{ key: "all" as const, label: "All" }, ...APPLICATION_STATUSES]).map((f) => (
          <button
            key={f.key}
            onClick={() => setStatus(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              status === f.key ? "bg-maroon text-cream border-maroon" : "bg-card border-border hover:border-gold"
            }`}
          >
            {f.label} <span className="opacity-70">({statusCount(f.key)})</span>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="size-10 mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No applications{kind !== "all" ? ` for ${PLAN_KINDS.find((k) => k.key === kind)?.label}` : ""}
              {status !== "all" ? ` with status "${status}"` : ""}.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Ref</th>
                  <th className="px-4 py-3 font-semibold">Applicant</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">Programme</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Plan</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setSelected(a)}>
                    <td className="px-4 py-3 font-mono text-xs">{a.ref}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{a.fullName}</div>
                      <div className="text-xs text-muted-foreground">{a.organisation || a.email}</div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell"><KindPill kind={a.kind} /></td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{a.planName}</td>
                    <td className="px-4 py-3 font-semibold text-maroon whitespace-nowrap">₹{a.amount.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3"><StatusPill status={a.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelected(a); }}
                        className="text-gold-deep hover:text-maroon font-semibold text-xs"
                      >View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <ApplicationDrawer application={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function ApplicationDrawer({ application: a, onClose }: { application: Application; onClose: () => void }) {
  const [note, setNote] = useState(a.adminNote ?? "");
  const [busy, setBusy] = useState(false);

  const setStatus = async (status: ApplicationStatus) => {
    setBusy(true);
    try {
      await updateApplication(a.id, { status, adminNote: note });
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not update the application.");
    } finally {
      setBusy(false);
    }
  };

  const saveNote = async () => {
    setBusy(true);
    try {
      await updateApplication(a.id, { adminNote: note });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not save the note.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete this application permanently?")) return;
    try {
      await deleteApplication(a.id);
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const isOrg = a.kind === "community" || a.kind === "corporate";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-maroon text-cream px-5 py-4 flex items-center justify-between">
          <div>
            <div className="font-display text-xl">Application</div>
            <div className="text-xs opacity-80 font-mono">{a.ref}</div>
          </div>
          <button onClick={onClose} aria-label="Close" className="size-9 grid place-items-center rounded hover:bg-cream/15">
            <X className="size-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <StatusPill status={a.status} />
              <KindPill kind={a.kind} />
            </div>
            <span className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</span>
          </div>

          {isOrg && a.organisation && (
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground mb-2">
                <Building2 className="size-3.5" /> Organisation
              </div>
              <div className="font-display text-lg text-maroon">{a.organisation}</div>
              <div className="mt-2 space-y-1.5 text-sm text-foreground/80">
                {a.memberCount && (
                  <div className="flex items-center gap-2"><Users className="size-4 text-gold-deep" />{a.memberCount}</div>
                )}
                {a.website && (
                  <a href={a.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-maroon break-all">
                    <Globe className="size-4 text-gold-deep shrink-0" />{a.website}
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border p-4">
            <div className="font-display text-lg text-maroon">{a.fullName}</div>
            {a.designation && <div className="text-xs text-muted-foreground">{a.designation}</div>}
            <div className="mt-2 space-y-1.5 text-sm text-foreground/80">
              <a href={`mailto:${a.email}`} className="flex items-center gap-2 hover:text-maroon break-all">
                <Mail className="size-4 text-gold-deep shrink-0" />{a.email}
              </a>
              <a href={`tel:${a.mobile}`} className="flex items-center gap-2 hover:text-maroon">
                <Phone className="size-4 text-gold-deep" />{a.mobile}
              </a>
            </div>
          </div>

          <dl className="rounded-xl border border-border divide-y divide-border text-sm">
            <Row k="Plan" v={a.planName || "—"} />
            {a.planPeriod && <Row k="Period" v={a.planPeriod} />}
            <Row k="Amount" v={`₹${a.amount.toLocaleString("en-IN")}`} />
            {a.pan && <Row k="PAN" v={a.pan} />}
            {a.address && <Row k="Address" v={a.address} />}
          </dl>

          {a.message && (
            <div className="rounded-xl bg-secondary/50 p-4 text-sm">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Message</div>
              {a.message}
            </div>
          )}

          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Payment Screenshot</div>
            {a.proofDataUrl ? (
              <a href={a.proofDataUrl} target="_blank" rel="noreferrer">
                <img src={a.proofDataUrl} alt="Payment proof" className="w-full rounded-lg border border-border" />
              </a>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                <ImageIcon className="size-6 mx-auto mb-2 opacity-50" />
                No screenshot{a.proofName ? ` — ${a.proofName}` : ""}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Internal note</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={saveNote}
              placeholder="Only visible to admins…"
              className="mt-1 w-full px-3 py-2.5 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button onClick={() => setStatus("verified")} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-green-600 text-white py-2.5 text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
              <Check className="size-4" /> Verify Payment
            </button>
            <button onClick={() => setStatus("active")} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-maroon text-cream py-2.5 text-sm font-semibold hover:bg-maroon-deep disabled:opacity-60">
              <BadgeCheck className="size-4" /> Mark Active
            </button>
            <button onClick={() => setStatus("pending")} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border py-2.5 text-sm font-medium hover:border-gold disabled:opacity-60">
              <Clock className="size-4" /> Pending
            </button>
            <button onClick={() => setStatus("rejected")} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 text-destructive py-2.5 text-sm font-medium hover:bg-destructive/10 disabled:opacity-60">
              <Ban className="size-4" /> Reject
            </button>
            <button onClick={remove} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 text-destructive py-2.5 text-sm font-medium hover:bg-destructive/10">
              <Trash2 className="size-4" /> Delete Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 px-4 py-2.5">
      <dt className="text-muted-foreground shrink-0">{k}</dt>
      <dd className="font-medium text-foreground text-right">{v}</dd>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-gold/15 text-gold-deep",
    verified: "bg-green-100 text-green-700",
    active: "bg-blue-100 text-blue-700",
    rejected: "bg-destructive/10 text-destructive",
  };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${map[status] ?? ""}`}>{status}</span>;
}

function KindPill({ kind }: { kind: PlanKind }) {
  const label = PLAN_KINDS.find((k) => k.key === kind)?.label ?? kind;
  return <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">{label}</span>;
}
