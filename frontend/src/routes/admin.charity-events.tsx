import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, ArrowLeft, Save, X, Upload, GripVertical, Eye, Loader2,
} from "lucide-react";
import { useEvents, saveEvent, deleteEvent, slugify } from "@/lib/charityStore";
import type { CharityEvent, CharitySession } from "@/data/charityEvents";
import { BANK_DETAILS } from "@/data/charityEvents";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export const Route = createFileRoute("/admin/charity-events")({
  validateSearch: (s: Record<string, unknown>): { new?: true } =>
    s.new === true || s.new === "true" ? { new: true } : {},
  component: EventsAdmin,
});

function blankEvent(): CharityEvent {
  return {
    slug: "",
    city: "",
    country: "India",
    title: "",
    tagline: "",
    status: "upcoming",
    detailsAvailable: true,
    date: "",
    dateShort: "",
    venue: "",
    venueNote: "",
    image: "",
    teacher: "Venerable Dr. Khen Rinpoche Sonam Gyurme",
    teacherTitle: "Main Abbot and Chairman of BTMC Foundation India & Dharma Television Nepal",
    videoUrl: "",
    intro: "",
    overview: [],
    descriptionHtml: "",
    sessions: [],
    contacts: ["+91-8178804502"],
    email: "info@btmcfoundation.in",
    website: "www.btmcfoundation.in",
    supportsNote: "",
    bank: { ...BANK_DETAILS },
  };
}

