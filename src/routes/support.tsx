import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Heart, Users, Building2, Repeat, HandHeart, Globe2, ArrowRight } from "lucide-react";

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
    </Layout>
  );
}
