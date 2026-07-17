import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, unique: true, index: true },
    productId: { type: String, required: true, index: true },
    productName: { type: String, default: "" },
    amount: { type: Number, default: 0, min: 0 },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    pan: { type: String, default: "" },
    message: { type: String, default: "" },
    proofName: { type: String, default: "" },
    /** Payment screenshot stored as a data URL. */
    proofDataUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
