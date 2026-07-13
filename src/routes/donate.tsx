import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Heart, ShieldCheck, HandHeart, Sparkles, BookOpen } from "lucide-react";
import { PaymentForm } from "@/components/PaymentForm";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — BTMC Foundation India" },
      { name: "description", content: "Support meditation education and humanitarian service. Make a secure donation via UPI or bank transfer and upload your payment screenshot." },
    ],
  }),
  component: Donate,
});

const impact = [
  { i: Sparkles, t: "Free Meditation Retreats", d: "Fund weekly 2-day retreats in Kathmandu." },
  { i: HandHeart, t: "Humanitarian Charity", d: "Food, healthcare and education outreach." },
  { i: BookOpen, t: "Dharma Preservation", d: "Teachings, translation and online classes." },
];

function Donate() {
  return (
    <Layout>
      <PageHero eyebrow="Donate Now" title="Your gift, their awakening" subtitle="Every contribution supports free meditation retreats, charity, world peace prayers and Dharma education." />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-[3fr_2fr] gap-10 items-start">
          <div className="p-6 md:p-8 bg-card border border-border rounded-2xl">
            <h2 className="font-display text-3xl text-maroon">Make your contribution</h2>
            <p className="text-muted-foreground mt-2">
              Choose an amount, transfer it to our account and upload the screenshot — our team will
              verify your gift and send your 80G receipt by email.
            </p>
            <div className="mt-6">
              <PaymentForm
                context="Donation"
                presetAmounts={[500, 1100, 2100, 5100, 11000, 21000]}
              />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-2xl text-maroon">Where your gift goes</h3>
              <ul className="mt-5 space-y-4">
                {impact.map((m) => (
                  <li key={m.t} className="flex gap-3">
                    <div className="size-10 shrink-0 grid place-items-center rounded-lg bg-secondary text-gold-deep">
                      <m.i className="size-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-maroon">{m.t}</div>
                      <div className="text-sm text-muted-foreground">{m.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl p-6 bg-gold/10 border border-gold">
              <div className="flex items-center gap-2 text-maroon">
                <ShieldCheck className="size-5 text-gold-deep" />
                <div className="font-display text-lg">80G Tax Benefit</div>
              </div>
              <p className="text-sm text-foreground/75 mt-2">
                Donations to BTMC Foundation India are eligible for tax deduction under Section 80G of the
                Income Tax Act. Add your PAN in the form to receive an 80G receipt.
              </p>
            </div>

            <div className="rounded-2xl p-6 text-cream" style={{ background: "var(--maroon)" }}>
              <Heart className="size-6 text-gold" />
              <p className="text-sm text-cream/90 mt-3 leading-relaxed">
                "May all beings be happy." Thank you for your generosity — every gift, large or small,
                helps spread wisdom and compassion.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
