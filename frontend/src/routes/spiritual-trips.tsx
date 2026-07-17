import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { MapPin } from "lucide-react";
import pilgrimImg from "@/assets/pilgrimage.jpg";

export const Route = createFileRoute("/spiritual-trips")({
  head: () => ({
    meta: [
      { title: "Spiritual Trips & Pilgrimage Tours — BTMC Foundation India" },
      { name: "description", content: "Sacred pilgrimage journeys across Mount Kailash, Tibet, Nepal, India, Bhutan, Sri Lanka and Southeast Asia." },
    ],
  }),
  component: Trips,
});

const trips = [
  { t: "Mount Kailash & Lake Mansarovar Yatra", p: "Tibet" },
  { t: "Tibet — Lhasa & Kailash Mansarovar Yatra", p: "Tibet" },
  { t: "Muktinath & Pashupatinath Darshan", p: "Nepal" },
  { t: "Lumbini, Kathmandu, Chitwan, Pokhara Trip", p: "Nepal" },
  { t: "Asta Maha Tirth Yatra", p: "Lumbini · Bodh Gaya · Sarnath · Kushinagar · Rajgir · Nalanda · Shravasti · Vaishali · Sankassa" },
  { t: "South India Buddhist Heritage", p: "Ajanta · Ellora · Kanheri · Mahakali · Nagarjuna Sagar · Anupu · Amaravati · Jagannath" },
  { t: "Nepal Buddhist Heritage", p: "Nepal" },
  { t: "Bhutan Spiritual Trip", p: "Bhutan" },
  { t: "Sri Lanka Spiritual Trip", p: "Sri Lanka" },
  { t: "16-Day Southeast Asia Spiritual Trip", p: "Thailand · Cambodia · Vietnam · Malaysia · Singapore" },
];

function Trips() {
  return (
    <Layout>
      <PageHero eyebrow="Spiritual Trips & Pilgrimage" title="Journey to the sacred heart of Buddhism" subtitle="Professionally organized pilgrimage programmes across Asia's most revered sites." />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-[2fr_3fr] gap-10">
          <div className="relative rounded-lg overflow-hidden">
            <img src={pilgrimImg} alt="Pilgrimage" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-3">
            {trips.map((t) => (
              <div key={t.t} className="p-5 bg-card border border-border rounded-lg hover:border-gold hover:shadow-[var(--shadow-soft)] transition">
                <h3 className="font-display text-xl text-maroon">{t.t}</h3>
                <div className="text-sm text-muted-foreground flex items-start gap-1.5 mt-1"><MapPin className="size-3.5 mt-0.5 shrink-0 text-gold-deep" /> {t.p}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
