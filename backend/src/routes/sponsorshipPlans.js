import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as sponsorshipController from "../controllers/sponsorshipController.js";

const router = Router();

// Public
router.get("/", sponsorshipController.listPlans);
router.get("/:id", sponsorshipController.getPlan);

// Admin
router.post("/", requireAuth, sponsorshipController.createPlan);
router.put("/:id", requireAuth, sponsorshipController.updatePlan);
router.delete("/:id", requireAuth, sponsorshipController.deletePlan);

export default router;
