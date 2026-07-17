import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as productController from "../controllers/productController.js";

const router = Router();

// Public
router.get("/", productController.listProducts);
router.get("/:id", productController.getProduct);

// Admin
router.post("/", requireAuth, productController.createProduct);
router.put("/:id", requireAuth, productController.updateProduct);
router.delete("/:id", requireAuth, productController.deleteProduct);

export default router;
