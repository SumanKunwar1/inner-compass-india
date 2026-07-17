import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Layout, PageHero } from "@/components/Layout";
import { CheckCircle2, Upload, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register — BTMC Foundation India" },
      { name: "description", content: "Register online for meditation retreats, courses and charity events. Secure registration in just a few minutes." },
    ],
  }),
  component: Register,
});

const PROGRAMS = [
  "Weekly 2-Day Free Meditation Retreat",
  "3rd International Ngyungne Retreat",
  "2nd Nepal World Peace Prayers",
  "Online Dharma Class",
  "Pilgrimage Tour",
] as const;

const ACCOMMODATIONS = ["Shared Dormitory", "Private Room", "Own Arrangement"] as const;
const GENDERS = ["Female", "Male", "Other", "Prefer not to say"] as const;

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

const schema = z
  .object({
    program: z.enum(PROGRAMS, { errorMap: () => ({ message: "Please choose a program" }) }),
    fullName: z.string().trim().min(2, "Full name is required").max(100),
    gender: z.enum(GENDERS, { errorMap: () => ({ message: "Please select" }) }),
    dob: z.string().min(1, "Date of birth is required").refine((v) => {
      const d = new Date(v);
      return !isNaN(d.getTime()) && d < new Date();
    }, "Enter a valid past date"),
    nationality: z.string().trim().min(2, "Nationality is required").max(60),
    idNumber: z.string().trim().min(4, "ID number is required").max(40),
    mobile: z.string().trim().regex(/^[+\d][\d\s\-()]{6,20}$/, "Enter a valid mobile number"),
    whatsapp: z.string().trim().regex(/^[+\d][\d\s\-()]{6,20}$/, "Enter a valid WhatsApp number"),
    email: z.string().trim().email("Enter a valid email").max(255),
    address: z.string().trim().min(5, "Address is required").max(300),
    emergencyContact: z.string().trim().min(5, "Emergency contact is required").max(150),
    occupation: z.string().trim().min(2, "Occupation is required").max(80),
    medicalHistory: z.string().trim().max(500).optional().or(z.literal("")),
    dietary: z.string().trim().max(200).optional().or(z.literal("")),
    arrival: z.string().min(1, "Arrival date is required"),
    departure: z.string().min(1, "Departure date is required"),
    accommodation: z.enum(ACCOMMODATIONS, { errorMap: () => ({ message: "Please select" }) }),
    signature: z.string().trim().min(2, "Please type your full name to sign"),
    consent: z.literal(true, { errorMap: () => ({ message: "You must accept the declaration" }) }),
  })
  .refine((d) => new Date(d.departure) >= new Date(d.arrival), {
    path: ["departure"],
    message: "Departure must be on or after arrival",
  })
  .refine((d) => d.signature.trim().toLowerCase() === d.fullName.trim().toLowerCase(), {
    path: ["signature"],
    message: "Signature must match your full name",
  });

type FormValues = z.infer<typeof schema>;

