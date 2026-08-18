import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Link } from "@tanstack/react-router";
import { Crown, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/sponsors")({
  head: () => ({
    meta: [
      { title: "Event Sponsors — BTMC Foundation India" },
      { name: "description", content: "Sponsorship categories: title, platinum, gold, silver, food, medical, transport, hospitality, education, media and charity partners." },
    ],
  }),
  component: Sponsors,
});

const tiers = [
  { t: "Title Sponsorship", d: "Lead sponsorship of a major retreat, ceremony or peace prayer.", featured: true },
  { t: "Platinum Sponsorship", d: "Premium recognition across all event platforms." },
  { t: "Gold Sponsorship", d: "Major partner with prominent recognition." },
  { t: "Silver Sponsorship", d: "Community-level sponsor recognition." },
  { t: "Food Sponsorship", d: "Support meals for retreat participants and monastics." },
  { t: "Medical Sponsorship", d: "Provide healthcare and first-aid support." },
  { t: "Transportation Sponsorship", d: "Fund travel and logistics for programmes." },
  { t: "Hospitality Sponsorship", d: "Accommodate participants and international guests." },
  { t: "Education Sponsorship", d: "Support scholarships and Dharma education." },
  { t: "Media Partnership", d: "Amplify our mission through media coverage." },
  { t: "Charity Partnership", d: "Collaborate on humanitarian programs." },
];

function Sponsors() {
  return (
    <Layout>
      <PageHero eyebrow="Event Sponsors" title="Support our mission" subtitle="Sponsors receive recognition across our website, publications, event stages and digital media." />
      <section className="section-y">
        <div className="container-x grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiers.map((s) => (
            <div key={s.t} className={`p-6 rounded-lg border transition ${s.featured ? "bg-gold/10 border-gold" : "bg-card border-border hover:border-gold"}`}>
              <Crown className={`size-6 ${s.featured ? "text-gold-deep" : "text-muted-foreground"}`} />
              <h3 className="font-display text-xl text-maroon mt-4">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pointer to the structured Dharma Ideal programme */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container-x py-14 text-center max-w-3xl mx-auto">
          <span className="eyebrow">Looking for a formal sponsorship programme?</span>
          <h2 className="font-display text-3xl font-semibold mt-2 text-maroon">Dharma Ideal Sponsorship</h2>
          <p className="text-foreground/75 mt-4 leading-relaxed">
            Event sponsorship above is arranged per programme. For a defined annual, decade or lifetime
            sponsorship — with Puja services, ceremonies, certificates and Dharma TV media benefits
            — see the Dharma Ideal Campaign, which also covers Community and Corporate partnership.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link to="/dharma-campaign" className="btn-primary">View Dharma Ideal Sponsorship <ArrowRight className="size-4" /></Link>
            <Link to="/membership" className="btn-outline" style={{ color: "var(--maroon)", borderColor: "var(--maroon)" }}>Membership Plans</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
