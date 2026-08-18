import mongoose from "mongoose";

/**
 * A membership or sponsorship application submitted from the public site.
 *
 * These were previously funnelled through the Donation collection, which mixed
 * one-off gifts with programme sign-ups and lost the organisation details that
 * community and corporate applicants provide. They now have their own record.
 */
export const APPLICATION_KINDS = ["membership", "dharma-ideal", "community", "corporate"];
export const APPLICATION_STATUSES = ["pending", "verified", "active", "rejected"];

const ApplicationSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true, index: true },
    kind: { type: String, required: true, enum: APPLICATION_KINDS, index: true },

    /** Snapshot of the plan at the time of applying, so later edits don't rewrite history. */
    planId: { type: String, default: "", index: true },
    planName: { type: String, default: "" },
    planPeriod: { type: String, default: "" },
    amount: { type: Number, default: 0, min: 0 },

    /* ---------------- applicant ---------------- */
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    pan: { type: String, default: "" },
    address: { type: String, default: "" },
    message: { type: String, default: "" },

    /* ---------------- organisation (community & corporate) ---------------- */
    organisation: { type: String, default: "" },
    designation: { type: String, default: "" },
    website: { type: String, default: "" },
    memberCount: { type: String, default: "" },

    /* ---------------- payment ---------------- */
    proofName: { type: String, default: "" },
    proofDataUrl: { type: String, default: "" },

    status: { type: String, enum: APPLICATION_STATUSES, default: "pending", index: true },
    /** Internal note, admin-only. */
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", ApplicationSchema);
