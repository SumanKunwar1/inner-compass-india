import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { Heart, CreditCard, Smartphone, QrCode, Landmark } from "lucide-react";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — BTMC Foundation India" },
      { name: "description", content: "Support meditation education and humanitarian service. Secure donations via Paytm, GPay, UPI, card and net banking." },
    ],
  }),
  component: Donate,
});

const amounts = [500, 1100, 2100, 5100, 11000, 21000];
const methods = [
  { i: Smartphone, t: "Paytm" },
  { i: Smartphone, t: "Google Pay" },
  { i: QrCode, t: "UPI / QR Code" },
  { i: CreditCard, t: "Credit / Debit Card" },
  { i: Landmark, t: "Net Banking" },
  { i: CreditCard, t: "International Cards" },
];

function Donate() {
  return (
    <Layout>
      <PageHero eyebrow="Donate Now" title="Your gift, their awakening" subtitle="Every contribution supports free meditation retreats, charity, world peace prayers and Dharma education." />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-[3fr_2fr] gap-10">
          <div className="p-8 bg-card border border-border rounded-lg">
            <h2 className="font-display text-3xl text-maroon">Choose your contribution</h2>
            <p className="text-muted-foreground mt-2">All donations directly support our programs.</p>

            <div className="mt-8">
              <label className="text-sm font-semibold text-foreground/80">Donation Type</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {["One-time", "Monthly", "Annual"].map((t, i) => (
                  <button key={t} className={`py-3 rounded border font-medium text-sm ${i === 0 ? "bg-maroon text-cream border-maroon" : "border-border hover:border-gold"}`}>{t}</button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-foreground/80">Amount (₹)</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {amounts.map((a) => (
                  <button key={a} className="py-3 rounded border border-border hover:border-gold hover:bg-gold/10 font-semibold text-maroon">₹{a.toLocaleString("en-IN")}</button>
                ))}
              </div>
              <input type="number" placeholder="Enter custom amount" className="mt-3 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <input placeholder="Full Name" className="px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
              <input placeholder="Email Address" className="px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
              <input placeholder="Mobile Number" className="px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
              <input placeholder="PAN (for 80G receipt)" className="px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
            </div>

            <button type="button" className="btn-primary w-full mt-8 justify-center text-base py-4">
              <Heart className="size-4 fill-current" /> Donate Securely
            </button>
          </div>

          <div>
            <h3 className="font-display text-2xl text-maroon">Secure Payment Methods</h3>
            <p className="text-sm text-muted-foreground mt-1">All transactions are encrypted and secure.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {methods.map((m) => (
                <div key={m.t} className="p-4 bg-card border border-border rounded flex items-center gap-3">
                  <m.i className="size-5 text-gold-deep" />
                  <span className="text-sm font-medium">{m.t}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-lg bg-gold/10 border border-gold">
              <div className="font-display text-lg text-maroon">80G Tax Benefit</div>
              <p className="text-sm text-foreground/75 mt-2">Donations to BTMC Foundation India are eligible for tax deduction under Section 80G of the Income Tax Act.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
