import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    time: { type: String, default: "" },
    tone: { type: String, default: "" },
    donation: { type: String, default: "" },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

const BankSchema = new mongoose.Schema(
  {
    bankName: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    ifsc: { type: String, default: "" },
    branch: { type: String, default: "" },
  },
  { _id: false }
);

const CharityEventSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, default: "India" },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    status: { type: String, enum: ["upcoming", "past"], default: "upcoming", index: true },
    detailsAvailable: { type: Boolean, default: true },
    date: { type: String, default: "" },
    dateShort: { type: String, default: "" },
    venue: { type: String, default: "" },
    venueNote: { type: String, default: "" },
    image: { type: String, default: "" },
    teacher: { type: String, default: "" },
    teacherTitle: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    intro: { type: String, default: "" },
    overview: { type: [String], default: [] },
    descriptionHtml: { type: String, default: "" },
    sessions: { type: [SessionSchema], default: [] },
    contacts: { type: [String], default: [] },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
    supportsNote: { type: String, default: "" },
    bank: { type: BankSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const CharityEvent = mongoose.model("CharityEvent", CharityEventSchema);
