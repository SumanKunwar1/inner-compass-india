import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — BTMC Foundation India" },
      { name: "description", content: "Weekly free meditation retreats, international Ngyungne retreats, and world peace prayer ceremonies." },
    ],
  }),
  component: Events,
});

const events = [
  {
    tag: "Weekly Program",
    title: "Weekly 2-Day Free Meditation Retreat",
    date: "Every Saturday & Sunday · 1 Nov 2026 – 30 Oct 2027",
    venue: "BTMC Retreat Center, Jorpati, Kathmandu, Nepal",
    items: ["Vipassana Meditation", "Samatha Meditation", "Healing Meditation", "Mindfulness Practice", "Dharma Teachings", "Buddhist Philosophy", "Compassion Meditation", "Vegetarian Meals", "Accommodation", "Personal Guidance", "Q&A Sessions", "Certificate"],
  },
  {
    tag: "17-Day Intensive",
    title: "3rd International Ngyungne Retreat",
    date: "8 – 24 December 2026",
    venue: "BTMC Retreat Center, Jorpati, Kathmandu, Nepal",
    items: ["Eight Mahayana Precepts", "Fasting Practice", "Meditation", "Mantra Recitation", "Prostration Practice", "Dharma Teachings", "Compassion Training", "Purification Practice", "World Peace Prayers"],
  },
  {
    tag: "Global Prayer",
    title: "2nd Nepal World Peace Prayers",
    date: "8 – 24 December 2026",
    venue: "Jorpati, Kathmandu, Nepal",
    items: ["Thousands of practitioners", "Prayer for global peace", "Environmental protection", "Happiness of all beings"],
  },
];

function Events() {
  return (
    <Layout>
      <PageHero eyebrow="Events" title="Retreats, Ceremonies & Gatherings" subtitle="Free and intensive programmes for practitioners of all levels — from weekly retreats to international peace prayers." />
      <section className="section-y">
        <div className="container-x space-y-8">
          {events.map((e, i) => (
            <article key={e.title} className={`grid lg:grid-cols-[1fr_2fr] gap-8 p-8 rounded-lg border ${i === 1 ? "border-gold bg-gold/5" : "border-border bg-card"}`}>
              <div>
                <span className="inline-block bg-maroon text-cream text-xs uppercase tracking-widest px-3 py-1.5 rounded">{e.tag}</span>
                <h2 className="font-display text-3xl md:text-4xl text-maroon mt-4">{e.title}</h2>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex gap-2"><Calendar className="size-4 mt-0.5 text-gold-deep" />{e.date}</div>
                  <div className="flex gap-2"><MapPin className="size-4 mt-0.5 text-gold-deep" />{e.venue}</div>
                </div>
                <Link to="/register" className="btn-primary mt-6">Register <ArrowRight className="size-4" /></Link>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-gold-deep mb-3">Participants Receive</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {e.items.map((x) => (
                    <li key={x} className="flex items-center gap-2 text-sm text-foreground/80"><span className="size-1.5 rounded-full bg-gold-deep" />{x}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
