import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import * as messageController from "../controllers/messageController.js";

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages. Please try again later." },
});

// Public
router.post("/", submitLimiter, messageController.createMessage);

// Admin
router.get("/", requireAuth, messageController.listMessages);
router.patch("/:id", requireAuth, messageController.updateMessageStatus);
router.delete("/:id", requireAuth, messageController.deleteMessage);

export default router;
