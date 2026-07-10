import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dharma-campaign")({
  head: () => ({
    meta: [
      { title: "Dharma Ideal Campaign — BTMC Foundation India" },
      { name: "description", content: "Join the international spiritual family through volunteer and sponsor membership categories of the Dharma Ideal Campaign." },
    ],
  }),
  component: Campaign,
});

const nonPaid = ["Dharma Ideal Coordinator", "Dharma Ideal Convenor", "Dharma Ideal Volunteer"];
const paid = [
  "Dharma Ideal Sponsor",
  "Dharma Ideal Decade Sponsor",
  "Dharma Ideal Gem Sponsor (Lifetime)",
  "Dharma Ideal Organization Sponsor",
  "Dharma Ideal Corporate Sponsor",
];

function Campaign() {
  return (
    <Layout>
      <PageHero eyebrow="Dharma Ideal Campaign (DIC)" title="Become part of our international spiritual family" subtitle="Together we preserve Buddhist wisdom and expand compassionate service worldwide." />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-2 gap-8">
          <div className="p-10 bg-card border border-border rounded-lg">
            <span className="eyebrow">Volunteer Membership</span>
            <h2 className="font-display text-3xl mt-3 text-maroon">Non-Paid Members</h2>
            <p className="text-foreground/70 mt-2">Serve the sangha with your time, skill and heart.</p>
            <ul className="mt-8 space-y-3">
              {nonPaid.map((n) => (
                <li key={n} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                  <span className="size-2 rounded-full bg-gold-deep" />
                  <span className="font-medium text-foreground/85">{n}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-primary mt-8">Volunteer With Us <ArrowRight className="size-4" /></Link>
          </div>

          <div className="p-10 rounded-lg text-cream" style={{ background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" }}>
            <span className="eyebrow text-gold">Sponsor Membership</span>
            <h2 className="font-display text-3xl mt-3">Paid Sponsors</h2>
            <p className="text-cream/80 mt-2">Fund retreats, education and humanitarian service worldwide.</p>
            <ul className="mt-8 space-y-3">
              {paid.map((n) => (
                <li key={n} className="flex items-center gap-3 pb-3 border-b border-cream/10 last:border-0">
                  <span className="size-2 rounded-full bg-gold" />
                  <span className="font-medium">{n}</span>
                </li>
              ))}
            </ul>
            <Link to="/donate" className="btn-gold mt-8">Become a Sponsor <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
