import mongoose from "mongoose";

/** Singleton document (key: "site") holding editable global content. */
const SiteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true, index: true },

    // Homepage hero
    heroBadge: { type: String, default: "Healing · Meditation · Dharma Discourse · Charity" },
    heroTitle: { type: String, default: "A Day of Healing, Blessings & Inner Peace" },
    heroSubtitle: { type: String, default: "" },

    // Organization contact
    orgPhones: { type: [String], default: ["+91-8178804502"] },
    orgEmail: { type: String, default: "info@btmcfoundation.in" },
    orgAddress: { type: String, default: "Head Office: Siliguri, West Bengal · Contact Office: Paharganj, New Delhi" },
    website: { type: String, default: "www.btmcfoundation.in" },

    // Socials
    socials: {
      facebook: { type: String, default: "https://www.facebook.com/BTMCFoundation" },
      instagram: { type: String, default: "https://www.instagram.com/btmcfoundation/" },
      youtube: { type: String, default: "https://www.youtube.com/@dharmatelevision" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    // Impact stats shown across the site
    stats: {
      type: [{ label: { type: String, default: "" }, value: { type: String, default: "" } }],
      default: [],
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model("SiteSettings", SiteSettingsSchema);
