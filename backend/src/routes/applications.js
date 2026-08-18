import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as applicationController from "../controllers/applicationController.js";

const router = Router();

// Public — anyone can apply.
router.post("/", applicationController.createApplication);

// Admin
router.get("/", requireAuth, applicationController.listApplications);
router.patch("/:id", requireAuth, applicationController.updateApplication);
router.delete("/:id", requireAuth, applicationController.deleteApplication);

export default router;
