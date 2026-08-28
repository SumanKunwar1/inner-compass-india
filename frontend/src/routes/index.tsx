import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Calendar, MapPin, Heart, BookOpen, Users, Globe2, Sparkles,
  PlayCircle, Sun, Mountain, Clock, HandHeart, Landmark, School, Building2,
  ChevronDown, ShieldCheck, Share2, Check,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import heroImg from "@/assets/hero-buddha.jpg";
import retreatImg from "@/assets/meditation-retreat.jpg";
import peaceImg from "@/assets/peace-prayer.jpg";
import pilgrimImg from "@/assets/pilgrimage.jpg";
import { featuredCharityEvent } from "@/data/charityEvents";
import { useEvents } from "@/lib/charityStore";
import { useSettings } from "@/lib/contentStore";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { BankDetails } from "@/components/BankDetails";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BTMC Foundation India — Awakening Wisdom, Cultivating Compassion" },
      { name: "description", content: "Join Asia's growing Buddhist meditation and humanitarian community. Free retreats, world peace prayers, online Dharma classes, spiritual trips and charity across India and beyond." },
    ],
  }),
  component: Home,
});

function Home() {
  const events = useEvents();
  const settings = useSettings();
  const featured = events.find((e) => e.status === "upcoming") ?? events[0] ?? featuredCharityEvent;
  return (
    <Layout>
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <img src={heroImg} alt="Buddha at sunrise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="container-x relative py-20 md:py-24 text-cream">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/40 text-gold px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="size-3.5" /> {settings.heroBadge}
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-semibold mt-5 leading-[1.05]">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-cream/90 leading-relaxed max-w-2xl">
              {settings.heroSubtitle || "Join a special spiritual gathering with Venerable Dr. Khen Rinpoche Sonam Gyurme to overcome negative energies, health challenges and difficulties in career, business, relationships and personal growth — and discover peace, clarity and purpose."}
            </p>

            {/* Event highlight card */}
            <div className="mt-7 inline-flex flex-col gap-3 rounded-xl bg-maroon-deep/60 backdrop-blur border border-cream/15 p-5 max-w-xl">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <span className="inline-flex items-center gap-2"><Calendar className="size-4 text-gold shrink-0" /> {featured.date}</span>
                <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-gold shrink-0" /> {featured.venue}, New Delhi</span>
                <span className="inline-flex items-center gap-2"><Clock className="size-4 text-gold shrink-0" /> Morning 9 AM – 12 PM</span>
                <span className="inline-flex items-center gap-2"><Clock className="size-4 text-gold shrink-0" /> Afternoon 12:30 – 3 PM</span>
              </div>
              <div className="text-xs text-cream/70">Includes a FREE Five-Combined Protective Amulet, personally blessed by the Venerable Master.</div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/charity-events/$slug" params={{ slug: featured.slug }} hash="register" className="btn-gold">
                Reserve Your Seat <ArrowRight className="size-4" />
              </Link>
              <Link to="/charity-events/$slug" params={{ slug: featured.slug }} className="btn-primary" style={{ background: "var(--saffron)", color: "var(--maroon-deep)" }}>
                Event Details
              </Link>
              <Link to="/donate" className="btn-outline">Donate Now</Link>
            </div>
          </div>
        </div>
      </section>

      <CrowdfundingAppeal />

      {/* Featured charity event */}
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
          <Link
            to="/charity-events/$slug"
            params={{ slug: featured.slug }}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[var(--shadow-warm)] block"
          >
            <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--maroon-deep)]/85 via-transparent to-transparent" />
            <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-gold text-maroon-deep text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              <Sparkles className="size-3.5" /> Upcoming Charity Event
            </div>
            <div className="absolute inset-0 grid place-items-center">
              <PlayCircle className="size-20 text-gold drop-shadow-lg group-hover:scale-110 transition" strokeWidth={1.1} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
              <div className="text-xs uppercase tracking-widest text-gold">{featured.city}, {featured.country}</div>
              <div className="font-display text-2xl mt-1">{featured.title}</div>
            </div>
          </Link>

          <div>
            <span className="eyebrow">Charity Events</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">
              Healing, Meditation & Blessings — with the Venerable Master
            </h2>
            <div className="ornament-divider" />
            <p className="text-lg text-foreground/80 leading-relaxed">
              Our special one-day charity events bring together healing, meditation, Dharma discourse and
              blessings. The morning session supports emotional and spiritual well-being through authentic
              Buddhist healing; the afternoon session offers Long Life, Health, Fortune & Prosperity
              blessings with practical life guidance.
            </p>
            <p className="mt-4 text-foreground/70 leading-relaxed">
              Every seat is an act of generosity — your contribution supports free meditation retreats and
              humanitarian service. A FREE Five-Combined Protective Amulet, personally blessed by the
              Venerable Master, is offered to every participant.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/charity-events/$slug" params={{ slug: featured.slug }} hash="register" className="btn-primary">
                Book Your Seat <ArrowRight className="size-4" />
              </Link>
              <Link to="/charity-events" className="text-maroon font-semibold underline underline-offset-4 self-center">View all charity events</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">Featured Events</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Upcoming Retreats & Ceremonies</h2>
            <p className="mt-4 text-foreground/70">Join thousands of practitioners across India, Nepal and around the world.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <EventCard
              img={retreatImg}
              tag="Weekly Program"
              title="2-Day Free Meditation Retreat"
              date="Every Saturday & Sunday · Nov 2026 – Oct 2027"
              venue="BTMC Retreat Center, Jorpati, Kathmandu"
              items={["Vipassana & Samatha", "Healing Meditation", "Dharma Teachings", "Meals & Accommodation"]}
            />
            <EventCard
              img={peaceImg}
              tag="17-Day Intensive"
              title="3rd International Ngyungne Retreat"
              date="8 – 24 December 2026"
              venue="BTMC Retreat Center, Jorpati, Kathmandu"
              items={["Eight Mahayana Precepts", "Fasting & Purification", "Prostration Practice", "World Peace Prayers"]}
              featured
            />
            <EventCard
              img={pilgrimImg}
              tag="Global Gathering"
              title="2nd Nepal World Peace Prayers"
              date="8 – 24 December 2026"
              venue="Jorpati, Kathmandu, Nepal"
              items={["Peace Prayer Ceremony", "Compassion Meditation", "Environmental Dedication", "Global Community"]}
            />
          </div>

          <div className="text-center mt-10">
            <Link to="/events" className="btn-primary">View All Events <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="relative py-24 text-cream overflow-hidden" style={{ background: "var(--maroon-deep)" }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, var(--gold), transparent 50%)" }} />
        <div className="container-x relative">
          <div className="text-center mb-14">
            <span className="eyebrow text-gold">Our Impact</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3">Wisdom in Action, Compassion at Work</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              ["12,400+", "Students Trained"],
              ["8,600+", "Retreat Participants"],
              ["45+", "Countries Represented"],
              ["1,200+", "International Volunteers"],
              ["180+", "Charity Programs"],
              ["24", "World Peace Prayer Events"],
              ["30,000+", "Online Dharma Students"],
              ["150,000+", "Humanitarian Beneficiaries"],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-semibold text-gold">{n}</div>
                <div className="mt-2 text-sm uppercase tracking-widest text-cream/70">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1">
              <span className="eyebrow">Our Services</span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Practices that transform</h2>
              <p className="mt-4 text-foreground/70">From daily mindfulness to sacred pilgrimages — a full spectrum of Buddhist practice, teaching and service.</p>
              <Link to="/services" className="btn-primary mt-8">Explore Services <ArrowRight className="size-4" /></Link>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
              {[
                { icon: Sparkles, t: "Meditation Training", d: "Vipassana, Samatha, healing and mindfulness." },
                { icon: BookOpen, t: "Dharma Teaching", d: "Live and recorded classes from senior teachers." },
                { icon: Sun, t: "Healing & Puja", d: "Traditional ceremonies for well-being & blessing." },
                { icon: Mountain, t: "Pilgrimage Tours", d: "Sacred journeys across India, Nepal, Tibet, Bhutan." },
                { icon: Users, t: "Buddhist Education", d: "Monastic and lay learning programmes." },
                { icon: Globe2, t: "Humanitarian Projects", d: "Charity, healthcare, food and education outreach." },
              ].map((s) => (
                <div key={s.t} className="bg-card p-6 rounded-lg border border-border hover:border-gold hover:shadow-[var(--shadow-soft)] transition group">
                  <div className="size-11 rounded-md grid place-items-center bg-secondary text-maroon group-hover:bg-maroon group-hover:text-cream transition">
                    <s.icon className="size-5" />
                  </div>
                  <h3 className="font-display text-xl mt-4 text-maroon">{s.t}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow">Video Gallery</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Healing, Meditation & Charity</h2>
            <p className="mt-4 text-foreground/70">Watch inspiring Dharma talks, healing sessions, meditation teachings and event highlights.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((v) => (
              <Link
                key={v.slug}
                to="/charity-events/$slug"
                params={{ slug: v.slug }}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer block"
              >
                <img src={v.image} alt={v.city} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--maroon-deep)]/90 via-[color:var(--maroon-deep)]/30 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <PlayCircle className="size-16 text-gold drop-shadow-lg group-hover:scale-110 transition" strokeWidth={1.2} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
                  <div className="text-xs uppercase tracking-widest text-gold">
                    {v.status === "upcoming" ? "Upcoming Charity Event" : "Charity Event"}
                  </div>
                  <div className="font-display text-xl mt-1">{v.city}, {v.country}</div>
                  <div className="text-xs opacity-80">Healing · Meditation · Dharma Teaching</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/charity-events" className="btn-primary">View All Charity Events <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <img src={peaceImg} alt="World peace prayer" loading="lazy" className="rounded-lg shadow-[var(--shadow-warm)] w-full" />
              <div className="absolute -bottom-6 -right-6 bg-gold text-maroon-deep p-6 rounded-lg max-w-[220px] hidden md:block">
                <div className="font-display text-3xl font-semibold">3</div>
                <div className="text-xs uppercase tracking-widest">Countries United<br />in Prayer</div>
              </div>
            </div>
            <div>
              <span className="eyebrow">World Peace Prayer Movement</span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Uniting hearts across sacred lands</h2>
              <div className="ornament-divider" />
              <div className="space-y-5">
                {[
                  { t: "1st India World Peace Prayers", p: "Kanheri Caves, Sanjay Gandhi National Park, Mumbai" },
                  { t: "1st China World Peace Prayers", p: "Mount Wutai (Wutai Shan), China" },
                  { t: "1st Sri Lanka World Peace Prayers", p: "Sri Pada (Adam's Peak), Sri Lanka" },
                ].map((e, i) => (
                  <div key={e.t} className="flex gap-4 pb-5 border-b border-border last:border-0">
                    <div className="size-10 shrink-0 grid place-items-center rounded-full bg-maroon text-gold font-display text-lg">{i + 1}</div>
                    <div>
                      <div className="font-display text-xl text-maroon">{e.t}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><MapPin className="size-3.5" /> {e.p}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/peace-prayers" className="btn-primary mt-8">Join the Movement <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-secondary/50">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="eyebrow">Testimonials</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Voices from the sangha</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: "The Ngyungne retreat opened something in me I didn't know existed. I returned home lighter, kinder and more awake.", n: "Priya S.", r: "Delhi, India" },
              { q: "BTMC's teachers are extraordinary. The clarity of the Dharma teachings combined with genuine compassion changed my daily life.", n: "James O.", r: "London, UK" },
              { q: "Volunteering with the charity programme showed me the living face of Buddhism — wisdom expressed as service to all beings.", n: "Tenzin D.", r: "Kathmandu, Nepal" },
            ].map((t) => (
              <div key={t.n} className="bg-card p-8 rounded-lg border border-border">
                <div className="text-gold text-4xl font-display leading-none">&ldquo;</div>
                <p className="text-foreground/80 leading-relaxed mt-2">{t.q}</p>
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="font-semibold text-maroon">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x text-center">
          <span className="eyebrow">Our Official Partners</span>
          <h2 className="font-display text-3xl mt-3 text-maroon mb-10">In service, together</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              ["Dharma Television HD", "Media Partner"],
              ["Padma Sambhava Trip", "Travel Partner"],
              ["Pure Land Tours & Travels", "Pilgrimage Partner"],
              ["WAS Media Marketing", "IT Partner"],
              ["RDCCK, Nepal", "Monastic Education"],
            ].map(([n, r]) => (
              <div key={n} className="p-6 bg-card border border-border rounded-lg hover:border-gold transition">
                <div className="font-display text-lg text-maroon">{n}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{r}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 text-cream overflow-hidden" style={{ background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" }}>
        <div className="container-x relative text-center">
          <Heart className="size-10 mx-auto text-gold mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold">Support Our Mission</h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/85">
            Your generosity funds meditation education, humanitarian service, Buddhist
            preservation, free retreats and world peace initiatives. Every contribution
            spreads wisdom and compassion.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/donate" className="btn-gold">Donate Now</Link>
            <Link to="/support" className="btn-outline">Ways to Support</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function EventCard({ img, tag, title, date, venue, items, featured }: {
  img: string; tag: string; title: string; date: string; venue: string; items: string[]; featured?: boolean;
}) {
  return (
    <article className={`group rounded-lg overflow-hidden bg-card border transition hover:shadow-[var(--shadow-warm)] ${featured ? "border-gold ring-1 ring-gold/40" : "border-border"}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={img} alt={title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        <div className="absolute top-4 left-4 bg-maroon text-cream text-xs uppercase tracking-widest px-3 py-1.5 rounded">{tag}</div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl text-maroon leading-snug">{title}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-start gap-2"><Calendar className="size-4 mt-0.5 text-gold-deep shrink-0" />{date}</div>
          <div className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 text-gold-deep shrink-0" />{venue}</div>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-1.5 text-xs text-foreground/75">
          {items.map((i) => <li key={i} className="flex items-center gap-1.5"><span className="size-1 rounded-full bg-gold-deep" />{i}</li>)}
        </ul>
        <Link to="/register" className="mt-6 inline-flex items-center gap-1 font-semibold text-maroon hover:text-gold-deep text-sm">
          Register <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
  );
}


/* ---------------- Crowdfunding appeal ---------------- */

/** The long-term builds this appeal funds - see /projects for the full detail. */
const APPEAL_PROJECTS = [
  {
    icon: Landmark,
    title: "International Ngyungne Retreat Center",
    detail: "A dedicated sanctuary for intensive purification retreats and long-term meditation practice.",
  },
  {
    icon: School,
    title: "RDSCL Monastic College",
    detail: "Training the next generation of monks in Buddhist philosophy, ritual and practice.",
  },
  {
    icon: Building2,
    title: "Bodhi Teaching & Meditation Center",
    detail: "A city sanctuary for weekly meditation, Dharma classes and healing programmes in Delhi.",
  },
];

function CrowdfundingAppeal() {
  const [showBank, setShowBank] = useState(false);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Support BTMC Foundation India", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* the viewer dismissed the share sheet */
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/40">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 20%, var(--gold) 0%, transparent 45%), radial-gradient(circle at 88% 80%, var(--saffron) 0%, transparent 45%)",
        }}
      />

      <div className="container-x relative py-16 md:py-20">
        <div className="grid lg:grid-cols-5 gap-10 xl:gap-14 items-start">
          {/* Film */}
          <div className="lg:col-span-3">
            <YouTubeEmbed id="MJijWP2WtoQ" title="Help us build a home for the Dharma" />
          </div>

          {/* Appeal */}
          <div className="lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 border border-gold/40 text-gold-deep px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              <HandHeart className="size-3.5" /> Crowdfunding Appeal
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-semibold mt-4 text-maroon leading-[1.1]">
              Help us build a home for the <em className="text-gold-deep not-italic">Dharma</em>
            </h2>

            <p className="mt-5 text-foreground/75 leading-relaxed">
              BTMC Foundation offers its retreats, prayers and healing programmes freely - nobody is
              turned away for lack of means. That is only possible because people give. This appeal
              funds the sanctuaries where that work will continue for generations.
            </p>
            <p className="mt-3 text-foreground/75 leading-relaxed">
              Watch the film, then give whatever feels right. Every contribution, of any size,
              carries the same merit and moves the work forward.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/donate" className="btn-primary">
                <Heart className="size-4 fill-current" /> Donate Now
              </Link>
              <Link
                to="/membership"
                className="btn-outline"
                style={{ color: "var(--maroon)", borderColor: "var(--maroon)" }}
              >
                Become a Member
              </Link>
              <button
                onClick={share}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-4 py-2.5 text-sm font-semibold text-maroon hover:border-gold hover:bg-gold/10 transition"
              >
                {copied ? (<><Check className="size-4" /> Link copied</>) : (<><Share2 className="size-4" /> Share</>)}
              </button>
            </div>

            <p className="mt-4 inline-flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-gold-deep shrink-0 mt-px" />
              Donations are receipted, and 80G receipts are issued by email once verified.
            </p>
          </div>
        </div>

        {/* What the appeal builds */}
        <div className="mt-14">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground text-center">
            What your gift builds
          </h3>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {APPEAL_PROJECTS.map((p) => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-5 hover:border-gold transition">
                <p.icon className="size-6 text-gold-deep" />
                <div className="font-display text-lg text-maroon mt-3 leading-snug">{p.title}</div>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:text-gold-deep">
              See all our projects <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Direct bank transfer - the same account as the donate page */}
        <div className="mt-10 max-w-3xl mx-auto">
          <button
            onClick={() => setShowBank((v) => !v)}
            className="w-full inline-flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 text-left hover:border-gold transition"
            aria-expanded={showBank}
          >
            <span>
              <span className="block font-semibold text-maroon">Prefer a direct bank transfer?</span>
              <span className="block text-sm text-muted-foreground mt-0.5">
                Our account details, and where to send your payment screenshot.
              </span>
            </span>
            <ChevronDown className={`size-5 text-gold-deep shrink-0 transition-transform ${showBank ? "rotate-180" : ""}`} />
          </button>

          {showBank && (
            <div className="mt-4 space-y-4">
              <BankDetails
                title="Transfer directly to BTMC Foundation"
                note="After transferring, upload your payment screenshot on the donate page so we can verify your gift and send your receipt."
              />
              <div className="text-center">
                <Link to="/donate" className="btn-gold">
                  Upload Payment Screenshot <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
