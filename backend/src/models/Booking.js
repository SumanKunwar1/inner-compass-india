import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true, index: true },
    eventSlug: { type: String, required: true, index: true },
    eventTitle: { type: String, default: "" },
    session: { type: String, default: "" },
    sessionLabel: { type: String, default: "" },
    seats: { type: Number, default: 1, min: 1 },
    amount: { type: Number, default: 0, min: 0 },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    whatsapp: { type: String, default: "" },
    city: { type: String, default: "" },
    message: { type: String, default: "" },
    proofName: { type: String, default: "" },
    /** Payment screenshot stored as a data URL. */
    proofDataUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model("Booking", BookingSchema);
