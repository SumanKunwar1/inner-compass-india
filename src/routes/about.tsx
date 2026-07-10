import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Sparkles, Heart, Globe2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — BTMC Foundation India" },
      { name: "description", content: "BTMC Foundation India preserves and shares authentic Buddhist teachings through meditation, education, humanitarian service and world peace initiatives." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <PageHero eyebrow="About Us" title="A community of wisdom, compassion & service" subtitle="Preserving and sharing the authentic teachings of Lord Buddha — for people of every country, religion and background." />
      <section className="section-y">
        <div className="container-x max-w-4xl">
          <p className="text-xl leading-relaxed text-foreground/85 font-display">
            BTMC Foundation India is a non-profit Buddhist spiritual and humanitarian
            organization committed to preserving and sharing the authentic teachings
            of Lord Buddha. Our mission is to inspire wisdom, compassion, mindfulness,
            ethical living and social responsibility.
          </p>
          <div className="ornament-divider" />
          <p className="text-foreground/75 leading-relaxed">
            We organize meditation retreats, Dharma teachings, humanitarian projects,
            peace initiatives and international cultural exchanges. We warmly welcome
            students, families, professionals, corporate leaders, monks, nuns and
            seekers from around the world to learn and practice together.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-14">
            {[
              { i: Sparkles, t: "Our Vision", d: "A world where wisdom, compassion and mindfulness guide humanity toward lasting peace." },
              { i: Heart, t: "Our Mission", d: "Preserve authentic Buddhist teachings and translate them into daily practice and humanitarian action." },
              { i: BookOpen, t: "Our Practice", d: "Meditation, ethical living, study, ceremony and service — an integrated Buddhist path." },
              { i: Globe2, t: "Our Reach", d: "India, Nepal, Sri Lanka, Bhutan, China and beyond — a truly international sangha." },
            ].map((v) => (
              <div key={v.t} className="bg-card border border-border rounded-lg p-8">
                <v.i className="size-8 text-gold-deep" />
                <h3 className="font-display text-2xl text-maroon mt-4">{v.t}</h3>
                <p className="text-foreground/70 mt-2">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Affiliated Organizations</span>
            <h2 className="font-display text-4xl mt-3 text-maroon">Our institutional family</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {[
              "BTMC Foundation",
              "Dharma Television HD",
              "Pure Land Tours & Travels Pvt. Ltd.",
              "Padma Sambhava Trip Pvt. Ltd.",
              "WAS Media Marketing Pvt. Ltd.",
              "Himalaya Trade & Service Pvt. Ltd.",
              "RDCCK Monastic Education Centre, Nepal",
              "Pure Land Hospitality Pvt. Ltd.",
              "Noble Enlightened Association",
            ].map((n) => (
              <div key={n} className="bg-card border border-border rounded-lg p-6 hover:border-gold transition">
                <div className="font-display text-lg text-maroon">{n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
