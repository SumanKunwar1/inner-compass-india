import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as settingsController from "../controllers/settingsController.js";

const router = Router();

// Public
router.get("/", settingsController.getSettings);

// Admin
router.put("/", requireAuth, settingsController.updateSettings);

export default router;
