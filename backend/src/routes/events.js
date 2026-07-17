import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as eventController from "../controllers/eventController.js";

const router = Router();

// Public
router.get("/", eventController.listEvents);
router.get("/:slug", eventController.getEvent);

// Admin
router.post("/", requireAuth, eventController.createEvent);
router.put("/:slug", requireAuth, eventController.updateEvent);
router.delete("/:slug", requireAuth, eventController.deleteEvent);

export default router;
