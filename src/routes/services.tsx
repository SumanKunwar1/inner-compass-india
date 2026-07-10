import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Mountain, Flame, Heart, BookOpen, Users, Globe2, Sparkles, Sun } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — BTMC Foundation India" },
      { name: "description", content: "Pilgrimage tours, puja, healing, ceremonies, meditation training, Dharma teaching, prayer services, Buddhist education and humanitarian projects." },
    ],
  }),
  component: Services,
});

const services = [
  { i: Mountain, t: "Pilgrimage Tours", d: "Sacred journeys across India, Nepal, Tibet, Bhutan, Sri Lanka and Southeast Asia." },
  { i: Flame, t: "Puja & Ceremony", d: "Traditional Buddhist ceremonies for blessing, protection and merit." },
  { i: Heart, t: "Healing Practice", d: "Meditation-based healing programs for mind and body." },
  { i: Sparkles, t: "Meditation Training", d: "Vipassana, Samatha, healing and mindfulness training for every level." },
  { i: BookOpen, t: "Dharma Teaching", d: "In-person and online teachings from senior lamas and instructors." },
  { i: Sun, t: "Prayer Services", d: "Individual and community prayer offerings and dedications." },
  { i: Users, t: "Buddhist Education", d: "Monastic and lay learning programmes and study groups." },
  { i: Globe2, t: "Humanitarian Projects", d: "Charity, healthcare, education and community outreach across India and Nepal." },
];

function Services() {
  return (
    <Layout>
      <PageHero eyebrow="Our Services" title="Practices that guide, protect and heal" subtitle="From daily meditation to sacred pilgrimage — the full breadth of Buddhist spiritual and humanitarian service." />
      <section className="section-y">
        <div className="container-x grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <div key={s.t} className="p-6 bg-card border border-border rounded-lg hover:border-gold transition group">
              <div className="size-12 rounded-md grid place-items-center bg-secondary text-maroon group-hover:bg-maroon group-hover:text-cream transition">
                <s.i className="size-6" />
              </div>
              <h3 className="font-display text-xl text-maroon mt-4">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
