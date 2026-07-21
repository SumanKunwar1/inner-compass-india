import { Message } from "../models/Message.js";
import { asyncHandler } from "../utils.js";

/** POST /api/messages — public contact form submission. */
export const createMessage = asyncHandler(async (req, res) => {
  const m = req.body ?? {};
  const required = ["name", "email", "message"];
  const missing = required.filter((k) => !String(m[k] ?? "").trim());
  if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });

  const message = await Message.create({
    name: m.name,
    email: m.email,
    subject: m.subject ?? "",
    message: m.message,
    status: "new",
  });

  res.status(201).json({ id: message._id });
});

/** GET /api/messages?status=new — admin list. */
export const listMessages = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && req.query.status !== "all") filter.status = req.query.status;
  const messages = await Message.find(filter).sort({ createdAt: -1 }).lean();
  res.json(messages);
});

/** PATCH /api/messages/:id — update status. */
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body ?? {};
  if (!["new", "read", "replied", "archived"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const message = await Message.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
  if (!message) return res.status(404).json({ error: "Message not found" });
  res.json(message);
});

/** DELETE /api/messages/:id */
export const deleteMessage = asyncHandler(async (req, res) => {
  const deleted = await Message.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Message not found" });
  res.json({ ok: true });
});
