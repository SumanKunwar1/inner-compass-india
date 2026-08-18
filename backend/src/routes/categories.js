import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as categoryController from "../controllers/categoryController.js";

const router = Router();

// Public
router.get("/", categoryController.listCategories);

// Admin
router.post("/", requireAuth, categoryController.createCategory);
router.put("/:id", requireAuth, categoryController.updateCategory);
router.delete("/:id", requireAuth, categoryController.deleteCategory);

export default router;
