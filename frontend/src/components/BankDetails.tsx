import { useState } from "react";
import { Building2, Copy, Check } from "lucide-react";
import { BANK_DETAILS } from "@/data/charityEvents";

type Bank = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
};

export function BankDetails({ bank = BANK_DETAILS, title = "Make your transfer", note }: { bank?: Bank; title?: string; note?: string }) {
  const [copied, setCopied] = useState(false);

  const copyAcct = () => {
    try {
      navigator.clipboard?.writeText(bank.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* ignore */ }
  };

  return (
    <div className="rounded-xl border border-gold/50 bg-gold/5 p-5">
      <div className="flex items-center gap-2 text-maroon">
        <Building2 className="size-5 text-gold-deep" />
        <h3 className="font-display text-xl">{title}</h3>
      </div>
      {note && <p className="text-sm text-foreground/70 mt-1">{note}</p>}

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <Field label="Bank" value={bank.bankName} full />
        <Field label="Account Name" value={bank.accountName} />
        <Field label="IFSC Code" value={bank.ifsc} />
        {/* Account number — highlighted with copy */}
        <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-lg bg-card border border-gold/40 px-4 py-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Account Number</div>
            <div className="font-display text-xl text-maroon tracking-wide truncate">{bank.accountNumber}</div>
          </div>
          <button
            type="button"
            onClick={copyAcct}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-maroon text-cream px-3 py-2 text-xs font-semibold hover:bg-maroon-deep transition"
            aria-label="Copy account number"
          >
            {copied ? <><Check className="size-3.5" /> Copied</> : <><Copy className="size-3.5" /> Copy</>}
          </button>
        </div>
        <Field label="Branch" value={bank.branch} full />
      </div>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={`rounded-lg bg-card border border-border px-4 py-2.5 ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium text-foreground mt-0.5">{value}</div>
    </div>
  );
}