function EventsAdmin() {
  const events = useEvents();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<{ draft: CharityEvent; originalSlug?: string } | null>(null);

  // Open a blank editor when arriving with ?new=true
  useEffect(() => {
    if (search.new && !editing) {
      setEditing({ draft: blankEvent() });
      navigate({ to: "/admin/charity-events", search: {}, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.new]);

  if (editing) {
    return (
      <EventEditor
        initial={editing.draft}
        originalSlug={editing.originalSlug}
        onCancel={() => setEditing(null)}
        onSaved={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-maroon">Charity Events</h1>
          <p className="text-muted-foreground text-sm mt-1">Create, edit and manage the charity events shown on the website.</p>
        </div>
        <button onClick={() => setEditing({ draft: blankEvent() })} className="btn-primary">
          <Plus className="size-4" /> New Event
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {events.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No events yet. Create your first charity event.</div>
        ) : (
          <div className="divide-y divide-border">
            {events.map((e) => (
              <div key={e.slug} className="flex items-center gap-4 px-4 py-3">
                <div className="size-14 rounded-lg overflow-hidden bg-secondary shrink-0">
                  {e.image ? <img src={e.image} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-maroon truncate">{e.title || "(untitled)"}</div>
                  <div className="text-xs text-muted-foreground truncate">{e.city}{e.country ? `, ${e.country}` : ""} · {e.dateShort || e.date}</div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${e.status === "upcoming" ? "bg-gold/15 text-gold-deep" : "bg-secondary text-muted-foreground"}`}>{e.status}</span>
                <div className="flex items-center gap-1">
                  <a href={`/charity-events/${e.slug}`} target="_blank" rel="noreferrer" className="size-9 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon" title="Preview"><Eye className="size-4" /></a>
                  <button onClick={() => setEditing({ draft: structuredClone(e), originalSlug: e.slug })} className="size-9 grid place-items-center rounded hover:bg-secondary text-foreground/60 hover:text-maroon" title="Edit"><Pencil className="size-4" /></button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${e.title}"?`)) return;
                      try { await deleteEvent(e.slug); } catch (err) { alert(err instanceof Error ? err.message : "Delete failed"); }
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

/* ---------------- Editor ---------------- */

function EventEditor({ initial, originalSlug, onCancel, onSaved }: {
  initial: CharityEvent; originalSlug?: string; onCancel: () => void; onSaved: () => void;
}) {
  const [d, setD] = useState<CharityEvent>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isNew = !originalSlug;

  const set = <K extends keyof CharityEvent>(key: K, value: CharityEvent[K]) => setD((p) => ({ ...p, [key]: value }));
  const setBank = (key: keyof CharityEvent["bank"], value: string) => setD((p) => ({ ...p, bank: { ...p.bank, [key]: value } }));

  const onImage = (file: File | undefined) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => set("image", String(r.result));
    r.readAsDataURL(file);
  };

  const addSession = () =>
    set("sessions", [...d.sessions, { name: "", time: "", tone: "", donation: "", description: "", highlights: [] }]);
  const updateSession = (i: number, patch: Partial<CharitySession>) =>
    set("sessions", d.sessions.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeSession = (i: number) => set("sessions", d.sessions.filter((_, idx) => idx !== i));

  const save = async () => {
    setError(null);
    if (!d.title.trim()) return setError("Title is required.");
    if (!d.city.trim()) return setError("City is required.");
    const slug = (d.slug.trim() || slugify(d.title)).trim();
    if (!slug) return setError("Could not generate a URL slug — please set one.");

    setSaving(true);
    try {
      await saveEvent({ ...d, slug }, originalSlug);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between gap-4">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-maroon">
          <ArrowLeft className="size-4" /> Back to list
        </button>
        <div className="flex gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold"><X className="size-4" /> Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">{saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Event</>)}</button>
        </div>
      </div>

      <h1 className="font-display text-3xl text-maroon">{isNew ? "New Charity Event" : "Edit Event"}</h1>
      {error && <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">{error}</div>}

      {/* Basics */}
      <Card title="Basics">
        <Grid>
          <Field label="Title" full><input className={inp} value={d.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Tagline" full><input className={inp} value={d.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
          <Field label="City"><input className={inp} value={d.city} onChange={(e) => set("city", e.target.value)} /></Field>
          <Field label="Country"><input className={inp} value={d.country} onChange={(e) => set("country", e.target.value)} /></Field>
          <Field label="URL Slug" hint={isNew ? "auto-generated from title if left blank" : undefined}>
            <input className={inp} value={d.slug} placeholder={slugify(d.title)} onChange={(e) => set("slug", e.target.value)} />
          </Field>
          <Field label="Status">
            <select className={inp} value={d.status} onChange={(e) => set("status", e.target.value as CharityEvent["status"])}>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </Field>
          <Field label="Details available?" hint="if off, listing shows 'coming soon'">
            <select className={inp} value={String(d.detailsAvailable)} onChange={(e) => set("detailsAvailable", e.target.value === "true")}>
              <option value="true">Yes — show full detail page</option>
              <option value="false">No — coming soon</option>
            </select>
          </Field>
        </Grid>
      </Card>

      {/* Date & venue */}
      <Card title="Date & Venue">
        <Grid>
          <Field label="Date (full)"><input className={inp} placeholder="Saturday, 22 August 2026" value={d.date} onChange={(e) => set("date", e.target.value)} /></Field>
          <Field label="Date (short)"><input className={inp} placeholder="22 Aug 2026" value={d.dateShort} onChange={(e) => set("dateShort", e.target.value)} /></Field>
          <Field label="Venue"><input className={inp} value={d.venue} onChange={(e) => set("venue", e.target.value)} /></Field>
          <Field label="Venue note"><input className={inp} placeholder="Near Patel Chowk Metro, New Delhi" value={d.venueNote} onChange={(e) => set("venueNote", e.target.value)} /></Field>
        </Grid>
      </Card>

      {/* Media */}
      <Card title="Media">
        <Grid>
          <Field label="Cover image URL" full hint="paste a URL, or upload below">
            <input className={inp} value={d.image.startsWith("data:") ? "" : d.image} placeholder={d.image.startsWith("data:") ? "(uploaded image)" : "https://…"} onChange={(e) => set("image", e.target.value)} />
          </Field>
          <Field label="Upload image">
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-4 py-2.5 text-sm hover:border-gold">
              <Upload className="size-4 text-gold-deep" /> Choose file
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImage(e.target.files?.[0])} />
            </label>
          </Field>
          <Field label="Video embed URL" hint="YouTube embed link (…/embed/ID)"><input className={inp} value={d.videoUrl ?? ""} onChange={(e) => set("videoUrl", e.target.value)} /></Field>
          {d.image && (
            <div className="sm:col-span-2">
              <div className="text-xs text-muted-foreground mb-1">Preview</div>
              <img src={d.image} alt="" className="h-32 rounded-lg border border-border object-cover" />
            </div>
          )}
        </Grid>
      </Card>

      {/* Teacher */}
      <Card title="Presiding Teacher">
        <Grid>
          <Field label="Name" full><input className={inp} value={d.teacher} onChange={(e) => set("teacher", e.target.value)} /></Field>
          <Field label="Title" full><input className={inp} value={d.teacherTitle} onChange={(e) => set("teacherTitle", e.target.value)} /></Field>
        </Grid>
      </Card>

      {/* Content */}
      <Card title="Content">
        <Field label="Intro (short lead paragraph)" full>
          <textarea rows={3} className={inp} value={d.intro} onChange={(e) => set("intro", e.target.value)} />
        </Field>
        <Field label="Full description (rich text)" full hint="shown on the detail page">
          <RichTextEditor value={d.descriptionHtml ?? ""} onChange={(html) => set("descriptionHtml", html)} placeholder="Write the full event description…" />
        </Field>
        <Field label="Supporting note" full hint="e.g. where proceeds go">
          <textarea rows={2} className={inp} value={d.supportsNote} onChange={(e) => set("supportsNote", e.target.value)} />
        </Field>
      </Card>

      {/* Sessions */}
      <Card title="Sessions" action={<button onClick={addSession} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep hover:text-maroon"><Plus className="size-4" /> Add session</button>}>
        {d.sessions.length === 0 && <p className="text-sm text-muted-foreground">No sessions added. Add a morning/afternoon session with its donation and highlights.</p>}
        <div className="space-y-4">
          {d.sessions.map((s, i) => (
            <div key={i} className="rounded-xl border border-border p-4 bg-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <GripVertical className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-maroon">Session {i + 1}</span>
                <button onClick={() => removeSession(i)} className="ml-auto text-destructive hover:opacity-80" title="Remove"><Trash2 className="size-4" /></button>
              </div>
              <Grid>
                <Field label="Name"><input className={inp} value={s.name} onChange={(e) => updateSession(i, { name: e.target.value })} /></Field>
                <Field label="Time"><input className={inp} placeholder="9:00 AM – 12:00 PM" value={s.time} onChange={(e) => updateSession(i, { time: e.target.value })} /></Field>
                <Field label="Subtitle / tone"><input className={inp} value={s.tone} onChange={(e) => updateSession(i, { tone: e.target.value })} /></Field>
                <Field label="Donation"><input className={inp} placeholder="₹1,500 (Lunch Included)" value={s.donation} onChange={(e) => updateSession(i, { donation: e.target.value })} /></Field>
                <Field label="Description" full><textarea rows={2} className={inp} value={s.description} onChange={(e) => updateSession(i, { description: e.target.value })} /></Field>
                <Field label="Highlights (one per line)" full>
                  <textarea rows={4} className={inp} value={s.highlights.join("\n")} onChange={(e) => updateSession(i, { highlights: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })} />
                </Field>
              </Grid>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact & bank */}
      <Card title="Contact & Payment">
        <Grid>
          <Field label="Contact numbers (comma separated)" full>
            <input className={inp} value={d.contacts.join(", ")} onChange={(e) => set("contacts", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
          </Field>
          <Field label="Email"><input className={inp} value={d.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Website"><input className={inp} value={d.website} onChange={(e) => set("website", e.target.value)} /></Field>
          <Field label="Bank name" full><input className={inp} value={d.bank.bankName} onChange={(e) => setBank("bankName", e.target.value)} /></Field>
          <Field label="Account name"><input className={inp} value={d.bank.accountName} onChange={(e) => setBank("accountName", e.target.value)} /></Field>
          <Field label="Account number"><input className={inp} value={d.bank.accountNumber} onChange={(e) => setBank("accountNumber", e.target.value)} /></Field>
          <Field label="IFSC"><input className={inp} value={d.bank.ifsc} onChange={(e) => setBank("ifsc", e.target.value)} /></Field>
          <Field label="Branch"><input className={inp} value={d.bank.branch} onChange={(e) => setBank("branch", e.target.value)} /></Field>
        </Grid>
      </Card>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-gold"><X className="size-4" /> Cancel</button>
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-70">{saving ? (<><Loader2 className="size-4 animate-spin" /> Saving…</>) : (<><Save className="size-4" /> Save Event</>)}</button>
      </div>
    </div>
  );
}

/* ---------------- small UI helpers ---------------- */

const inp = "w-full px-3 py-2.5 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold";

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
