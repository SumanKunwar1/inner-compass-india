import { Product } from "../models/Product.js";
import { asyncHandler, slugify } from "../utils.js";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

/**
 * Fills in the values the public pages depend on so neither the admin form nor the
 * frontend has to. `image` and `images` are kept consistent in both directions:
 * older products only have `image`, newer ones lead with the gallery.
 */
function normalize(body) {
  const d = { ...body };

  // Never let the client set Mongo's own bookkeeping fields.
  delete d._id;
  delete d.__v;
  delete d.createdAt;
  delete d.updatedAt;

  if (typeof d.name === "string") d.name = d.name.trim();
  if (typeof d.id === "string") d.id = d.id.trim();

  // Gallery <-> cover reconciliation.
  if (Array.isArray(d.images)) {
    d.images = d.images.filter((x) => typeof x === "string" && x.trim());
    const idx = Math.min(Math.max(Number(d.coverIndex) || 0, 0), Math.max(d.images.length - 1, 0));
    d.coverIndex = d.images.length ? idx : 0;
    d.image = d.images[d.coverIndex] ?? "";
  } else if (typeof d.image === "string" && d.image.trim()) {
    // Legacy single-image payload — promote it to a one-entry gallery.
    d.images = [d.image];
    d.coverIndex = 0;
  }

  // Display price follows the numeric price unless it was written by hand.
  if (d.priceValue !== undefined && !String(d.price ?? "").trim()) {
    d.price = Number(d.priceValue) > 0 ? inr(d.priceValue) : "";
  }

  if (!String(d.slug ?? "").trim() && d.name) d.slug = slugify(d.name);

  for (const key of ["includes", "benefits", "tags"]) {
    if (Array.isArray(d[key])) d[key] = d[key].map((x) => String(x).trim()).filter(Boolean);
  }

  if (d.stock === "" || d.stock === undefined) d.stock = null;

  return d;
}

/**
 * GET /api/products
 * Supports ?category, ?q, ?sort, ?minPrice, ?maxPrice, ?featured, ?includeHidden.
 * Filtering happens here so the shop page stays in sync when the catalogue grows.
 */
export const listProducts = asyncHandler(async (req, res) => {
  const { category, q, sort, minPrice, maxPrice, featured, includeHidden } = req.query;
  const filter = {};

  if (category && category !== "all") {
    // Accept a comma-separated list so the shop can check several boxes at once.
    const cats = String(category).split(",").map((c) => c.trim()).filter(Boolean);
    if (cats.length === 1) filter.category = cats[0];
    else if (cats.length > 1) filter.category = { $in: cats };
  }

  // Hidden products are admin-only; the public list never sees them.
  if (includeHidden !== "true") filter.published = { $ne: false };

  if (featured === "true") filter.featured = true;

  if (minPrice || maxPrice) {
    filter.priceValue = {};
    if (minPrice) filter.priceValue.$gte = Number(minPrice) || 0;
    if (maxPrice) filter.priceValue.$lte = Number(maxPrice) || 0;
  }

  if (q && String(q).trim()) {
    const rx = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: rx }, { blessing: rx }, { description: rx }, { sku: rx }, { tags: rx }];
  }

  const sorts = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "price-asc": { priceValue: 1 },
    "price-desc": { priceValue: -1 },
    "name-asc": { name: 1 },
    "name-desc": { name: -1 },
    rating: { rating: -1, reviews: -1 },
    featured: { featured: -1, sortOrder: 1, createdAt: -1 },
  };

  const products = await Product.find(filter).sort(sorts[sort] ?? sorts.featured).lean();
  res.json(products);
});

/** GET /api/products/:id — matched by public id first, then slug. */
export const getProduct = asyncHandler(async (req, res) => {
  const key = req.params.id;
  const product =
    (await Product.findOne({ id: key }).lean()) ?? (await Product.findOne({ slug: key }).lean());
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

/** POST /api/products — create a product. Every field is optional. */
export const createProduct = asyncHandler(async (req, res) => {
  const body = normalize(req.body ?? {});
  if (!body.id) body.id = "p_" + Math.random().toString(36).slice(2, 8);

  const exists = await Product.findOne({ id: body.id });
  if (exists) return res.status(409).json({ error: "A product with this id already exists" });

  const product = await Product.create(body);
  res.status(201).json(product.toObject());
});

/** PUT /api/products/:id — update a product. */
export const updateProduct = asyncHandler(async (req, res) => {
  const body = normalize(req.body ?? {});
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
