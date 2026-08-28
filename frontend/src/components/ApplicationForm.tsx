import { useState } from "react";
import { CheckCircle2, Loader2, Upload, X, Building2 } from "lucide-react";
import { BankDetails } from "@/components/BankDetails";
import { submitApplication, type PlanKind, type SponsorshipPlan } from "@/lib/sponsorshipStore";

/**
 * Membership / sponsorship application form.
 *
 * Community and corporate sponsorships are taken out by organisations rather than
 * individuals, so those two kinds ask for the organisation's details as well.
 * The fee is never sent from here — the server reads it from the plan.
 */

const MAX_PROOF_BYTES = 5 * 1024 * 1024;

type Props = {
  plan: SponsorshipPlan;
  /** Overrides the plan's own kind if a page needs to force one. */
  kind?: PlanKind;
  onDone?: () => void;
};

const inputCls =
  "w-full px-4 py-3 border border-input rounded bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold";

export function ApplicationForm({ plan, kind, onDone }: Props) {
  const appKind = kind ?? plan.kind;
  const isOrg = appKind === "community" || appKind === "corporate";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    pan: "",
    address: "",
    message: "",
    organisation: "",
    designation: "",
    website: "",
    memberCount: "",
  });
  const [proof, setProof] = useState<{ name: string; dataUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_PROOF_BYTES) {
      setError("The screenshot must be under 5 MB.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setProof({ name: file.name, dataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.email.trim() || !form.mobile.trim()) {
      setError("Please fill in your name, email and mobile number.");
      return;
    }
    if (isOrg && !form.organisation.trim()) {
      setError("Please enter the organisation's name.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitApplication({
        kind: appKind,
        planId: plan.id,
        planName: plan.name,
        ...form,
        proofName: proof?.name ?? "",
        proofDataUrl: proof?.dataUrl ?? "",
      });
      setDone(result.ref);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="size-12 mx-auto text-green-600" />
        <h3 className="font-display text-2xl text-maroon mt-4">Application received</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          Thank you. Our team will verify your payment and contact you by email with your
          {appKind === "membership" ? " membership registration number" : " sponsorship confirmation"}.
        </p>
        <div className="mt-4 inline-block rounded-lg bg-secondary px-4 py-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Reference</span>
          <div className="font-mono font-semibold text-maroon">{done}</div>
        </div>
        {onDone && (
          <div className="mt-6">
            <button onClick={onDone} className="btn-outline" style={{ color: "var(--maroon)", borderColor: "var(--maroon)" }}>
              Close
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* What is being applied for */}
      <div className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-4 py-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Applying for</div>
          <div className="text-sm font-medium text-maroon">
            {plan.name}
            {plan.period ? ` · ${plan.period}` : ""}
          </div>
        </div>
        {plan.feeLabel && <div className="font-display text-2xl text-maroon whitespace-nowrap">{plan.feeLabel}</div>}
      </div>

      {isOrg && (
        <div className="space-y-4 rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-maroon">
            <Building2 className="size-4 text-gold-deep" /> Organisation details
          </div>
          <input
            placeholder={appKind === "corporate" ? "Company / organisation name *" : "Organisation / community name *"}
            className={inputCls}
            value={form.organisation}
            onChange={(e) => set("organisation", e.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Your designation" className={inputCls} value={form.designation} onChange={(e) => set("designation", e.target.value)} />
            <input placeholder="Website (optional)" className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} />
          </div>
          <input
            placeholder={appKind === "corporate" ? "Approximate number of employees" : "Approximate number of members"}
            className={inputCls}
            value={form.memberCount}
            onChange={(e) => set("memberCount", e.target.value)}
          />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <input placeholder={isOrg ? "Contact person *" : "Full name *"} className={inputCls} value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
        <input type="email" placeholder="Email *" className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input placeholder="Mobile number *" className={inputCls} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
        <input placeholder="PAN (optional)" className={inputCls} value={form.pan} onChange={(e) => set("pan", e.target.value)} />
      </div>

      <input placeholder="Address (optional)" className={inputCls} value={form.address} onChange={(e) => set("address", e.target.value)} />
      <textarea
        rows={3}
        placeholder="Anything you would like us to know (optional)"
        className={inputCls}
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
      />

      {/* Payment */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div className="text-sm font-semibold text-maroon">Transfer the fee, then upload your screenshot</div>
        <BankDetails />
        <div>
          {proof ? (
            <div className="flex items-center justify-between gap-3 rounded-md border border-border px-4 py-2.5">
              <span className="text-sm text-foreground/80 truncate">{proof.name}</span>
              <button type="button" onClick={() => setProof(null)} className="size-8 grid place-items-center rounded hover:bg-secondary text-muted-foreground hover:text-destructive" aria-label="Remove screenshot">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-4 py-2.5 text-sm hover:border-gold">
              <Upload className="size-4 text-gold-deep" /> Upload payment screenshot
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Optional — you can also send it later by email, but verification is faster with it attached.
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full justify-center py-4 disabled:opacity-70">
        {submitting ? (<><Loader2 className="size-4 animate-spin" /> Submitting…</>) : "Submit Application"}
      </button>
      <p className="text-xs text-muted-foreground text-center">
        Applications are subject to approval and the rules of BTMC Foundation.
      </p>
    </form>
  );
}
