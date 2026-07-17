import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Video } from "lucide-react";

export const Route = createFileRoute("/online-classes")({
  head: () => ({
    meta: [
      { title: "Online Dharma Classes — BTMC Foundation India" },
      { name: "description", content: "Live and recorded Buddhist classes: meditation, philosophy, healing, mindfulness and spiritual counselling — from anywhere in the world." },
    ],
  }),
  component: Online,
});

const classes = [
  "Meditation for Beginners",
  "Vipassana Meditation",
  "Samatha Meditation",
  "Healing Meditation",
  "Buddhist Philosophy",
  "Tibetan Buddhism",
  "Compassion Practice",
  "Mindfulness Training",
  "Dharma Talks",
  "Spiritual Counselling",
];

function Online() {
  return (
    <Layout>
      <PageHero eyebrow="Online Dharma Education" title="Practice anywhere. Learn from anyone." subtitle="Live and recorded classes with senior teachers — join a global sangha from your own home." />
      <section className="section-y">
        <div className="container-x grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <div key={c} className="p-6 bg-card border border-border rounded-lg hover:border-gold group transition">
              <Video className="size-6 text-gold-deep" />
              <h3 className="font-display text-xl text-maroon mt-4">{c}</h3>
              <p className="text-sm text-muted-foreground mt-1">Live &amp; recorded sessions with qualified teachers.</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
