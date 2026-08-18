import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Heart, Users, Building2, Repeat, HandHeart, Globe2, ArrowRight, BadgeCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Our Mission — BTMC Foundation India" },
      { name: "description", content: "Donate, sponsor, volunteer or partner with BTMC Foundation India to spread wisdom, compassion and peace." },
    ],
  }),
  component: Support,
});

const ways = [
  { i: Heart, t: "Donations", d: "One-time gifts of any amount — every rupee supports service." },
  { i: HandHeart, t: "Sponsorship", d: "Sponsor a retreat, meal, participant or entire ceremony." },
  { i: Building2, t: "Corporate Partnership", d: "Align your organization with our humanitarian mission." },
  { i: Repeat, t: "Monthly Giving", d: "Sustained monthly support for ongoing programmes." },
  { i: Users, t: "Volunteer Service", d: "Serve in India or Nepal — teachers, organisers, medical, media." },
  { i: Globe2, t: "International Collaboration", d: "Partner as an organization or overseas sangha." },
];

function Support() {
  return (
    <Layout>
      <PageHero eyebrow="Support Our Mission" title="Every contribution spreads wisdom & peace" subtitle="Your generosity funds meditation education, humanitarian service, Buddhist preservation and world peace initiatives." />
      <section className="section-y">
        <div className="container-x grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ways.map((w) => (
            <div key={w.t} className="p-6 bg-card border border-border rounded-lg hover:border-gold transition group">
              <div className="size-12 rounded-md grid place-items-center bg-secondary text-maroon group-hover:bg-maroon group-hover:text-cream transition">
                <w.i className="size-6" />
              </div>
              <h3 className="font-display text-xl text-maroon mt-4">{w.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{w.d}</p>
            </div>
          ))}
        </div>
        <div className="container-x mt-12 text-center">
          <Link to="/donate" className="btn-primary">Donate Now <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      {/* Structured programmes */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow">Ongoing Programmes</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Join as a member or sponsor</h2>
            <p className="text-sm text-muted-foreground mt-3">
              Beyond one-off gifts, our membership and sponsorship programmes offer lasting facilities,
              services and recognition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-8 flex flex-col">
              <BadgeCheck className="size-8 text-gold-deep" />
              <h3 className="font-display text-2xl text-maroon mt-4">Paid Membership Plan</h3>
              <p className="text-sm text-foreground/75 mt-2 flex-1 leading-relaxed">
                Five categories from ₹9 a year — Basic, Silver, Gold, Premium and Lifetime.
                Members receive a registration number, certificates, retreat access, networking,
                skill-development programmes and recognition.
              </p>
              <Link to="/membership" className="btn-primary mt-6 w-full justify-center">
                View Membership Plans <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-gold bg-gold/[0.06] p-8 flex flex-col">
              <Sparkles className="size-8 text-gold-deep" />
              <h3 className="font-display text-2xl text-maroon mt-4">Dharma Ideal Sponsorship</h3>
              <p className="text-sm text-foreground/75 mt-2 flex-1 leading-relaxed">
                Gem (lifetime), Decade and annual sponsorship for families — plus Community and
                Corporate partnership with Dharma TV, including Puja services, ceremonies, media
                recognition and spiritual programmes.
              </p>
              <Link to="/dharma-campaign" className="btn-gold mt-6 w-full justify-center">
                Explore Sponsorship <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
