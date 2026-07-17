import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import * as bookingController from "../controllers/bookingController.js";

const router = Router();

// Public submissions are rate limited to curb spam.
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

// Public
router.post("/", submitLimiter, bookingController.createBooking);

// Admin
router.get("/", requireAuth, bookingController.listBookings);
router.patch("/:id", requireAuth, bookingController.updateBookingStatus);
router.delete("/:id", requireAuth, bookingController.deleteBooking);

export default router;
