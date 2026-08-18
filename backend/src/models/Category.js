import mongoose from "mongoose";

/**
 * Product categories for the healing-items shop.
 *
 * These used to live as a hardcoded list in the frontend and were surfaced through
 * the header's sub-navigation dropdown. They are now editable records so the admin
 * panel can manage them and the shop can filter by them.
 */
const CategorySchema = new mongoose.Schema(
  {
    /** Stable public id / slug used by the frontend (e.g. "amulets"). */
    id: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, default: "", trim: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    /** Decorative CSS gradient used wherever a product has no photo. */
    gradient: { type: String, default: "linear-gradient(135deg, oklch(0.35 0.13 25), oklch(0.68 0.19 55))" },
    /** Lucide icon name; the frontend maps it back to a component. */
    icon: { type: String, default: "Sparkles" },
    sortOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
