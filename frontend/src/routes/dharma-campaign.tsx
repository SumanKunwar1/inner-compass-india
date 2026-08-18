import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { useState } from "react";
import {
  ArrowRight, Check, Crown, ExternalLink, Tv, Building2, Users2, Sparkles,
  HeartHandshake, GraduationCap, Handshake,
} from "lucide-react";
import {
  dharmaIdealLevels, communitySponsorship, corporateSponsorship, corporateWellbeing,
  sponsorshipDisclaimer, DHARMA_IDEAL_URL, type SponsorLevel, type OrgSponsorship,
} from "@/data/membership";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";
import { addDonation } from "@/lib/submissionsStore";

export const Route = createFileRoute("/dharma-campaign")({
  head: () => ({
    meta: [
      { title: "Dharma Ideal Campaign & Sponsorship — BTMC Foundation India" },
      { name: "description", content: "Become a Dharma Ideal Sponsor. Choose from Gem (lifetime), Decade and annual sponsorship, or partner as a community or corporate organization with Dharma TV." },
    ],
  }),
  component: Campaign,
});

const nonPaid = [
  { t: "Dharma Ideal Coordinator", d: "Coordinate programmes and volunteers in your region." },
  { t: "Dharma Ideal Convenor", d: "Convene local gatherings, retreats and outreach." },
  { t: "Dharma Ideal Volunteer", d: "Serve the sangha with your time, skill and heart." },
];

type JoinTarget = { name: string; amount: number; label: string; period: string } | null;

