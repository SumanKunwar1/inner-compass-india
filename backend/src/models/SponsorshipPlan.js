import mongoose from "mongoose";

/**
 * A membership tier or sponsorship level.
 *
 * One collection covers all four programmes rather than four near-identical ones —
 * they share the same shape (fee, period, benefits) and the admin panel presents
 * them as sub-tabs of a single screen. `kind` is what separates them.
 *
 * Every field except `id` and `kind` is optional so a plan can be drafted and
 * completed later.
 */
export const PLAN_KINDS = ["membership", "dharma-ideal", "community", "corporate"];

const MediaBenefitSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    detail: { type: String, default: "" },
  },
  { _id: false }
);

const SponsorshipPlanSchema = new mongoose.Schema(
  {
    /** Stable public id used by the frontend (e.g. "gold", "gem"). */
    id: { type: String, required: true, unique: true, index: true, trim: true },
    kind: { type: String, required: true, enum: PLAN_KINDS, index: true },

    name: { type: String, default: "", trim: true },
    tagline: { type: String, default: "" },
    /** Longer lead paragraph — used by the community/corporate sections. */
    intro: { type: String, default: "" },

    /* ---------------- pricing ---------------- */
    fee: { type: Number, default: 0, min: 0 },
    /** Display fee, e.g. "₹4,99,000". Derived from `fee` when blank. */
    feeLabel: { type: String, default: "" },
    /** Qualifier under the fee, e.g. "per corporate organization, per year". */
    feeNote: { type: String, default: "" },
    /** Validity or sponsorship period, e.g. "1 Year", "Lifetime". */
    period: { type: String, default: "" },

    /* ---------------- content ---------------- */
    /** Name of the tier this one builds on, e.g. "Silver". Membership only. */
    inherits: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    mediaBenefits: { type: [MediaBenefitSchema], default: [] },
    suitableFor: { type: [String], default: [] },
    /** Partner title granted, e.g. "Dharma TV Community Partner". */
    recognition: { type: String, default: "" },

    /* ---------------- presentation ---------------- */
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const SponsorshipPlan = mongoose.model("SponsorshipPlan", SponsorshipPlanSchema);
