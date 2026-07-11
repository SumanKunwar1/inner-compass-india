import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { CheckCircle2, Download, Home, Calendar, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({ ref: z.string().optional() });

export const Route = createFileRoute("/registration-success")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Registration Confirmed — BTMC Foundation India" },
      { name: "description", content: "Thank you for registering with BTMC Foundation India. Your registration is confirmed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RegistrationSuccess,
});

type Saved = {
  ref: string;
  submittedAt: string;
  program: string;
  fullName: string;
  email: string;
  mobile: string;
  arrival: string;
  departure: string;
  accommodation: string;
  photoPreview?: string;
};

function RegistrationSuccess() {
  const { ref } = Route.useSearch();
  const [data, setData] = useState<Saved | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("btmc:lastRegistration");
      if (raw) {
        const parsed = JSON.parse(raw) as Saved;
        if (!ref || parsed.ref === ref) setData(parsed);
      }
    } catch { /* ignore */ }
  }, [ref]);

  const downloadReceipt = () => {
    if (!data) return;
    const lines = [
      "BTMC FOUNDATION INDIA — Registration Confirmation",
      "==================================================",
      `Reference:      ${data.ref}`,
      `Submitted:      ${new Date(data.submittedAt).toLocaleString()}`,
      "",
      `Name:           ${data.fullName}`,
      `Email:          ${data.email}`,
      `Mobile:         ${data.mobile}`,
      "",
      `Program:        ${data.program}`,
      `Arrival:        ${data.arrival}`,
      `Departure:      ${data.departure}`,
      `Accommodation:  ${data.accommodation}`,
      "",
      "Please keep this reference number for all correspondence.",
      "Contact: info@btmcfoundation.in · +91-8178804502",
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BTMC-Registration-${data.ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <PageHero
        eyebrow="Confirmation"
        title="Your registration is confirmed"
        subtitle="Sarva Mangalam — may your path be blessed. We look forward to welcoming you."
      />
      <section className="section-y">
        <div className="container-x max-w-3xl">
          <div className="p-8 rounded-lg border border-gold bg-gold/5 text-center">
            <CheckCircle2 className="size-14 mx-auto text-gold-deep" />
            <h2 className="font-display text-3xl text-maroon mt-4">Thank you{data ? `, ${data.fullName.split(" ")[0]}` : ""}!</h2>
            <p className="text-foreground/75 mt-2">
              Your registration has been received. A confirmation email will arrive shortly at
              {data ? <> <span className="font-medium text-maroon">{data.email}</span></> : " your registered email address"}.
            </p>
            {(ref || data?.ref) && (
              <div className="mt-6 inline-block px-6 py-3 bg-background border border-border rounded font-mono text-sm">
                Reference: <span className="text-maroon font-semibold">{data?.ref ?? ref}</span>
              </div>
            )}
          </div>

          {data && (
            <div className="mt-8 grid sm:grid-cols-2 gap-4 p-6 bg-card border border-border rounded-lg">
              <Detail label="Program" value={data.program} />
              <Detail label="Accommodation" value={data.accommodation} />
              <Detail label="Arrival" value={data.arrival} icon={Calendar} />
              <Detail label="Departure" value={data.departure} icon={Calendar} />
              <Detail label="Email" value={data.email} icon={Mail} />
              <Detail label="Mobile" value={data.mobile} icon={Phone} />
            </div>
          )}

          <div className="mt-8 p-6 bg-secondary/60 border border-border rounded-lg">
            <h3 className="font-display text-xl text-maroon">Next steps</h3>
            <ol className="mt-3 space-y-2 text-sm text-foreground/80 list-decimal list-inside">
              <li>Check your email inbox (and spam folder) for the confirmation.</li>
              <li>If a programme fee applies, complete payment through the secure link we send.</li>
              <li>Review the pre-retreat guidance and packing list we share ahead of your arrival.</li>
              <li>Save the reference number above for all further correspondence.</li>
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button onClick={downloadReceipt} disabled={!data} className="btn-primary disabled:opacity-60">
              <Download className="size-4" /> Download Receipt
            </button>
            <Link to="/events" className="inline-flex items-center gap-2 px-5 py-3 rounded border border-maroon text-maroon hover:bg-maroon hover:text-cream transition font-medium"><Calendar className="size-4" /> View Events</Link>
            <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded border border-maroon text-maroon hover:bg-maroon hover:text-cream transition font-medium"><Home className="size-4" /> Back to Home</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Detail({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-gold-deep">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-foreground">
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        <span className="font-medium">{value}</span>
      </div>
    </div>
  );
}
