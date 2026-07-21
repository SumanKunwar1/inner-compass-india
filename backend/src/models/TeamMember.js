import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    /** Fallback avatar initials when no image is set. */
    initials: { type: String, default: "" },
    /** CSS gradient for the avatar backdrop. */
    gradient: { type: String, default: "linear-gradient(135deg, var(--maroon), var(--maroon-deep))" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
    socials: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const TeamMember = mongoose.model("TeamMember", TeamMemberSchema);
