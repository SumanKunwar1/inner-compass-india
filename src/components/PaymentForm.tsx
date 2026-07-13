import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Loader2, PartyPopper, Landmark } from "lucide-react";
import { BankDetails } from "@/components/BankDetails";

const MAX_PROOF_BYTES = 5 * 1024 * 1024;

type Props = {
  /** e.g. "Donation", "Order", "Booking" — used for the reference prefix and copy */
  context?: string;
  /** What is being paid for, shown in a summary chip */
  itemLabel?: string;
  /** Quick-select amounts (₹). Omit to hide preset buttons. */
  presetAmounts?: number[];
  /** Lock the amount to this value (₹) — hides the amount input. */
  fixedAmount?: number;
  /** Extra note shown under the heading */
  note?: string;
  onDone?: (ref: string) => void;
};

const schema = z.object({
  amount: z.coerce.number().min(1, "Enter an amount").max(10000000),
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  mobile: z.string().trim().regex(/^[+\d][\d\s\-()]{6,20}$/, "Enter a valid mobile number"),
  pan: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().max(400).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you have made the payment" }) }),
});

type FormValues = z.infer<typeof schema>;

export function PaymentForm({ context = "Payment", itemLabel, presetAmounts, fixedAmount, note, onDone }: Props) {
  const [proof, setProof] = useState<{ dataUrl: string; name: string } | null>(null);
  const [proofError, setProofError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { amount: fixedAmount ?? undefined },
  });

  const amount = Number(watch("amount") || 0);

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
    await new Promise((r) => setTimeout(r, 900));
    const ref = "BTMC-" + context.slice(0, 3).toUpperCase() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    try {
      sessionStorage.setItem("btmc:lastPayment", JSON.stringify({ ref, context, itemLabel, ...values, proofName: proof.name }));
    } catch { /* ignore */ }
    reset();
    setProof(null);
    setSubmitting(false);
    setDone(ref);
    onDone?.(ref);
  };

  const inputCls = "mt-1 w-full px-4 py-3 border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-gold";
  const errCls = "mt-1 text-xs text-destructive";

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="size-16 mx-auto grid place-items-center rounded-full bg-gold/15 text-gold-deep">
          <PartyPopper className="size-8" />
        </div>
        <h3 className="font-display text-2xl text-maroon mt-4">Thank you! Payment received</h3>
        <p className="text-foreground/75 mt-2 max-w-md mx-auto text-sm">
          We have received your {context.toLowerCase()} and payment screenshot. Our team will verify and
          send your confirmation{context === "Donation" ? " and 80G receipt" : ""} by email.
        </p>
        <div className="mt-4 inline-block rounded-lg bg-secondary px-5 py-3">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Reference</div>
          <div className="font-display text-2xl text-maroon">{done}</div>
        </div>
        <div className="mt-6">
          <button onClick={() => setDone(null)} className="btn-primary">Make Another {context}</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {note && <p className="text-sm text-foreground/70">{note}</p>}

      {itemLabel && (
        <div className="flex items-center gap-2 rounded-lg bg-secondary/60 border border-border px-4 py-3">
          <Landmark className="size-4 text-gold-deep" />
          <span className="text-sm font-medium text-maroon">{itemLabel}</span>
        </div>
      )}

      {/* Amount */}
      {!fixedAmount && (
        <div>
          <label className="text-sm font-semibold text-foreground/80">Amount (₹) *</label>
          {presetAmounts && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {presetAmounts.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setValue("amount", a, { shouldValidate: true })}
                  className={`py-2.5 rounded border font-semibold text-sm transition ${
                    amount === a ? "bg-maroon text-cream border-maroon" : "border-border text-maroon hover:border-gold hover:bg-gold/10"
                  }`}
                >
                  ₹{a.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          )}
          <input type="number" min={1} placeholder="Enter amount" className={inputCls} {...register("amount")} />
          {errors.amount && <p className={errCls}>{errors.amount.message}</p>}
        </div>
      )}

      {/* Bank details */}
      <BankDetails
        title="Make your transfer"
        note={`Transfer ${fixedAmount ? `₹${fixedAmount.toLocaleString("en-IN")}` : amount > 0 ? `₹${amount.toLocaleString("en-IN")}` : "the amount"} to the BTMC Foundation account below (UPI / bank transfer), then upload the screenshot.`}
      />

      {/* Contact fields */}
      <div className="grid sm:grid-cols-2 gap-4">
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
          <label className="text-sm font-semibold text-foreground/80">Mobile Number *</label>
          <input type="tel" placeholder="+91 98765 43210" className={inputCls} {...register("mobile")} />
          {errors.mobile && <p className={errCls}>{errors.mobile.message}</p>}
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground/80">PAN {context === "Donation" ? "(for 80G receipt)" : ""}</label>
          <input placeholder="Optional" className={inputCls} {...register("pan")} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-foreground/80">Message</label>
          <textarea rows={2} placeholder="Optional" className={inputCls} {...register("message")} />
        </div>
      </div>

      {/* Screenshot */}
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
          I confirm that I have completed the payment and the uploaded screenshot is genuine.
          {errors.consent && <span className="block text-destructive text-xs mt-1">{errors.consent.message}</span>}
        </span>
      </label>

      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base py-4 disabled:opacity-70">
        {submitting ? (<><Loader2 className="size-4 animate-spin" /> Submitting…</>) : `Submit ${context}`}
      </button>
    </form>
  );
}
