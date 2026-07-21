import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Loader2, Plus, Trash2, Check, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { useSettings, saveSettings, type SiteSettings, type Socials } from "@/lib/contentStore";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

const SOCIAL_FIELDS: { key: keyof Socials; label: string; icon: typeof Facebook }[] = [
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "youtube", label: "YouTube", icon: Youtube },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "twitter", label: "Twitter / X", icon: Twitter },
];

function SettingsAdmin() {
  const current = useSettings();
  const [d, setD] = useState<SiteSettings>(current);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load live values once fetched.
  useEffect(() => { setD(current); /* eslint-disable-next-line */ }, [current]);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => { setD((p) => ({ ...p, [k]: v })); setSaved(false); };
  const setSocial = (k: keyof Socials, v: string) => { setD((p) => ({ ...p, socials: { ...p.socials, [k]: v } })); setSaved(false); };

  const save = async () => {
    setError(null); setSaving(true);
    try {
      await saveSettings({ ...d, orgPhones: d.orgPhones.filter((p) => p.trim()), stats: d.stats.filter((s) => s.label.trim() || s.value.trim()) });
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full px-3 py-2.5 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold";
  const lbl = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Site Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Global content — hero, contact details, socials and impact stats. Changes appear across the public site.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">
          {saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : saved ? (<><Check className="size-4" /> Saved</>) : (<><Save className="size-4" /> Save Changes</>)}
        </button>
      </div>
      {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}

      <Card title="Homepage Hero">
        <div><label className={lbl}>Badge line</label><input className={`mt-1 ${inp}`} value={d.heroBadge} onChange={(e) => set("heroBadge", e.target.value)} /></div>
        <div><label className={lbl}>Headline</label><input className={`mt-1 ${inp}`} value={d.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} /></div>
        <div><label className={lbl}>Subtitle</label><textarea rows={3} className={`mt-1 ${inp}`} value={d.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} /></div>
      </Card>

      <Card title="Organization Contact">
        <div>
          <label className={lbl}>Phone numbers</label>
          <div className="mt-1 space-y-2">
            {d.orgPhones.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input className={inp} value={p} onChange={(e) => set("orgPhones", d.orgPhones.map((x, idx) => (idx === i ? e.target.value : x)))} />
                <button onClick={() => set("orgPhones", d.orgPhones.filter((_, idx) => idx !== i))} className="size-10 shrink-0 grid place-items-center rounded border border-border text-destructive hover:bg-destructive/10"><Trash2 className="size-4" /></button>
              </div>
            ))}
            <button onClick={() => set("orgPhones", [...d.orgPhones, ""])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:text-maroon"><Plus className="size-4" /> Add phone</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={lbl}>Email</label><input className={`mt-1 ${inp}`} value={d.orgEmail} onChange={(e) => set("orgEmail", e.target.value)} /></div>
          <div><label className={lbl}>Website</label><input className={`mt-1 ${inp}`} value={d.website} onChange={(e) => set("website", e.target.value)} /></div>
        </div>
        <div><label className={lbl}>Address</label><textarea rows={2} className={`mt-1 ${inp}`} value={d.orgAddress} onChange={(e) => set("orgAddress", e.target.value)} /></div>
      </Card>

      <Card title="Social Links">
        <div className="space-y-3">
          {SOCIAL_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <div className="size-9 shrink-0 grid place-items-center rounded-lg bg-secondary text-gold-deep"><f.icon className="size-4" /></div>
              <input className={inp} placeholder={`${f.label} URL (blank to hide)`} value={d.socials[f.key] ?? ""} onChange={(e) => setSocial(f.key, e.target.value)} />
            </div>
          ))}
        </div>
      </Card>

      <Card title="Impact Stats" action={<button onClick={() => set("stats", [...d.stats, { label: "", value: "" }])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:text-maroon"><Plus className="size-4" /> Add stat</button>}>
        {d.stats.length === 0 && <p className="text-sm text-muted-foreground">No stats. Add label/value pairs (e.g. "Students Trained" / "12,400+").</p>}
        <div className="space-y-2">
          {d.stats.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className={inp} placeholder="Value (e.g. 12,400+)" value={s.value} onChange={(e) => set("stats", d.stats.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))} />
              <input className={inp} placeholder="Label (e.g. Students Trained)" value={s.label} onChange={(e) => set("stats", d.stats.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))} />
              <button onClick={() => set("stats", d.stats.filter((_, idx) => idx !== i))} className="size-10 shrink-0 grid place-items-center rounded border border-border text-destructive hover:bg-destructive/10"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">
          {saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : saved ? (<><Check className="size-4" /> Saved</>) : (<><Save className="size-4" /> Save Changes</>)}
        </button>
      </div>
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-maroon">{title}</h2>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
