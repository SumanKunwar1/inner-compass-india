import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus, Pencil, Trash2, ArrowLeft, Save, X, Loader2, Crown, EyeOff, Eye, GripVertical,
} from "lucide-react";
import {
  usePlans, savePlan, deletePlan, newPlanId,
  PLAN_KINDS, type PlanKind, type SponsorshipPlan, type MediaBenefit,
} from "@/lib/sponsorshipStore";

export const Route = createFileRoute("/admin/sponsorships")({
  component: SponsorshipsAdmin,
});

const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function blankPlan(kind: PlanKind): SponsorshipPlan {
  return {
    id: newPlanId(),
    kind,
    name: "",
    tagline: "",
    intro: "",
    fee: 0,
    feeLabel: "",
    feeNote: "",
    period: "",
    inherits: "",
    benefits: [],
    mediaBenefits: [],
    suitableFor: [],
    recognition: "",
    featured: false,
    published: true,
    sortOrder: 0,
  };
}

function SponsorshipsAdmin() {
  const allPlans = usePlans();
  const [kind, setKind] = useState<PlanKind>("membership");
  const [editing, setEditing] = useState<{ draft: SponsorshipPlan; originalId?: string } | null>(null);

  if (editing) {
    return (
      <PlanEditor
        initial={editing.draft}
        originalId={editing.originalId}
        onCancel={() => setEditing(null)}
        onSaved={() => setEditing(null)}
      />
    );
  }

  const plans = allPlans.filter((p) => p.kind === kind);
  const active = PLAN_KINDS.find((k) => k.key === kind)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Membership &amp; Sponsorship</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage the plans shown on the Membership and Dharma Ideal Campaign pages.
          </p>
        </div>
        <button onClick={() => setEditing({ draft: blankPlan(kind) })} className="btn-primary">
          <Plus className="size-4" /> Add {active.label} Plan
        </button>
      </div>

      {/* Programme sub-tabs */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {PLAN_KINDS.map((k) => {
          const count = allPlans.filter((p) => p.kind === k.key).length;
          return (
            <button
              key={k.key}
              onClick={() => setKind(k.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition ${
                kind === k.key ? "border-maroon text-maroon" : "border-transparent text-muted-foreground hover:text-maroon"
              }`}
            >
              {k.label}
              <span className="text-xs bg-secondary rounded-full px-2 py-0.5">{count}</span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground -mt-2">{active.blurb}</p>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {plans.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No {active.label.toLowerCase()} plans yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {plans.map((p) => (
              <div key={p.id} className={`flex items-center gap-4 px-4 py-3 ${p.published ? "" : "opacity-60"}`}>
                <GripVertical className="size-4 text-muted-foreground/40 shrink-0 hidden sm:block" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-maroon truncate flex items-center gap-2">
                    {p.name || "(untitled)"}
                    {p.featured && <Crown className="size-3.5 text-gold-deep shrink-0" />}
                    {!p.published && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.id}
                    {p.period ? ` · ${p.period}` : ""}
                    {p.benefits.length ? ` · ${p.benefits.length} benefits` : ""}
                  </div>
                </div>
                <div className="font-semibold text-maroon text-sm text-right whitespace-nowrap">
                  {p.feeLabel || inr(p.fee)}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing({ draft: structuredClone(p), originalId: p.id })}
                    className="size-9 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon"
                    title="Edit"
                  ><Pencil className="size-4" /></button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${p.name}"?`)) return;
                      try { await deletePlan(p.id); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
                    }}
                    className="size-9 grid place-items-center rounded hover:bg-destructive/10 text-foreground/60 hover:text-destructive"
                    title="Delete"
                  ><Trash2 className="size-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- editor ---------------- */

function PlanEditor({ initial, originalId, onCancel, onSaved }: {
  initial: SponsorshipPlan; originalId?: string; onCancel: () => void; onSaved: () => void;
}) {
  const [d, setD] = useState<SponsorshipPlan>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isNew = !originalId;
  const isOrg = d.kind === "community" || d.kind === "corporate";

  const set = <K extends keyof SponsorshipPlan>(key: K, value: SponsorshipPlan[K]) =>
    setD((p) => ({ ...p, [key]: value }));

  const save = async () => {
    setError(null);
    setSaving(true);
    try {
      await savePlan({ ...d, id: d.id || newPlanId() }, originalId);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the plan.");
    } finally {
      setSaving(false);
    }
  };

  const setMedia = (i: number, patch: Partial<MediaBenefit>) =>
    set("mediaBenefits", d.mediaBenefits.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-maroon">
          <ArrowLeft className="size-4" /> Back to plans
        </button>
        <div className="flex gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold">
            <X className="size-4" /> Cancel
          </button>
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">
            {saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Plan</>)}
          </button>
        </div>
      </div>

      <div>
        <h1 className="font-display text-3xl text-maroon">{isNew ? "Add Plan" : "Edit Plan"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Every field is optional — fill in what you have and come back to the rest later.
        </p>
      </div>
      {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}

      <Card title="Plan Details">
        <Grid>
          <Field label="Programme">
            <select className={inp} value={d.kind} onChange={(e) => set("kind", e.target.value as PlanKind)}>
              {PLAN_KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
            </select>
          </Field>
          <Field label="Id / slug" hint="used in links; keep it stable">
            <input className={inp} value={d.id} onChange={(e) => set("id", e.target.value)} />
          </Field>
          <Field label="Name" full><input className={inp} value={d.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Tagline" full hint="one line shown under the name">
            <input className={inp} value={d.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          {isOrg && (
            <Field label="Intro paragraph" full hint="lead text for the section">
              <textarea rows={3} className={inp} value={d.intro} onChange={(e) => set("intro", e.target.value)} />
            </Field>
          )}
          {d.kind === "membership" && (
            <Field label="Builds on" hint='e.g. "Silver" — shows "Everything in Silver, plus:"'>
              <input className={inp} value={d.inherits} onChange={(e) => set("inherits", e.target.value)} />
            </Field>
          )}
          {isOrg && (
            <Field label="Partner recognition" hint='e.g. "Dharma TV Community Partner"'>
              <input className={inp} value={d.recognition} onChange={(e) => set("recognition", e.target.value)} />
            </Field>
          )}
        </Grid>
      </Card>

      <Card title="Fee & Period">
        <Grid>
          <Field label="Fee (number)" hint="used for the application form">
            <input type="number" min={0} className={inp} value={d.fee || ""} onChange={(e) => set("fee", Number(e.target.value) || 0)} />
          </Field>
          <Field label="Display fee" hint={`blank = ${inr(d.fee || 0)}`}>
            <input className={inp} placeholder={inr(d.fee || 0)} value={d.feeLabel} onChange={(e) => set("feeLabel", e.target.value)} />
          </Field>
          <Field label="Fee note" hint='e.g. "per corporate organization, per year"'>
            <input className={inp} value={d.feeNote} onChange={(e) => set("feeNote", e.target.value)} />
          </Field>
          <Field label="Period / validity" hint='e.g. "1 Year", "Lifetime"'>
            <input className={inp} value={d.period} onChange={(e) => set("period", e.target.value)} />
          </Field>
          <Field label="Sort order" hint="lower shows first">
            <input type="number" className={inp} value={d.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />
          </Field>
          <Field label="Visibility">
            <div className="flex flex-wrap gap-5 pt-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={d.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-[var(--maroon)]" />
                {d.published ? <Eye className="size-3.5 text-gold-deep" /> : <EyeOff className="size-3.5" />} Published
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={d.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-[var(--maroon)]" />
                Featured
              </label>
            </div>
          </Field>
        </Grid>
      </Card>

      <Card title="Benefits">
        <Field label="Benefits (one per line)" full hint="shown as the ticked list on the public page">
          <textarea
            rows={10}
            className={inp}
            value={d.benefits.join("\n")}
            onChange={(e) => set("benefits", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))}
          />
        </Field>
        <p className="text-xs text-muted-foreground">{d.benefits.length} benefit{d.benefits.length === 1 ? "" : "s"}</p>
      </Card>

      {isOrg && (
        <>
          <Card title="Suitable For">
            <Field label="One per line" full hint="rendered as chips on the public page">
              <textarea
                rows={6}
                className={inp}
                value={d.suitableFor.join("\n")}
                onChange={(e) => set("suitableFor", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))}
              />
            </Field>
          </Card>

          <Card title="Media & Dharma TV Benefits">
            <div className="space-y-4">
              {d.mediaBenefits.map((m, i) => (
                <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Card {i + 1}</span>
                    <button
                      onClick={() => set("mediaBenefits", d.mediaBenefits.filter((_, idx) => idx !== i))}
                      className="size-8 grid place-items-center rounded hover:bg-destructive/10 text-foreground/60 hover:text-destructive"
                      title="Remove"
                    ><Trash2 className="size-4" /></button>
                  </div>
                  <input className={inp} placeholder="Title" value={m.title} onChange={(e) => setMedia(i, { title: e.target.value })} />
                  <textarea rows={3} className={inp} placeholder="Detail" value={m.detail} onChange={(e) => setMedia(i, { detail: e.target.value })} />
                </div>
              ))}
              <button
                onClick={() => set("mediaBenefits", [...d.mediaBenefits, { title: "", detail: "" }])}
                className="inline-flex items-center gap-1.5 rounded-md border border-input px-4 py-2.5 text-sm hover:border-gold"
              >
                <Plus className="size-4 text-gold-deep" /> Add media benefit
              </button>
            </div>
          </Card>
        </>
      )}

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold">
          <X className="size-4" /> Cancel
        </button>
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">
          {saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Plan</>)}
        </button>
      </div>
    </div>
  );
}

/* ---------------- UI helpers ---------------- */

const inp = "w-full px-3 py-2.5 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-5">
      <h2 className="font-display text-xl text-maroon mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, hint, full, children }: { label: string; hint?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      {hint && <span className="text-xs text-muted-foreground/70 ml-2 normal-case font-normal">— {hint}</span>}
      <div className="mt-1">{children}</div>
    </div>
  );
}
