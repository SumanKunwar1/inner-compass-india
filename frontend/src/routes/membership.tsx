import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { useState } from "react";
import {
  Check, Crown, ArrowRight, Users, Sparkles, ShieldCheck, ScrollText, Phone, Loader2,
} from "lucide-react";
import { commonMemberFacilities, membershipTerms } from "@/data/membership";
import { usePlans, usePlansLoaded, type SponsorshipPlan } from "@/lib/sponsorshipStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ApplicationForm } from "@/components/ApplicationForm";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Paid Membership Plan — Join BTMC Foundation India" },
      { name: "description", content: "Become a BTMC Foundation member from ₹9 a year. Basic, Silver, Gold, Premium and Lifetime memberships with retreat access, networking, skill development and community-service opportunities." },
    ],
  }),
  component: Membership,
});

function Membership() {
  const membershipTiers = usePlans("membership");
  const loaded = usePlansLoaded();
  const [joining, setJoining] = useState<SponsorshipPlan | null>(null);

  return (
    <Layout>
      <PageHero
        eyebrow="Paid Membership Plan"
        title="Building together, making change"
        subtitle="Join a growing community of members who receive facilities, services and opportunities — while supporting the Foundation's social-development work."
      />

      {/* Who it is for */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container-x py-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <p className="text-foreground/75 leading-relaxed max-w-3xl">
            Membership is open to eligible individuals, professionals, entrepreneurs, students,
            families and supporters who wish to become part of the BTMC Foundation community.
            Choose the category that suits you — every level includes an official membership
            registration number and access to Foundation programmes.
          </p>
          <div className="flex items-center gap-3 text-maroon">
            <Users className="size-8 text-gold-deep" />
            <div>
              <div className="font-display text-2xl">{membershipTiers.length || 5} categories</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {membershipTiers.length ? `from ${membershipTiers[0].feeLabel} per year` : "from ₹9 per year"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="section-y">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow">Membership Categories</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Choose your membership</h2>
            <p className="text-sm text-muted-foreground mt-3">
              Each category includes everything from the level below it, so benefits build as you go.
            </p>
          </div>

          {!loaded && (
            <div className="py-16 text-center text-muted-foreground">
              <Loader2 className="size-8 mx-auto animate-spin text-gold-deep" />
              <p className="mt-3 text-sm">Loading membership categories…</p>
            </div>
          )}
          {loaded && membershipTiers.length === 0 && (
            <div className="py-16 text-center border border-dashed border-border rounded-2xl text-muted-foreground text-sm">
              Membership categories are being updated. Please check back shortly.
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {membershipTiers.map((t) => (
              <article
                key={t.id}
                className={`relative rounded-2xl border p-6 flex flex-col transition ${
                  t.featured
                    ? "border-gold bg-gold/[0.06] shadow-[var(--shadow-warm)]"
                    : "border-border bg-card hover:border-gold"
                }`}
              >
                {t.featured && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-gold text-maroon-deep text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    <Crown className="size-3" /> Most popular
                  </span>
                )}
                <h3 className="font-display text-2xl text-maroon">{t.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 min-h-[2.5rem]">{t.tagline}</p>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-maroon">{t.feeLabel}</span>
                  <span className="text-sm text-muted-foreground">/ {(t.period || "").toLowerCase()}</span>
                </div>

                {t.inherits && (
                  <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-gold-deep">
                    Everything in {t.inherits}, plus:
                  </div>
                )}

                <ul className="mt-4 space-y-2.5 flex-1">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                      <Check className="size-4 text-gold-deep mt-0.5 shrink-0" />{b}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setJoining(t)}
                  className={`mt-6 w-full justify-center ${t.featured ? "btn-gold" : "btn-primary"}`}
                >
                  Join as {t.name.replace(" Member", "")} <ArrowRight className="size-4" />
                </button>
              </article>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-8 italic">
            Membership fees and categories may be revised by the BTMC Foundation from time to time.
          </p>
        </div>
      </section>

      {/* Common facilities */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow">Common Member Facilities</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Available to all members</h2>
            <p className="text-sm text-muted-foreground mt-3">
              Depending on your membership category and availability, members may receive access to:
            </p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 max-w-5xl mx-auto">
            {commonMemberFacilities.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                <Sparkles className="size-4 text-gold-deep mt-0.5 shrink-0" />{f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What membership funds */}
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="eyebrow">Where your membership goes</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Your membership at work</h2>
            <p className="text-foreground/75 leading-relaxed mt-4">
              Membership contributions help BTMC Foundation strengthen and expand its weekly and
              annual retreat programs and community initiatives — including education, skill
              development, awareness programs, social welfare, volunteering and other approved
              charitable activities.
            </p>
            <p className="text-foreground/75 leading-relaxed mt-4">
              Members become an important part of the Foundation's wider support network and can
              contribute through <strong className="text-maroon">participation, volunteering,
              knowledge, professional expertise and community engagement</strong>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-outline" style={{ color: "var(--maroon)", borderColor: "var(--maroon)" }}>
                Register for a retreat
              </Link>
              <Link to="/contact" className="btn-outline" style={{ color: "var(--maroon)", borderColor: "var(--maroon)" }}>
                <Phone className="size-4" /> Ask about membership
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h3 className="font-display text-2xl text-maroon inline-flex items-center gap-2">
              <ScrollText className="size-5 text-gold-deep" /> Membership terms
            </h3>
            <ol className="mt-5 space-y-3 list-decimal list-outside pl-5 marker:text-gold-deep marker:font-semibold">
              {membershipTerms.map((t) => (
                <li key={t} className="text-sm text-foreground/75 leading-relaxed pl-1">{t}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 text-cream overflow-hidden" style={{ background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" }}>
        <div className="container-x relative text-center">
          <ShieldCheck className="size-10 mx-auto text-gold mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold">
            Join BTMC Foundation — Connect, Learn, Contribute and Grow
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-cream/85">
            By becoming a paid member you gain access to a growing community while supporting
            meaningful social and community-development initiatives.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <button onClick={() => membershipTiers[0] && setJoining(membershipTiers[0])} disabled={!membershipTiers.length} className="btn-gold disabled:opacity-60">
              Become a Member <ArrowRight className="size-4" />
            </button>
            <Link to="/dharma-campaign" className="btn-outline">Explore Dharma Ideal Sponsorship</Link>
          </div>
        </div>
      </section>

      {/* Join dialog */}
      <Dialog open={!!joining} onOpenChange={(o) => !o && setJoining(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {joining && (
            <>
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-gold-deep">Membership · {joining.period}</div>
                <h3 className="font-display text-2xl text-maroon">Join as {joining.name}</h3>
              </div>
              <ApplicationForm plan={joining} kind="membership" onDone={() => setJoining(null)} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
