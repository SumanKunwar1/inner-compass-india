import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { MapPin } from "lucide-react";
import peaceImg from "@/assets/peace-prayer.jpg";

export const Route = createFileRoute("/peace-prayers")({
  head: () => ({
    meta: [
      { title: "World Peace Prayers — BTMC Foundation India" },
      { name: "description", content: "Global peace prayer gatherings uniting practitioners across India, China, Sri Lanka, Nepal and beyond." },
    ],
  }),
  component: Peace,
});

const events = [
  { t: "1st India World Peace Prayers", p: "Kanheri Caves, Sanjay Gandhi National Park, Mumbai, India" },
  { t: "1st China World Peace Prayers", p: "Mount Wutai (Wutai Shan), China" },
  { t: "1st Sri Lanka World Peace Prayers", p: "Sri Pada (Adam's Peak), Sri Lanka" },
  { t: "2nd Nepal World Peace Prayers", p: "Jorpati, Kathmandu, Nepal · 8–24 Dec 2026" },
];

function Peace() {
  return (
    <Layout>
      <PageHero eyebrow="World Peace Prayer Movement" title="Uniting sacred hearts for global peace" subtitle="Thousands of practitioners united in prayer for peace, compassion, environmental harmony and the happiness of all sentient beings." />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
          <img src={peaceImg} alt="Peace prayer" loading="lazy" className="rounded-lg shadow-[var(--shadow-warm)]" />
          <div>
            <span className="eyebrow">Our Journey</span>
            <h2 className="font-display text-4xl mt-3 text-maroon">From cave to summit — prayer that transcends borders</h2>
            <div className="ornament-divider" />
            <p className="text-foreground/75 leading-relaxed">
              The World Peace Prayer Movement gathers monks, nuns and lay practitioners
              from every tradition to dedicate their prayers to peace, wisdom, and the
              well-being of every being.
            </p>
            <div className="mt-8 space-y-4">
              {events.map((e, i) => (
                <div key={e.t} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  <div className="size-10 shrink-0 grid place-items-center rounded-full bg-maroon text-gold font-display">{i + 1}</div>
                  <div>
                    <div className="font-display text-xl text-maroon">{e.t}</div>
                    <div className="text-sm text-muted-foreground flex gap-1.5 mt-1"><MapPin className="size-3.5" />{e.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 text-cream text-center" style={{ background: "var(--maroon-deep)" }}>
        <div className="container-x">
          <p className="font-display text-3xl md:text-4xl italic max-w-4xl mx-auto leading-snug">
            &ldquo;May all beings be happy. May all beings be free from suffering. May
            wisdom flourish, compassion guide humanity, and lasting peace prevail
            throughout the world.&rdquo;
          </p>
        </div>
      </section>
    </Layout>
  );
}
