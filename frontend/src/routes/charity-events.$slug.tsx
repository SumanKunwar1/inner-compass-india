import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import {
  Calendar, MapPin, Phone, Mail, Globe, ArrowLeft, CheckCircle2, Upload, X,
  Loader2, Heart, Sparkles, PartyPopper, Ticket, SearchX,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { getCharityEvent, type CharityEvent } from "@/data/charityEvents";
import { useEvent, addBooking } from "@/lib/charityStore";
import { BankDetails } from "@/components/BankDetails";
import { RichText } from "@/components/admin/RichText";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const Route = createFileRoute("/charity-events/$slug")({
  head: ({ params }) => {
    const event = getCharityEvent(params.slug);
    return {
      meta: [
        { title: event ? `${event.title} — ${event.city} | BTMC Foundation India` : "Charity Event — BTMC Foundation India" },
        { name: "description", content: event?.intro ?? "BTMC Foundation India charity event." },
      ],
    };
  },
  component: CharityEventDetail,
});

function CharityEventDetail() {
  const { slug } = Route.useParams();
  const event = useEvent(slug);
  const [bookOpen, setBookOpen] = useState(false);

  if (!event) {
    return (
      <Layout>
        <section className="section-y">
          <div className="container-x max-w-lg text-center">
            <SearchX className="size-12 mx-auto text-muted-foreground/50" />
            <h1 className="font-display text-3xl text-maroon mt-4">Event not found</h1>
            <p className="mt-3 text-foreground/70">This charity event may have been moved or removed.</p>
            <Link to="/charity-events" className="btn-primary mt-8">View All Charity Events</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const isUpcoming = event.status === "upcoming";

  return (
    <Layout>
      {/* Header band — details, no overlay */}
      <section className="relative text-cream overflow-hidden" style={{ background: "linear-gradient(135deg, var(--maroon-deep), var(--maroon))" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, var(--gold) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--saffron) 0%, transparent 40%)" }} />
        <div className="container-x relative py-12 md:py-16">
          <Link to="/charity-events" className="inline-flex items-center gap-1.5 text-cream/80 hover:text-gold text-sm mb-6">
            <ArrowLeft className="size-4" /> All Charity Events
          </Link>

          {/* Video player on top */}
          <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-warm)] bg-black/40 aspect-video max-w-4xl">
            {event.videoUrl ? (
              <iframe
                src={event.videoUrl}
                title={`${event.title} video`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
          </div>

          {/* Details below the video */}
          <div className="mt-8 max-w-4xl">
            <span className="eyebrow text-gold">Healing · Meditation · Dharma Discourse · Charity</span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold mt-3 leading-[1.05]">{event.title}</h1>
            <p className="mt-4 text-lg text-cream/90 max-w-2xl">{event.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cream/90">
              <span className="inline-flex items-center gap-2"><Calendar className="size-4 text-gold" /> {event.date}</span>
              <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-gold" /> {event.venue}, {event.venueNote}</span>
            </div>
            {isUpcoming && (
              <div className="mt-8">
                <button onClick={() => setBookOpen(true)} className="btn-gold">Book Your Seat <Sparkles className="size-4" /></button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Teacher strip */}
      <section className="bg-maroon text-cream border-t border-cream/10">
        <div className="container-x py-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-center sm:text-left">
          <div className="font-display text-xl text-gold">{event.teacher}</div>
          <div className="text-sm text-cream/80">{event.teacherTitle}</div>
        </div>
      </section>

      {/* Overview */}
      <section className="section-y">
        <div className="container-x max-w-3xl">
          {event.intro && <p className="text-xl leading-relaxed text-foreground/85 font-display">{event.intro}</p>}
          <div className="ornament-divider" />
          {event.descriptionHtml ? (
            <RichText html={event.descriptionHtml} />
          ) : (
            event.overview.map((p, i) => (
              <p key={i} className="text-foreground/75 leading-relaxed mt-4">{p}</p>
            ))
          )}
        </div>
      </section>

      {/* Sessions */}
      {event.sessions.length > 0 && (
        <section className="section-y bg-secondary/50">
          <div className="container-x">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow">The Programme</span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold mt-3 text-maroon">Two unique sessions</h2>
              <p className="mt-4 text-foreground/70">Attend either session or join us for the full day.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              {event.sessions.map((s, i) => (
                <div key={s.name} className="rounded-2xl bg-card border border-border overflow-hidden flex flex-col">
                  <div className="p-6 text-cream" style={{ background: i === 0 ? "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" : "linear-gradient(135deg, var(--gold-deep), var(--saffron))" }}>
                    <div className="text-xs uppercase tracking-widest opacity-90">{s.time}</div>
                    <h3 className="font-display text-2xl mt-1">{s.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{s.tone}</p>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-sm text-foreground/75 leading-relaxed">{s.description}</p>
                    <ul className="mt-5 space-y-2">
                      {s.highlights.map((h) => (
                        <li key={h} className="flex gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="size-4 text-gold-deep mt-0.5 shrink-0" /> {h}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">Charity Donation</span>
                      <span className="font-display text-2xl text-maroon">{s.donation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-foreground/70 mt-8 max-w-2xl mx-auto">{event.supportsNote}</p>
          </div>
        </section>
      )}

      {/* Reserve + info */}
      {isUpcoming ? (
        <section id="register" className="section-y scroll-mt-24 bg-secondary/40 border-t border-border">
          <div className="container-x grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
            <div className="rounded-2xl border border-gold bg-card p-8 md:p-10 text-center lg:text-left shadow-[var(--shadow-soft)]">
              <div className="inline-flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold-deep mx-auto lg:mx-0">
                <Ticket className="size-7" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-maroon mt-5">Reserve your place</h2>
              <p className="mt-3 text-foreground/75 max-w-xl mx-auto lg:mx-0">
                Choose your session, make your charity donation and upload the payment screenshot — all in
                one quick form. A FREE Five-Combined Protective Amulet, personally blessed by the Venerable
                Master, is offered to every participant.
              </p>
              {event.sessions.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                  {event.sessions.map((s) => (
                    <span key={s.name} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm">
                      <span className="font-semibold text-maroon">{s.donation}</span>
                    </span>
                  ))}
                </div>
              )}
              <button onClick={() => setBookOpen(true)} className="btn-gold mt-8 text-base">
                Book Your Seat <Sparkles className="size-4" />
              </button>
            </div>
            <EventAside event={event} />
          </div>
        </section>
      ) : (
        <section className="section-y">
          <div className="container-x max-w-3xl text-center">
            <h2 className="font-display text-3xl text-maroon">This event has concluded</h2>
            <p className="mt-4 text-foreground/70">Thank you to everyone who joined us. Explore our upcoming charity events and reserve your seat.</p>
            <Link to="/charity-events" className="btn-primary mt-8">View Upcoming Events</Link>
          </div>
        </section>
      )}

      {/* Booking modal */}
      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0">
          <BookingForm event={event} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

/* ---------------- Booking form ---------------- */

function EventAside({ event }: { event: CharityEvent }) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-display text-xl text-maroon">Event Details</h3>
        <ul className="mt-4 space-y-3 text-sm text-foreground/80">
          <li className="flex gap-3"><Calendar className="size-4 text-gold-deep mt-0.5 shrink-0" /><span>{event.date}<br />Morning & Afternoon Sessions</span></li>
          <li className="flex gap-3"><MapPin className="size-4 text-gold-deep mt-0.5 shrink-0" /><span>{event.venue}<br />{event.venueNote}</span></li>
          {event.contacts.map((c) => (
            <li key={c} className="flex gap-3"><Phone className="size-4 text-gold-deep mt-0.5 shrink-0" /><a href={`tel:${c.replace(/[^+\d]/g, "")}`} className="hover:text-maroon">{c}</a></li>
          ))}
          <li className="flex gap-3"><Mail className="size-4 text-gold-deep mt-0.5 shrink-0" /><a href={`mailto:${event.email}`} className="hover:text-maroon">{event.email}</a></li>
          <li className="flex gap-3"><Globe className="size-4 text-gold-deep mt-0.5 shrink-0" /><span>{event.website}</span></li>
        </ul>
      </div>
      <div className="rounded-xl p-6 text-cream" style={{ background: "var(--maroon)" }}>
        <Heart className="size-6 text-gold" />
        <p className="text-sm text-cream/90 mt-3 leading-relaxed">{event.supportsNote}</p>
      </div>
    </aside>
  );
}

const SESSION_OPTIONS = [
  { value: "morning", label: "Morning Session", price: 1500, note: "9:00 AM – 12:00 PM · Lunch included" },
  { value: "afternoon", label: "Afternoon Session", price: 1000, note: "12:30 PM – 3:00 PM · Tea & snacks included" },
  { value: "both", label: "Full Day (Both Sessions)", price: 2500, note: "Attend the complete programme" },
] as const;

const MAX_PROOF_BYTES = 5 * 1024 * 1024;

const schema = z.object({
  session: z.enum(["morning", "afternoon", "both"], { errorMap: () => ({ message: "Please choose a session" }) }),
  seats: z.coerce.number().int().min(1, "At least 1 seat").max(20, "For 20+ seats, please contact us"),
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  mobile: z.string().trim().regex(/^[+\d][\d\s\-()]{6,20}$/, "Enter a valid mobile number"),
  whatsapp: z.string().trim().regex(/^[+\d][\d\s\-()]{6,20}$/, "Enter a valid WhatsApp number").optional().or(z.literal("")),
  city: z.string().trim().min(2, "City is required").max(80),
  message: z.string().trim().max(400).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you have made the payment" }) }),
});

type FormValues = z.infer<typeof schema>;

function BookingForm({ event }: { event: CharityEvent }) {
  const [proof, setProof] = useState<{ dataUrl: string; name: string } | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: "onBlur", defaultValues: { seats: 1 } });

  const session = watch("session");
  const seats = Number(watch("seats") || 1);
  const selected = SESSION_OPTIONS.find((s) => s.value === session);
  const total = selected ? selected.price * (seats > 0 ? seats : 1) : 0;

  const onProof = (file: File | undefined) => {
    setProofError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return setProofError("Please upload an image (JPG or PNG).");
    if (file.size > MAX_PROOF_BYTES) return setProofError("Screenshot must be under 5 MB.");
    const r = new FileReader();
    r.onload = () => setProof({ dataUrl: String(r.result), name: file.name });
    r.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    if (!proof) return setProofError("Please upload a screenshot of your payment.");
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { ref } = await addBooking({
        eventSlug: event.slug,
        eventTitle: event.title,
        session: values.session,
        sessionLabel: selected?.label ?? values.session,
        seats: Number(values.seats) || 1,
        amount: total,
        fullName: values.fullName,
        email: values.email,
        mobile: values.mobile,
        whatsapp: values.whatsapp || undefined,
        city: values.city,
        message: values.message || undefined,
        proofName: proof.name,
        proofDataUrl: proof.dataUrl,
      });
      reset();
      setProof(null);
      setDone(ref);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "mt-1 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold";
  const errCls = "mt-1 text-xs text-destructive";

  if (done) {
    return (
      <div className="bg-card p-8 md:p-10 text-center">
        <div className="size-16 mx-auto grid place-items-center rounded-full bg-gold/15 text-gold-deep">
          <PartyPopper className="size-8" />
        </div>
        <h2 className="font-display text-3xl text-maroon mt-5">Booking received!</h2>
        <p className="text-foreground/75 mt-3 max-w-md mx-auto">
          Thank you. We have received your booking and payment screenshot. Our team will verify your
          payment and confirm your seat by email and WhatsApp.
        </p>
        <div className="mt-5 inline-block rounded-lg bg-secondary px-5 py-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Reference</div>
          <div className="font-display text-2xl text-maroon">{done}</div>
        </div>
        <div className="mt-8">
          <button onClick={() => setDone(null)} className="btn-primary">Book Another Seat</button>
        </div>
      </div>
    );
  }

  return (
    <form className="bg-card p-6 md:p-8 space-y-7" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <span className="eyebrow">Book Your Seat</span>
        <h2 className="font-display text-2xl md:text-3xl text-maroon mt-2">Reserve your place</h2>
        <p className="text-sm text-foreground/70 mt-2">
          Choose a session, make your charity donation to the account below, and upload the payment
          screenshot to confirm your seat.
        </p>
      </div>

      {/* Session selection */}
      <div>
        <label className="text-sm font-semibold text-foreground/80">Choose Session *</label>
        <div className="mt-2 grid sm:grid-cols-3 gap-3">
          {SESSION_OPTIONS.map((s) => (
            <label key={s.value} className="relative cursor-pointer">
              <input type="radio" value={s.value} className="peer sr-only" {...register("session")} />
              <div className="h-full rounded-lg border border-input p-4 peer-checked:border-gold peer-checked:ring-2 peer-checked:ring-gold/40 peer-checked:bg-gold/5 transition">
                <div className="font-semibold text-maroon text-sm">{s.label}</div>
                <div className="font-display text-2xl text-maroon mt-1">₹{s.price.toLocaleString("en-IN")}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.note}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.session && <p className={errCls}>{errors.session.message}</p>}
      </div>

      {/* Payment / bank details */}
      <div className="space-y-3">
        <BankDetails
          bank={event.bank}
          title="Make your donation"
          note="Transfer the donation amount to the BTMC Foundation account below (UPI / bank transfer), then upload the screenshot below."
        />
        {selected && (
          <div className="flex items-center justify-between rounded-lg bg-maroon text-cream px-4 py-3">
            <span className="text-sm">{selected.label} × {seats > 0 ? seats : 1}</span>
            <span className="font-display text-xl text-gold">Total: ₹{total.toLocaleString("en-IN")}</span>
          </div>
        )}
      </div>

      {/* Personal details */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-foreground/80">Number of Seats *</label>
          <input type="number" min={1} className={inputCls} {...register("seats")} />
          {errors.seats && <p className={errCls}>{errors.seats.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground/80">Full Name *</label>
          <input className={inputCls} {...register("fullName")} />
          {errors.fullName && <p className={errCls}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground/80">Email *</label>
          <input type="email" className={inputCls} {...register("email")} />
          {errors.email && <p className={errCls}>{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground/80">City *</label>
          <input className={inputCls} {...register("city")} />
          {errors.city && <p className={errCls}>{errors.city.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground/80">Mobile Number *</label>
          <input type="tel" placeholder="+91 98765 43210" className={inputCls} {...register("mobile")} />
          {errors.mobile && <p className={errCls}>{errors.mobile.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground/80">WhatsApp Number</label>
          <input type="tel" placeholder="Optional" className={inputCls} {...register("whatsapp")} />
          {errors.whatsapp && <p className={errCls}>{errors.whatsapp.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-foreground/80">Message / Special Requests</label>
          <textarea rows={2} placeholder="Optional" className={inputCls} {...register("message")} />
        </div>
      </div>

      {/* Payment screenshot */}
      <div>
        <label className="text-sm font-semibold text-foreground/80">Payment Screenshot *</label>
        <div className="mt-1 flex items-start gap-4">
          <label className="flex-1 cursor-pointer border border-dashed border-input rounded px-4 py-6 text-center hover:border-gold hover:bg-gold/5 transition">
            <Upload className="size-5 mx-auto text-gold-deep" />
            <div className="mt-2 text-sm text-foreground/70">
              {proof ? proof.name : "Upload screenshot of your payment (JPG or PNG, max 5 MB)"}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onProof(e.target.files?.[0])} />
          </label>
          {proof && (
            <div className="relative">
              <img src={proof.dataUrl} alt="Payment proof" className="size-24 object-cover rounded border border-border" />
              <button type="button" onClick={() => setProof(null)} aria-label="Remove" className="absolute -top-2 -right-2 bg-maroon text-cream rounded-full p-1">
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>
        {proofError && <p className={errCls}>{proofError}</p>}
      </div>

      <label className="flex items-start gap-3 text-sm text-foreground/75">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>
          I confirm that I have completed the charity donation payment and the uploaded screenshot is genuine.
          {errors.consent && <span className="block text-destructive text-xs mt-1">{errors.consent.message}</span>}
        </span>
      </label>

      {submitError && (
        <div className="rounded-lg bg-destructive/10 text-destructive text-sm px-4 py-3">{submitError}</div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base py-4 disabled:opacity-70">
        {submitting ? (<><Loader2 className="size-4 animate-spin" /> Submitting…</>) : "Confirm Booking"}
      </button>
    </form>
  );
}
