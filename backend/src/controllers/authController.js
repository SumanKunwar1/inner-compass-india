import { AdminUser } from "../models/AdminUser.js";
import { signToken } from "../middleware/auth.js";
import { asyncHandler } from "../utils.js";

/** POST /api/auth/login — exchange email + password for a JWT. */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const user = await AdminUser.findOne({ email: String(email).toLowerCase().trim() });
  // Same message either way so we don't reveal which accounts exist.
  if (!user || !(await user.verifyPassword(password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ token: signToken(user), user: { email: user.email, name: user.name } });
});

/** GET /api/auth/me — the currently signed-in admin. */
export const me = (req, res) => {
  res.json({ user: { email: req.user.email, name: req.user.name } });
};
