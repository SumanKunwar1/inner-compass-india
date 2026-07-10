import { createFileRoute } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — BTMC Foundation India" },
      { name: "description", content: "Register online for meditation retreats, courses and charity events. Secure registration in just a few minutes." },
    ],
  }),
  component: Register,
});

const fields = [
  ["Full Name", "text"], ["Gender", "text"], ["Date of Birth", "date"],
  ["Nationality", "text"], ["Passport / Citizenship / ID Number", "text"],
  ["Mobile Number", "tel"], ["WhatsApp Number", "tel"],
  ["Email Address", "email"], ["Residential Address", "text"],
  ["Emergency Contact", "text"], ["Occupation", "text"],
  ["Medical History", "text"], ["Dietary Requirements", "text"],
  ["Arrival Date", "date"], ["Departure Date", "date"],
] as const;

function Register() {
  return (
    <Layout>
      <PageHero eyebrow="Online Registration" title="Register for retreats, courses & events" subtitle="Complete your registration securely in just a few minutes." />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-[2fr_1fr] gap-10">
          <form className="p-8 bg-card rounded-lg border border-border space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-sm font-semibold text-foreground/80">Program Selection</label>
              <select className="mt-2 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold">
                <option>Weekly 2-Day Free Meditation Retreat</option>
                <option>3rd International Ngyungne Retreat</option>
                <option>2nd Nepal World Peace Prayers</option>
                <option>Online Dharma Class</option>
                <option>Pilgrimage Tour</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {fields.map(([l, t]) => (
                <div key={l}>
                  <label className="text-sm font-semibold text-foreground/80">{l}</label>
                  <input type={t} className="mt-1 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-foreground/80">Passport Size Photograph</label>
                <input type="file" accept="image/*" className="mt-1 w-full px-4 py-3 border border-input rounded bg-background text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Accommodation Preference</label>
                <select className="mt-1 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold">
                  <option>Shared Dormitory</option>
                  <option>Private Room</option>
                  <option>Own Arrangement</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Digital Signature</label>
                <input placeholder="Type your full name" className="mt-1 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold" />
              </div>
            </div>
            <label className="flex items-start gap-3 text-sm text-foreground/75">
              <input type="checkbox" className="mt-1" />
              I hereby declare that the information provided is true and consent to BTMC Foundation India's terms of participation.
            </label>
            <button type="submit" className="btn-primary w-full justify-center text-base py-4">Complete Registration</button>
          </form>

          <aside>
            <div className="p-6 bg-secondary/60 rounded-lg border border-border">
              <h3 className="font-display text-2xl text-maroon">What happens next?</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  "Confirmation email with event details",
                  "Secure payment link for programme fees (if applicable)",
                  "Pre-retreat guidance and packing list",
                  "Personal welcome from our team",
                ].map((s) => (
                  <li key={s} className="flex gap-2"><CheckCircle2 className="size-4 text-gold-deep mt-0.5 shrink-0" />{s}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 mt-4 rounded-lg text-cream" style={{ background: "var(--maroon)" }}>
              <div className="font-display text-lg">Need help registering?</div>
              <p className="text-sm text-cream/85 mt-2">Call +91-8178804502 or email info@btmcfoundation.in</p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