function Campaign() {
  const [joining, setJoining] = useState<JoinTarget>(null);

  const open = (name: string, amount: number, label: string, period: string) =>
    setJoining({ name, amount, label, period });

  return (
    <Layout>
      <PageHero
        eyebrow="Dharma Ideal Campaign (DIC)"
        title="Become part of our international spiritual family"
        subtitle="Together we preserve Buddhist wisdom, support Dharma education and expand compassionate service worldwide."
      />

      {/* Intro + external site */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container-x py-10 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <p className="text-foreground/75 leading-relaxed max-w-3xl">
            Choose from three levels of Dharma Ideal Sponsorship Membership and receive a wide range of
            spiritual, religious, educational and cultural services — including Puja and ritual services,
            astrology, Buddhist teachings, meditation, Buddhist initiation, religious ceremonies,
            cultural practices, spiritual training and retreat programs. Sponsors may also have greetings
            and congratulatory messages broadcast on television and social media for birthdays,
            anniversaries and other important family occasions.
          </p>
          <a
            href={DHARMA_IDEAL_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-outline whitespace-nowrap"
            style={{ color: "var(--maroon)", borderColor: "var(--maroon)" }}
          >
            Visit dharmaideal.org <ExternalLink className="size-4" />
          </a>
        </div>
      </section>

      {/* Volunteer membership */}
      <section className="section-y">
        <div className="container-x">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
            <div className="p-8 bg-card border border-border rounded-2xl">
              <span className="eyebrow">Volunteer Membership</span>
              <h2 className="font-display text-3xl mt-3 text-maroon">Non-paid members</h2>
              <p className="text-foreground/70 mt-2 text-sm">
                Give your time and skill — no fee, only commitment.
              </p>
              <ul className="mt-6 space-y-4">
                {nonPaid.map((n) => (
                  <li key={n.t} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <HeartHandshake className="size-5 text-gold-deep shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-maroon">{n.t}</div>
                      <div className="text-sm text-muted-foreground">{n.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary mt-8">
                Volunteer With Us <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="p-8 rounded-2xl text-cream" style={{ background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" }}>
              <span className="eyebrow text-gold">Sponsor Membership</span>
              <h2 className="font-display text-3xl mt-3">Three levels of Dharma Ideal Sponsorship</h2>
              <p className="text-cream/80 mt-3 text-sm leading-relaxed">
                Sponsorship funds retreats, Dharma education, religious services, cultural preservation
                and humanitarian work — and brings your family a lifetime of spiritual support.
              </p>
              <div className="mt-6 grid gap-3">
                {dharmaIdealLevels.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    className="flex items-center justify-between gap-4 rounded-lg bg-cream/10 hover:bg-cream/15 border border-cream/15 px-4 py-3 transition"
                  >
                    <div>
                      <div className="font-medium">{l.name}</div>
                      <div className="text-xs text-cream/70">{l.period}</div>
                    </div>
                    <div className="font-display text-xl text-gold whitespace-nowrap">{l.feeLabel}</div>
                  </a>
                ))}
              </div>
              <p className="mt-6 text-xs text-cream/60">
                Organizations and businesses can also partner — see Community &amp; Corporate sponsorship below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Individual sponsor levels */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container-x py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow">Sponsorship Levels</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon">Become a Dharma Ideal Sponsor</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {dharmaIdealLevels.map((l) => (
              <SponsorCard key={l.id} level={l} onJoin={() => open(l.name, l.fee, l.feeLabel, l.period)} />
            ))}
          </div>
        </div>
      </section>

      {/* Community sponsorship */}
      <OrgSection
        data={communitySponsorship}
        icon={Users2}
        eyebrow="For organizations & communities"
        onJoin={() => open(communitySponsorship.name, communitySponsorship.fee, communitySponsorship.feeLabel, communitySponsorship.period)}
      />

      {/* Corporate sponsorship */}
      <OrgSection
        data={corporateSponsorship}
        icon={Building2}
        eyebrow="For businesses & corporates"
        tinted
        onJoin={() => open(corporateSponsorship.name, corporateSponsorship.fee, corporateSponsorship.feeLabel, corporateSponsorship.period)}
      >
        {/* Corporate well-being extra */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
          <h3 className="font-display text-2xl text-maroon inline-flex items-center gap-2">
            <GraduationCap className="size-5 text-gold-deep" /> Corporate well-being &amp; employee development
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Corporate sponsorship may additionally support a healthier, more compassionate, ethical and
            mindful workplace.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gold-deep">Sessions for</div>
              <ul className="mt-2 space-y-1.5">
                {corporateWellbeing.audiences.map((a) => (
                  <li key={a} className="text-sm text-foreground/80">{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gold-deep">Topics</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {corporateWellbeing.topics.map((t) => (
                  <span key={t} className="text-xs bg-secondary border border-border rounded-full px-2.5 py-1 text-foreground/75">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-gold-deep">Spiritual master visit</div>
              <ul className="mt-2 space-y-1.5">
                {corporateWellbeing.masterVisit.map((m) => (
                  <li key={m} className="text-sm text-foreground/80">{m}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Subject to the teacher's availability and prior scheduling.
              </p>
            </div>
          </div>
        </div>
      </OrgSection>

      {/* Vision */}
      <section className="relative py-20 text-cream overflow-hidden" style={{ background: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" }}>
        <div className="container-x relative text-center">
          <Sparkles className="size-10 mx-auto text-gold mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-semibold">Dharma TV partnership vision</h2>
          <p className="mt-5 max-w-3xl mx-auto text-cream/85 leading-relaxed">
            Through the Dharma Ideal Community and Corporate Sponsorship programmes, Dharma TV aims to
            create a platform where communities, organizations, businesses, spiritual institutions and
            socially responsible individuals work together.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gold">
            {["Dharma", "Buddhist Wisdom", "Culture", "Education", "Meditation", "Community Welfare", "Social Awareness", "Compassion", "Peace", "Ethical Living"].map((v) => (
              <span key={v} className="after:content-['•'] after:ml-4 after:opacity-40 last:after:content-['']">{v}</span>
            ))}
          </div>
          <p className="mt-8 font-display text-xl">
            Support Dharma. Empower Communities. Promote Culture. Build a Better Society.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-gold">Talk to Our Team <ArrowRight className="size-4" /></Link>
            <a href={DHARMA_IDEAL_URL} target="_blank" rel="noreferrer noopener" className="btn-outline">
              dharmaideal.org <ExternalLink className="size-4" />
            </a>
          </div>
          <p className="mt-10 text-xs text-cream/55 max-w-3xl mx-auto italic">{sponsorshipDisclaimer}</p>
        </div>
      </section>

      {/* Join dialog */}
      <Dialog open={!!joining} onOpenChange={(o) => !o && setJoining(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {joining && (
            <>
              <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-gold-deep">Dharma Ideal · {joining.period}</div>
                <h3 className="font-display text-2xl text-maroon">{joining.name}</h3>
              </div>
              <PaymentForm
                context="Sponsorship"
                itemLabel={`${joining.name} — ${joining.label} / ${joining.period}`}
                fixedAmount={joining.amount}
                note="Complete your sponsorship by transferring the amount below and uploading your payment screenshot. Our team will verify it and contact you to arrange your services and certificate."
                onRecord={(payload) =>
                  addDonation({
                    ...payload,
                    message: `Sponsorship: ${joining.name} (${joining.period})${payload.message ? ` — ${payload.message}` : ""}`,
                  })
                }
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

/* ---------------- pieces ---------------- */

function SponsorCard({ level, onJoin }: { level: SponsorLevel; onJoin: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? level.benefits : level.benefits.slice(0, 6);

  return (
    <article
      id={level.id}
      className={`scroll-mt-28 relative rounded-2xl border p-6 flex flex-col ${
        level.featured ? "border-gold bg-gold/[0.06] shadow-[var(--shadow-warm)]" : "border-border bg-card"
      }`}
    >
      {level.featured && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-gold text-maroon-deep text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          <Crown className="size-3" /> Lifetime
        </span>
      )}
      <h3 className="font-display text-2xl text-maroon">{level.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">{level.tagline}</p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl text-maroon">{level.feeLabel}</span>
        <span className="text-sm text-muted-foreground">/ {level.period.toLowerCase()}</span>
      </div>

      <ul className="mt-5 space-y-2.5 flex-1">
        {shown.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check className="size-4 text-gold-deep mt-0.5 shrink-0" />{b}
          </li>
        ))}
      </ul>

      {level.benefits.length > 6 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 text-sm font-semibold text-maroon hover:text-gold-deep text-left"
        >
          {expanded ? "Show fewer benefits" : `Show all ${level.benefits.length} benefits`}
        </button>
      )}

      <button onClick={onJoin} className={`mt-6 w-full justify-center ${level.featured ? "btn-gold" : "btn-primary"}`}>
        Become a Sponsor <ArrowRight className="size-4" />
      </button>
    </article>
  );
}

function OrgSection({ data, icon: Icon, eyebrow, tinted, onJoin, children }: {
  data: OrgSponsorship;
  icon: typeof Users2;
  eyebrow: string;
  tinted?: boolean;
  onJoin: () => void;
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? data.benefits : data.benefits.slice(0, 8);

  return (
    <section id={data.id} className={`scroll-mt-24 section-y ${tinted ? "bg-secondary/30 border-y border-border" : ""}`}>
      <div className="container-x">
        {/* A plain 5-column grid rather than an arbitrary template, so the two
            columns cannot collapse into one and overlap. */}
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/*
           * Left — identity. Deliberately not sticky: this column has no background
           * of its own, so a stuck panel let the right column's content scroll
           * through it wherever the two ended up sharing horizontal space.
           */}
          <div className="lg:col-span-2">
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="font-display text-4xl font-semibold mt-2 text-maroon flex items-center gap-3">
              <Icon className="size-8 text-gold-deep shrink-0" /> {data.name}
            </h2>
            <p className="text-foreground/75 mt-4 leading-relaxed">{data.intro}</p>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl text-maroon">{data.feeLabel}</span>
                <span className="text-sm text-muted-foreground">{data.feeNote}</span>
              </div>
              <div className="text-xs uppercase tracking-widest text-gold-deep mt-1">
                Sponsorship period · {data.period}
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-foreground/80">
                <Handshake className="size-4 text-gold-deep shrink-0" />
                Recognized as <strong className="text-maroon">&ldquo;{data.recognition}&rdquo;</strong>
              </div>
              <button onClick={onJoin} className="btn-primary w-full justify-center mt-5">
                Become a {data.id === "community" ? "Community" : "Corporate"} Partner <ArrowRight className="size-4" />
              </button>
            </div>

            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suitable for</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.suitableFor.map((s) => (
                  <span key={s} className="text-xs bg-secondary border border-border rounded-full px-2.5 py-1 text-foreground/75">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — benefits */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h3 className="font-display text-2xl text-maroon inline-flex items-center gap-2">
                <Tv className="size-5 text-gold-deep" /> Media &amp; Dharma TV benefits
              </h3>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {data.mediaBenefits.map((m) => (
                  <div key={m.title} className="rounded-xl border border-border bg-card p-4">
                    <div className="font-medium text-maroon text-sm">{m.title}</div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{m.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl text-maroon">Services &amp; benefits</h3>
              <ul className="mt-4 space-y-2.5">
                {shown.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="size-4 text-gold-deep mt-0.5 shrink-0" />{b}
                  </li>
                ))}
              </ul>
              {data.benefits.length > 8 && (
                <button
                  onClick={() => setExpanded((e) => !e)}
                  className="mt-4 text-sm font-semibold text-maroon hover:text-gold-deep"
                >
                  {expanded ? "Show fewer benefits" : `Show all ${data.benefits.length} benefits`}
                </button>
              )}
            </div>

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
