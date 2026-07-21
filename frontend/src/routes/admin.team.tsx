import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowLeft, Save, X, Upload, GripVertical, Loader2, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { useTeam, saveTeamMember, deleteTeamMember, newTeamId, type TeamMember, type Socials } from "@/lib/contentStore";

export const Route = createFileRoute("/admin/team")({
  validateSearch: (s: Record<string, unknown>): { new?: true } =>
    s.new === true || s.new === "true" ? { new: true } : {},
  component: TeamAdmin,
});

const GRADIENTS = [
  "linear-gradient(135deg, var(--maroon), var(--maroon-deep))",
  "linear-gradient(135deg, var(--gold-deep), var(--saffron))",
  "linear-gradient(135deg, oklch(0.45 0.12 220), oklch(0.68 0.12 200))",
  "linear-gradient(135deg, oklch(0.42 0.08 140), oklch(0.6 0.12 130))",
  "linear-gradient(135deg, oklch(0.55 0.16 320), oklch(0.72 0.15 350))",
  "linear-gradient(135deg, oklch(0.5 0.13 45), oklch(0.72 0.16 65))",
];

function blankMember(order: number): TeamMember {
  return { id: newTeamId(), name: "", role: "", initials: "", gradient: GRADIENTS[0], image: "", order, socials: {} };
}

function TeamAdmin() {
  const team = useTeam();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<{ draft: TeamMember; originalId?: string } | null>(null);

  useEffect(() => {
    if (search.new && !editing) {
      setEditing({ draft: blankMember(team.length + 1) });
      navigate({ to: "/admin/team", search: {}, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.new]);

  if (editing) {
    return <MemberEditor initial={editing.draft} originalId={editing.originalId} onCancel={() => setEditing(null)} onSaved={() => setEditing(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Team</h1>
          <p className="text-muted-foreground text-sm mt-1">Members shown in the "Our Team" section on the About page.</p>
        </div>
        <button onClick={() => setEditing({ draft: blankMember(team.length + 1) })} className="btn-primary"><Plus className="size-4" /> Add Member</button>
      </div>

      {team.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground text-sm">No team members yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="relative aspect-[16/9] grid place-items-center" style={{ background: m.gradient }}>
                {m.image ? <img src={m.image} alt="" className="absolute inset-0 w-full h-full object-cover" /> : (
                  <div className="size-16 rounded-full bg-cream/15 border-2 border-cream/40 grid place-items-center font-display text-2xl text-cream backdrop-blur">{m.initials}</div>
                )}
              </div>
              <div className="p-4">
                <div className="font-display text-lg text-maroon leading-tight">{m.name || "(unnamed)"}</div>
                <div className="text-xs uppercase tracking-widest text-gold-deep">{m.role}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">order {m.order}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing({ draft: structuredClone(m), originalId: m.id })} className="size-8 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon" title="Edit"><Pencil className="size-4" /></button>
                    <button onClick={async () => { if (confirm(`Remove ${m.name}?`)) { try { await deleteTeamMember(m.id); } catch (e) { alert(e instanceof Error ? e.message : "Delete failed"); } } }} className="size-8 grid place-items-center rounded hover:bg-destructive/10 text-foreground/60 hover:text-destructive" title="Remove"><Trash2 className="size-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SOCIAL_FIELDS: { key: keyof Socials; label: string; icon: typeof Facebook }[] = [
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "youtube", label: "YouTube", icon: Youtube },
  { key: "twitter", label: "Twitter / X", icon: Twitter },
];

function MemberEditor({ initial, originalId, onCancel, onSaved }: { initial: TeamMember; originalId?: string; onCancel: () => void; onSaved: () => void }) {
  const [d, setD] = useState<TeamMember>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof TeamMember>(k: K, v: TeamMember[K]) => setD((p) => ({ ...p, [k]: v }));
  const setSocial = (k: keyof Socials, v: string) => setD((p) => ({ ...p, socials: { ...p.socials, [k]: v } }));

  const onImage = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("image", String(r.result));
    r.readAsDataURL(file);
  };

  const save = async () => {
    setError(null);
    if (!d.name.trim()) return setError("Name is required.");
    const initials = d.initials.trim() || d.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    setSaving(true);
    try {
      await saveTeamMember({ ...d, initials, id: d.id || newTeamId() }, originalId);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full px-3 py-2.5 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-maroon"><ArrowLeft className="size-4" /> Back to team</button>
        <div className="flex gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold"><X className="size-4" /> Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">{saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save</>)}</button>
        </div>
      </div>

      <h1 className="font-display text-3xl text-maroon">{originalId ? "Edit Member" : "Add Member"}</h1>
      {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}

      <section className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</label><input className={`mt-1 ${inp}`} value={d.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Role / Position</label><input className={`mt-1 ${inp}`} value={d.role} onChange={(e) => set("role", e.target.value)} /></div>
          <div><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Initials <span className="normal-case font-normal">— auto if blank</span></label><input className={`mt-1 ${inp}`} value={d.initials} onChange={(e) => set("initials", e.target.value.toUpperCase())} maxLength={3} /></div>
          <div><label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Display order</label><input type="number" className={`mt-1 ${inp}`} value={d.order} onChange={(e) => set("order", Number(e.target.value) || 0)} /></div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Photo</label>
          <div className="mt-1 flex items-center gap-4">
            <div className="size-20 rounded-full overflow-hidden grid place-items-center border border-border" style={{ background: d.gradient }}>
              {d.image ? <img src={d.image} alt="" className="w-full h-full object-cover" /> : <span className="font-display text-xl text-cream">{d.initials || "?"}</span>}
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-4 py-2.5 text-sm hover:border-gold">
              <Upload className="size-4 text-gold-deep" /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImage(e.target.files?.[0])} />
            </label>
            {d.image && <button onClick={() => set("image", "")} className="text-sm text-destructive hover:underline">Remove</button>}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Avatar colour (used when no photo)</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {GRADIENTS.map((g) => (
              <button key={g} onClick={() => set("gradient", g)} className={`size-9 rounded-full border-2 ${d.gradient === g ? "border-maroon" : "border-transparent"}`} style={{ background: g }} aria-label="colour" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-display text-xl text-maroon mb-3">Social links</h2>
        <div className="space-y-3">
          {SOCIAL_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <div className="size-9 shrink-0 grid place-items-center rounded-lg bg-secondary text-gold-deep"><f.icon className="size-4" /></div>
              <input className={inp} placeholder={`${f.label} URL (blank to hide)`} value={d.socials[f.key] ?? ""} onChange={(e) => setSocial(f.key, e.target.value)} />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5"><GripVertical className="size-3.5" /> Only links you fill in will show on the site.</p>
      </section>
    </div>
  );
}
