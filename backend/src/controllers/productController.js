import { Product } from "../models/Product.js";
import { asyncHandler } from "../utils.js";

/** GET /api/products?category=amulets — list products. */
export const listProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category && req.query.category !== "all") filter.category = req.query.category;
  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
  res.json(products);
});

/** GET /api/products/:id — a single product. */
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ id: req.params.id }).lean();
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

/** POST /api/products — create a product. */
export const createProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (!body.name?.trim()) return res.status(400).json({ error: "Product name is required" });
  if (!(Number(body.priceValue) > 0)) return res.status(400).json({ error: "A valid price is required" });
  if (!body.id?.trim()) body.id = "p_" + Math.random().toString(36).slice(2, 8);
  if (!body.price?.trim()) body.price = `₹${Number(body.priceValue).toLocaleString("en-IN")}`;

  const exists = await Product.findOne({ id: body.id });
  if (exists) return res.status(409).json({ error: "A product with this id already exists" });

  const product = await Product.create(body);
  res.status(201).json(product.toObject());
});

/** PUT /api/products/:id — update a product. */
export const updateProduct = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.id && body.id !== req.params.id) {
    const clash = await Product.findOne({ id: body.id });
    if (clash) return res.status(409).json({ error: "A product with this id already exists" });
  }
  const product = await Product.findOneAndUpdate({ id: req.params.id }, body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

/** DELETE /api/products/:id */
export const deleteProduct = asyncHandler(async (req, res) => {
  const deleted = await Product.findOneAndDelete({ id: req.params.id });
  if (!deleted) return res.status(404).json({ error: "Product not found" });
  res.json({ ok: true });
});