function Register() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<{ dataUrl: string; name: string; size: number } | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onPhoto = (file: File | undefined) => {
    setPhotoError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload an image file (JPG or PNG).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Photo must be under 5 MB.");
      return;
    }
    const r = new FileReader();
    r.onload = () => setPhoto({ dataUrl: String(r.result), name: file.name, size: file.size });
    r.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    if (!photo) {
      setPhotoError("Please upload a passport-size photograph.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const ref = "BTMC-" + Math.random().toString(36).slice(2, 8).toUpperCase() + "-" + Date.now().toString(36).slice(-4).toUpperCase();
    const payload = {
      ref,
      submittedAt: new Date().toISOString(),
      ...values,
      photoName: photo.name,
      photoPreview: photo.dataUrl,
    };
    try {
      sessionStorage.setItem("btmc:lastRegistration", JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    reset();
    setPhoto(null);
    setSubmitting(false);
    navigate({ to: "/registration-success", search: { ref } });
  };

  const inputCls = "mt-1 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold";
  const errCls = "mt-1 text-xs text-destructive";

  return (
    <Layout>
      <PageHero
        eyebrow="Online Registration"
        title="Register for retreats, courses & events"
        subtitle="Complete your registration securely in just a few minutes."
      />
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-[2fr_1fr] gap-10">
          <form
            className="p-8 bg-card rounded-lg border border-border space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div>
              <label className="text-sm font-semibold text-foreground/80">Program Selection *</label>
              <select className={inputCls} defaultValue="" {...register("program")}>
                <option value="" disabled>Select a program…</option>
                {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.program && <p className={errCls}>{errors.program.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground/80">Full Name *</label>
                <input className={inputCls} {...register("fullName")} />
                {errors.fullName && <p className={errCls}>{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Gender *</label>
                <select className={inputCls} defaultValue="" {...register("gender")}>
                  <option value="" disabled>Select…</option>
                  {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.gender && <p className={errCls}>{errors.gender.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Date of Birth *</label>
                <input type="date" className={inputCls} {...register("dob")} />
                {errors.dob && <p className={errCls}>{errors.dob.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Nationality *</label>
                <input className={inputCls} {...register("nationality")} />
                {errors.nationality && <p className={errCls}>{errors.nationality.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-foreground/80">Passport / Citizenship / ID Number *</label>
                <input className={inputCls} {...register("idNumber")} />
                {errors.idNumber && <p className={errCls}>{errors.idNumber.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Mobile Number *</label>
                <input type="tel" className={inputCls} placeholder="+91 98765 43210" {...register("mobile")} />
                {errors.mobile && <p className={errCls}>{errors.mobile.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">WhatsApp Number *</label>
                <input type="tel" className={inputCls} placeholder="+91 98765 43210" {...register("whatsapp")} />
                {errors.whatsapp && <p className={errCls}>{errors.whatsapp.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-foreground/80">Email Address *</label>
                <input type="email" className={inputCls} {...register("email")} />
                {errors.email && <p className={errCls}>{errors.email.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-foreground/80">Residential Address *</label>
                <textarea rows={2} className={inputCls} {...register("address")} />
                {errors.address && <p className={errCls}>{errors.address.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Emergency Contact *</label>
                <input className={inputCls} placeholder="Name & phone" {...register("emergencyContact")} />
                {errors.emergencyContact && <p className={errCls}>{errors.emergencyContact.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Occupation *</label>
                <input className={inputCls} {...register("occupation")} />
                {errors.occupation && <p className={errCls}>{errors.occupation.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Medical History</label>
                <input className={inputCls} placeholder="Optional" {...register("medicalHistory")} />
                {errors.medicalHistory && <p className={errCls}>{errors.medicalHistory.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Dietary Requirements</label>
                <input className={inputCls} placeholder="Optional" {...register("dietary")} />
                {errors.dietary && <p className={errCls}>{errors.dietary.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Arrival Date *</label>
                <input type="date" className={inputCls} {...register("arrival")} />
                {errors.arrival && <p className={errCls}>{errors.arrival.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Departure Date *</label>
                <input type="date" className={inputCls} {...register("departure")} />
                {errors.departure && <p className={errCls}>{errors.departure.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-foreground/80">Passport Size Photograph *</label>
                <div className="mt-1 flex items-start gap-4">
                  <label className="flex-1 cursor-pointer border border-dashed border-input rounded px-4 py-6 text-center hover:border-gold hover:bg-gold/5 transition">
                    <Upload className="size-5 mx-auto text-gold-deep" />
                    <div className="mt-2 text-sm text-foreground/70">
                      {photo ? photo.name : "Click to upload JPG or PNG (max 5 MB)"}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onPhoto(e.target.files?.[0])}
                    />
                  </label>
                  {photo && (
                    <div className="relative">
                      <img src={photo.dataUrl} alt="Preview" className="size-24 object-cover rounded border border-border" />
                      <button
                        type="button"
                        onClick={() => setPhoto(null)}
                        aria-label="Remove photo"
                        className="absolute -top-2 -right-2 bg-maroon text-cream rounded-full p-1"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
                {photoError && <p className={errCls}>{photoError}</p>}
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground/80">Accommodation Preference *</label>
                <select className={inputCls} defaultValue="" {...register("accommodation")}>
                  <option value="" disabled>Select…</option>
                  {ACCOMMODATIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                {errors.accommodation && <p className={errCls}>{errors.accommodation.message}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground/80">Digital Signature *</label>
                <input placeholder="Type your full name" className={inputCls} {...register("signature")} />
                {errors.signature && <p className={errCls}>{errors.signature.message}</p>}
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-foreground/75">
              <input type="checkbox" className="mt-1" {...register("consent")} />
              <span>
                I hereby declare that the information provided is true and consent to BTMC Foundation India's terms of participation.
                {errors.consent && <span className="block text-destructive text-xs mt-1">{errors.consent.message}</span>}
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center text-base py-4 disabled:opacity-70"
            >
              {submitting ? (<><Loader2 className="size-4 animate-spin" /> Submitting…</>) : "Complete Registration"}
            </button>
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
