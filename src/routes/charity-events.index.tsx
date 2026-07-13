import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Calendar, MapPin, ArrowRight, Heart, Sparkles, HandHeart, Clock, Hourglass } from "lucide-react";
import { charityEvents } from "@/data/charityEvents";

export const Route = createFileRoute("/charity-events/")({
  head: () => ({
    meta: [
      { title: "Charity Events — BTMC Foundation India" },
      { name: "description", content: "Healing, meditation, Dharma discourse and charity events with Venerable Dr. Khen Rinpoche Sonam Gyurme across India. Join us for blessings, purification and inner peace." },
    ],
  }),
  component: CharityEvents,
});

function CharityEvents() {
  const upcoming = charityEvents.filter((e) => e.status === "upcoming");
  const past = charityEvents.filter((e) => e.status === "past");

  return (
    <Layout>
      <PageHero
        eyebrow="Charity Events"
        title="Healing · Meditation · Dharma Discourse · Charity"
        subtitle="Special spiritual gatherings with Venerable Dr. Khen Rinpoche Sonam Gyurme — for healing, blessings, purification and inner peace. Everyone is warmly welcome."
      />

      {upcoming.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow">Upcoming</span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Join our next gathering</h2>
              <p className="mt-4 text-foreground/70">Reserve your seat for our upcoming healing, meditation and blessing ceremony.</p>
            </div>

            <div className="grid gap-8">
              {upcoming.map((e) => (
                <article key={e.slug} className="grid lg:grid-cols-[1.1fr_1fr] rounded-2xl overflow-hidden border border-gold ring-1 ring-gold/30 bg-card shadow-[var(--shadow-warm)]">
                  <Link to="/charity-events/$slug" params={{ slug: e.slug }} className="group relative min-h-[300px] block">
                    <img src={e.image} alt={e.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--maroon-deep)]/90 via-[color:var(--maroon-deep)]/25 to-transparent" />
                    <div className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-gold text-maroon-deep text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      <Sparkles className="size-3.5" /> Upcoming Event
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-cream">
                      <div className="text-xs uppercase tracking-widest text-gold">{e.city}, {e.country}</div>
                      <div className="font-display text-2xl md:text-3xl mt-1 leading-tight">{e.title}</div>
                    </div>
                  </Link>
                  <div className="p-7 md:p-9">
                    <p className="text-foreground/80 leading-relaxed">{e.tagline}</p>
                    <div className="mt-5 space-y-2.5 text-sm">
                      <div className="flex items-start gap-2.5"><Calendar className="size-4 mt-0.5 text-gold-deep shrink-0" /><span className="font-medium">{e.date}</span></div>
                      <div className="flex items-start gap-2.5"><MapPin className="size-4 mt-0.5 text-gold-deep shrink-0" /><span>{e.venue} · {e.venueNote}</span></div>
                      <div className="flex items-start gap-2.5"><Heart className="size-4 mt-0.5 text-gold-deep shrink-0" /><span>With {e.teacher}</span></div>
                    </div>

                    {e.sessions.length > 0 && (
                      <div className="mt-6 grid sm:grid-cols-2 gap-3">
                        {e.sessions.map((s) => (
                          <div key={s.name} className="rounded-lg border border-border bg-secondary/40 p-4">
                            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-deep"><Clock className="size-3.5" />{s.time}</div>
                            <div className="font-display text-lg text-maroon mt-1 leading-snug">{s.name}</div>
                            <div className="text-sm font-semibold text-maroon mt-2">{s.donation}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-7">
                      <Link to="/charity-events/$slug" params={{ slug: e.slug }} className="btn-gold w-full sm:w-auto">
                        View Details & Book <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="section-y bg-secondary/50">
          <div className="container-x">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow">Past Gatherings</span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Blessings shared across India</h2>
              <p className="mt-4 text-foreground/70">A glimpse of the healing and charity events we have hosted in cities across the country.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {past.map((e) => {
                const Card = (
                  <>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={e.image} alt={e.city} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--maroon-deep)]/80 to-transparent" />
                      {!e.detailsAvailable && (
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-cream/90 text-maroon text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                          <Hourglass className="size-3" /> Coming soon
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
                        <div className="text-xs uppercase tracking-widest text-gold">{e.city}, {e.country}</div>
                        <div className="font-display text-xl mt-1">{e.title}</div>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-foreground/70">{e.tagline}</p>
                      {e.detailsAvailable ? (
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-maroon group-hover:text-gold-deep">
                          Read more <ArrowRight className="size-4" />
                        </span>
                      ) : (
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
                          <Hourglass className="size-3.5" /> Full details coming soon
                        </span>
                      )}
                    </div>
                  </>
                );
                return e.detailsAvailable ? (
                  <Link key={e.slug} to="/charity-events/$slug" params={{ slug: e.slug }} className="group rounded-xl overflow-hidden bg-card border border-border hover:shadow-[var(--shadow-warm)] hover:border-gold transition">
                    {Card}
                  </Link>
                ) : (
                  <div key={e.slug} className="group rounded-xl overflow-hidden bg-card border border-border">
                    {Card}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="relative py-20 text-cream overflow-hidden" style={{ background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" }}>
        <div className="container-x relative text-center">
          <HandHeart className="size-10 mx-auto text-gold mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold">Every seat is an act of generosity</h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/85">
            Your contribution to our charity events directly supports free meditation retreats,
            humanitarian service and the preservation of authentic Buddhist teachings.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/charity-events/$slug" params={{ slug: charityEvents[0].slug }} className="btn-gold">Book Your Seat</Link>
            <Link to="/donate" className="btn-outline">Donate</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
