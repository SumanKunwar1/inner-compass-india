import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as teamController from "../controllers/teamController.js";

const router = Router();

// Public
router.get("/", teamController.listTeam);

// Admin
router.post("/", requireAuth, teamController.createTeamMember);
router.put("/:id", requireAuth, teamController.updateTeamMember);
router.delete("/:id", requireAuth, teamController.deleteTeamMember);

export default router;
