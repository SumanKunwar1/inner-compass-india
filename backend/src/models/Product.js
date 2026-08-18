import mongoose from "mongoose";

/**
 * A healing-item product.
 *
 * Every field except the internal `id` is optional — the admin panel can save a
 * partially filled product and complete it later, and the public pages simply omit
 * whatever is blank. Anything required here would block that workflow.
 */
const ProductSchema = new mongoose.Schema(
  {
    /** Stable public id used in URLs (e.g. "am-1"). */
    id: { type: String, required: true, unique: true, index: true, trim: true },
    /** Human-readable URL slug; falls back to `id` when blank. */
    slug: { type: String, default: "", index: true, trim: true },
    category: { type: String, default: "", index: true },

    /* ---------------- identity ---------------- */
    name: { type: String, default: "", trim: true },
    /** One-line subtitle shown under the name. */
    blessing: { type: String, default: "" },
    sku: { type: String, default: "", trim: true },
    badge: { type: String, default: "" },
    tags: { type: [String], default: [] },

    /* ---------------- pricing ---------------- */
    /** Display price, e.g. "₹5,100". Derived from priceValue when blank. */
    price: { type: String, default: "" },
    priceValue: { type: Number, default: 0, min: 0 },
    /** Optional struck-through "was" price. Shown only when above priceValue. */
    compareAtPrice: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "INR" },

    /* ---------------- availability ---------------- */
    /** "in-stock" | "made-to-order" | "low-stock" | "out-of-stock" */
    stockStatus: { type: String, default: "in-stock" },
    stock: { type: Number, default: null },
    /** Hidden products stay in the admin list but never reach the public shop. */
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },

    /* ---------------- social proof ---------------- */
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    /* ---------------- media ---------------- */
    /** Cover image (URL or data URL). Kept in sync with images[coverIndex]. */
    image: { type: String, default: "" },
    /** Full gallery. The cover is included here too. */
    images: { type: [String], default: [] },
    /** Which gallery entry is the cover. */
    coverIndex: { type: Number, default: 0, min: 0 },
    /**
     * How product photos sit in their frame.
     * "contain" shows the whole photo (nothing cropped); "cover" fills and crops.
     */
    imageFit: { type: String, default: "contain" },

    /* ---------------- copy ---------------- */
    description: { type: String, default: "" },
    descriptionHtml: { type: String, default: "" },
    includes: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    howToUse: { type: String, default: "" },
    careInstructions: { type: String, default: "" },
    shippingInfo: { type: String, default: "" },

    /* ---------------- specifications ---------------- */
    materials: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    weight: { type: String, default: "" },
    origin: { type: String, default: "" },
    consecratedBy: { type: String, default: "" },
    deliveryTime: { type: String, default: "" },

    /* ---------------- seo ---------------- */
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
