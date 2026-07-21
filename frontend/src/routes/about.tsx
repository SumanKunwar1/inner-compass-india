import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Sparkles, Heart, Globe2, BookOpen, Facebook, Instagram, Linkedin, Youtube, Twitter, Tv, GraduationCap, Users, MapPin } from "lucide-react";
import { useTeam } from "@/lib/contentStore";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
} as const;

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
  const team = useTeam();
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

      {/* Spiritual Head — biography */}
      <section className="section-y bg-secondary/40 border-y border-border">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow">Our Spiritual Head</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Venerable Dr. Khen Rinpoche Sonam Gyurme</h2>
            <p className="mt-3 text-gold-deep font-display text-lg">Main Abbot & Chairman — BTMC Foundation India & Dharma Television Nepal</p>
          </div>

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start max-w-5xl mx-auto">
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden grid place-items-center" style={{ background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" }}>
                <div className="text-center text-cream px-6">
                  <div className="size-24 mx-auto rounded-full bg-cream/15 border-2 border-cream/40 grid place-items-center font-display text-4xl backdrop-blur">
                    SG
                  </div>
                  <div className="font-display text-xl mt-5">Ven. Dr. Khen Rinpoche</div>
                  <div className="text-sm opacity-80">Sonam Gyurme Tamang</div>
                </div>
              </div>
            </div>

            <div>
              <div className="prose-none space-y-4 text-foreground/80 leading-relaxed">
                <p className="text-lg font-display text-foreground/85">
                  Born into the Tamang Buddhist community of Nepal, Venerable Khen Rinpoche Sonam Gyurme
                  took his novice ordination (Shramanera Shila) at Lokeswara Dhyanagar Monastery in Mhepee,
                  Kathmandu, at the age of nine, under the late H.E. Dinchhen Rinpoche.
                </p>
                <p>
                  Under his root teacher — popularly known as the "Video Lama" — he received a thorough
                  monastic education and was trained in the ordinary and extraordinary practices of both
                  Mahayana and Vajrayana Buddhism. For decades he has devoted his life to benefiting sentient
                  beings through teaching, practice, training and the skilful use of modern tools and
                  technology to spread the Buddha Dharma.
                </p>
                <p>
                  He is the founder and president of <strong className="text-maroon">RDCCK — Rigzin Dechhen
                  Chhoeling Chuglag Khang</strong>, a practice-based monastic school in Barahithan, Nuwakot.
                  RDCCK offers free education, training and accommodation in Buddhist philosophy, Buddhist arts,
                  traditional Lama dance, ritual and worship, yoga, retreat, meditation and traditional healing.
                </p>
                <p>
                  A dedicated educator, he has trained more than 350 Dharma teachers across the districts of
                  Nepal, and served as a lecturer at Lumbini College, affiliated with the Lumbini Buddhist
                  University of the Government of Nepal. He is also the founder of the Mahabodhi Documentary &
                  Film Production Foundation, and is closely associated with <strong className="text-maroon">Dharma
                  Television</strong> — a Full-HD satellite channel that broadcasts Dharma talks, meditation
                  courses, chanting and healing programs in multiple languages worldwide.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {[
                  { i: MapPin, t: "President, RDCCK", d: "Barahithan, Nuwakot, Nepal" },
                  { i: Tv, t: "Dharma Television Nepal", d: "Full-HD satellite Dharma channel" },
                  { i: GraduationCap, t: "350+ Teachers Trained", d: "Across the districts of Nepal" },
                  { i: Users, t: "BTMC Foundation India", d: "Main Abbot & Chairman" },
                ].map((f) => (
                  <div key={f.t} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="size-10 shrink-0 grid place-items-center rounded-lg bg-secondary text-gold-deep"><f.i className="size-5" /></div>
                    <div>
                      <div className="font-semibold text-maroon text-sm">{f.t}</div>
                      <div className="text-xs text-muted-foreground">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {team.length > 0 && (
      <section className="section-y">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">Our Team</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">The people behind our mission</h2>
            <p className="mt-4 text-foreground/70">A dedicated community of teachers, coordinators and volunteers serving the Dharma with compassion.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.id} className="group bg-card border border-border rounded-2xl overflow-hidden text-center hover:border-gold hover:shadow-[var(--shadow-warm)] transition">
                <div className="relative aspect-[4/3] grid place-items-center overflow-hidden" style={{ background: m.gradient }}>
                  {m.image ? (
                    <img src={m.image} alt={m.name} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="size-24 rounded-full bg-cream/15 border-2 border-cream/40 grid place-items-center font-display text-3xl text-cream backdrop-blur">
                      {m.initials}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-maroon">{m.name}</h3>
                  <div className="text-xs uppercase tracking-widest text-gold-deep mt-1">{m.role}</div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {Object.entries(m.socials).filter(([, href]) => href && href !== "#").map(([key, href]) => {
                      const Icon = socialIcons[key as keyof typeof socialIcons];
                      if (!Icon) return null;
                      return (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${m.name} on ${key}`}
                          className="size-9 grid place-items-center rounded-full border border-border text-maroon hover:bg-maroon hover:text-cream hover:border-maroon transition"
                        >
                          <Icon className="size-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

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
