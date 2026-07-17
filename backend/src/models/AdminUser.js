import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Administrator" },
  },
  { timestamps: true }
);

AdminUserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

AdminUserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

export const AdminUser = mongoose.model("AdminUser", AdminUserSchema);
