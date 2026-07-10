import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

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
  return (
    <Layout>
      <PageHero eyebrow="Contact Us" title="Reach our sangha" subtitle="We welcome your questions about retreats, teachings, sponsorship or partnership." />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {[
              { i: MapPin, t: "Head Office", d: "Siliguri, West Bengal, India" },
              { i: MapPin, t: "Contact Office", d: "Paharganj, New Delhi, India" },
              { i: Phone, t: "Phone", d: "+91-8178804502" },
              { i: Mail, t: "Email", d: "info@btmcfoundation.in" },
              { i: Globe, t: "Website", d: "www.btmcfoundation.in" },
            ].map((c) => (
              <div key={c.t} className="flex gap-5 p-6 bg-card rounded-lg border border-border">
                <div className="size-12 grid place-items-center rounded bg-secondary text-maroon"><c.i className="size-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-gold-deep">{c.t}</div>
                  <div className="font-display text-xl text-maroon mt-1">{c.d}</div>
                </div>
              </div>
            ))}
          </div>
          <form className="p-8 bg-card rounded-lg border border-border space-y-4" onSubmit={(e) => e.preventDefault()}>
            <h2 className="font-display text-2xl text-maroon">Send us a message</h2>
            <input placeholder="Your Name" className="w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
            <input placeholder="Email Address" type="email" className="w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
            <input placeholder="Subject" className="w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
            <textarea placeholder="Your message" rows={6} className="w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
            <button type="submit" className="btn-primary w-full justify-center py-4">Send Message</button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
