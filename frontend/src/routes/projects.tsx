import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — BTMC Foundation India" },
      { name: "description", content: "Current initiatives: International Ngyungne Retreat Center Pharping, RDSCL Monastic College Nuwakot, and Bodhi Teaching & Meditation Center Delhi." },
    ],
  }),
  component: Projects,
});

const projects = [
  { t: "International Ngyungne Retreat Center", p: "Pharping, Nepal", d: "A dedicated sanctuary for intensive purification retreats, hosting international Ngyungne programs and long-term meditation practice." },
  { t: "RDSCL Monastic College Construction", p: "Nuwakot, Nepal", d: "Building a new monastic college to train the next generation of monks in Buddhist philosophy, ritual and practice." },
  { t: "Bodhi Teaching & Meditation Center", p: "Delhi, India", d: "A city sanctuary offering weekly meditation, Dharma classes and healing programmes for the Delhi sangha." },
];

function Projects() {
  return (
    <Layout>
      <PageHero eyebrow="Our Projects" title="Building sanctuaries for practice & study" subtitle="Long-term initiatives that support meditators, monastics and the wider community." />
      <section className="section-y">
        <div className="container-x space-y-6">
          {projects.map((p, i) => (
            <article key={p.t} className="grid md:grid-cols-[auto_1fr] gap-8 p-8 bg-card rounded-lg border border-border">
              <div className="font-display text-6xl text-gold-deep leading-none">0{i + 1}</div>
              <div>
                <h2 className="font-display text-3xl text-maroon">{p.t}</h2>
                <div className="text-sm uppercase tracking-widest text-gold-deep mt-1">{p.p}</div>
                <p className="mt-4 text-foreground/75 leading-relaxed">{p.d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
