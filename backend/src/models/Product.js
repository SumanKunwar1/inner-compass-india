import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    /** Stable public id used by the frontend (e.g. "am-1"). */
    id: { type: String, required: true, unique: true, index: true, trim: true },
    category: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    blessing: { type: String, default: "" },
    price: { type: String, default: "" },
    priceValue: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },
    badge: { type: String, default: "" },
    description: { type: String, default: "" },
    descriptionHtml: { type: String, default: "" },
    includes: { type: [String], default: [] },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
