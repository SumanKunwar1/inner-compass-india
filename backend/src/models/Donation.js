import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true, index: true },
    amount: { type: Number, default: 0, min: 0 },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    pan: { type: String, default: "" },
    message: { type: String, default: "" },
    proofName: { type: String, default: "" },
    proofDataUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "received", "thanked"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", DonationSchema);
