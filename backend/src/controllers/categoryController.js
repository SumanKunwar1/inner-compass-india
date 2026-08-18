import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { asyncHandler, slugify } from "../utils.js";

/** GET /api/categories — ordered for the shop's filter panel. */
export const listCategories = asyncHandler(async (req, res) => {
  const filter = req.query.includeHidden === "true" ? {} : { visible: { $ne: false } };
  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 }).lean();
  res.json(categories);
});

/** POST /api/categories */
export const createCategory = asyncHandler(async (req, res) => {
  const body = { ...(req.body ?? {}) };
  delete body._id;
  if (!String(body.id ?? "").trim()) body.id = slugify(body.name) || "cat_" + Math.random().toString(36).slice(2, 7);

  const exists = await Category.findOne({ id: body.id });
  if (exists) return res.status(409).json({ error: "A category with this id already exists" });

  const category = await Category.create(body);
  res.status(201).json(category.toObject());
});

/** PUT /api/categories/:id — renaming the id re-points every product that used it. */
export const updateCategory = asyncHandler(async (req, res) => {
  const body = { ...(req.body ?? {}) };
  delete body._id;
  const oldId = req.params.id;

  if (body.id && body.id !== oldId) {
    const clash = await Category.findOne({ id: body.id });
    if (clash) return res.status(409).json({ error: "A category with this id already exists" });
  }

  const category = await Category.findOneAndUpdate({ id: oldId }, body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!category) return res.status(404).json({ error: "Category not found" });

  if (body.id && body.id !== oldId) {
    await Product.updateMany({ category: oldId }, { category: body.id });
  }

  res.json(category);
});

/**
 * DELETE /api/categories/:id
 * Refuses while products still reference it, so deleting can't orphan the shop.
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse > 0) {
    return res.status(409).json({
      error: `${inUse} product${inUse === 1 ? "" : "s"} still use this category. Move them first, or hide the category instead.`,
    });
  }
  const deleted = await Category.findOneAndDelete({ id: req.params.id });
  if (!deleted) return res.status(404).json({ error: "Category not found" });
  res.json({ ok: true });
});
