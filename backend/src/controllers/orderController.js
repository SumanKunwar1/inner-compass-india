import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { asyncHandler, makeRef, validateDataUrl } from "../utils.js";

/** POST /api/orders — public order from the healing items shop. */
export const createOrder = asyncHandler(async (req, res) => {
  const o = req.body ?? {};
  const required = ["productId", "fullName", "email", "mobile"];
  const missing = required.filter((k) => !String(o[k] ?? "").trim());
  if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });

  const proof = validateDataUrl(o.proofDataUrl);
  if (!proof.ok) return res.status(400).json({ error: proof.error });

  // Price comes from the database, not the client, so it can't be tampered with.
  const product = await Product.findOne({ id: o.productId }).lean();
  if (!product) return res.status(404).json({ error: "Product not found" });

  const order = await Order.create({
    ref: makeRef("ORD"),
    productId: product.id,
    productName: product.name,
    amount: product.priceValue,
    fullName: o.fullName,
    email: o.email,
    mobile: o.mobile,
    pan: o.pan ?? "",
    message: o.message ?? "",
    proofName: o.proofName ?? "",
    proofDataUrl: proof.value,
    status: "pending",
  });

  res.status(201).json({ ref: order.ref, id: order._id });
});

/** GET /api/orders?status=pending — admin list. */
export const listOrders = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && req.query.status !== "all") filter.status = req.query.status;
  const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
  res.json(orders);
});

/** PATCH /api/orders/:id — update status. */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body ?? {};
  if (!["pending", "paid", "shipped", "cancelled"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

/** DELETE /api/orders/:id */
export const deleteOrder = asyncHandler(async (req, res) => {
  const deleted = await Order.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Order not found" });
  res.json({ ok: true });
});
