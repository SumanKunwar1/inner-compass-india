import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import * as orderController from "../controllers/orderController.js";

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
router.post("/", submitLimiter, orderController.createOrder);

// Admin
router.get("/", requireAuth, orderController.listOrders);
router.patch("/:id", requireAuth, orderController.updateOrderStatus);
router.delete("/:id", requireAuth, orderController.deleteOrder);

export default router;
