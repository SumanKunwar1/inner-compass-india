import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import * as donationController from "../controllers/donationController.js";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

// Public
router.post("/", submitLimiter, donationController.createDonation);

// Admin
router.get("/", requireAuth, donationController.listDonations);
router.patch("/:id", requireAuth, donationController.updateDonationStatus);
router.delete("/:id", requireAuth, donationController.deleteDonation);

export default router;
