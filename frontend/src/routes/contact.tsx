import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { MapPin, Phone, Mail, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { addMessage } from "@/lib/submissionsStore";
import { useSettings } from "@/lib/contentStore";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — BTMC Foundation India" },
      { name: "description", content: "Reach BTMC Foundation India — head office in Siliguri, contact office in New Delhi." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const settings = useSettings();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => { setForm((p) => ({ ...p, [k]: v })); setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    setSubmitting(true);
    try {
      await addMessage(form);
      setDone(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const contactRows = [
    { i: MapPin, t: "Address", d: settings.orgAddress },
    ...settings.orgPhones.map((p) => ({ i: Phone, t: "Phone", d: p })),
    { i: Mail, t: "Email", d: settings.orgEmail },
    { i: Globe, t: "Website", d: settings.website },
  ];
  const inputCls = "w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold";

  return (
    <Layout>
      <PageHero eyebrow="Contact Us" title="Reach our sangha" subtitle="We welcome your questions about retreats, teachings, sponsorship or partnership." />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            {contactRows.map((c, i) => (
              <div key={i} className="flex gap-5 p-6 bg-card rounded-lg border border-border">
                <div className="size-12 grid place-items-center rounded bg-secondary text-maroon"><c.i className="size-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-gold-deep">{c.t}</div>
                  <div className="font-display text-lg text-maroon mt-1">{c.d}</div>
                </div>
              </div>
            ))}
          </div>

          {done ? (
            <div className="p-8 bg-card rounded-lg border border-gold text-center grid place-items-center">
              <div>
                <div className="size-16 mx-auto grid place-items-center rounded-full bg-gold/15 text-gold-deep"><CheckCircle2 className="size-8" /></div>
                <h2 className="font-display text-2xl text-maroon mt-4">Message sent</h2>
                <p className="text-foreground/70 mt-2 max-w-sm">Thank you for reaching out. Our team will get back to you by email soon.</p>
                <button onClick={() => setDone(false)} className="btn-primary mt-6">Send another message</button>
              </div>
            </div>
          ) : (
            <form className="p-8 bg-card rounded-lg border border-border space-y-4" onSubmit={submit} noValidate>
              <h2 className="font-display text-2xl text-maroon">Send us a message</h2>
              <input placeholder="Your Name *" className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} />
              <input placeholder="Email Address *" type="email" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
              <input placeholder="Subject" className={inputCls} value={form.subject} onChange={(e) => set("subject", e.target.value)} />
              <textarea placeholder="Your message *" rows={6} className={inputCls} value={form.message} onChange={(e) => set("message", e.target.value)} />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 disabled:opacity-70">
                {submitting ? (<><Loader2 className="size-4 animate-spin" /> Sending…</>) : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
