import { Donation } from "../models/Donation.js";
import { asyncHandler, makeRef, validateDataUrl } from "../utils.js";

/** POST /api/donations — public donation submission. */
export const createDonation = asyncHandler(async (req, res) => {
  const d = req.body ?? {};
  const required = ["fullName", "email", "mobile"];
  const missing = required.filter((k) => !String(d[k] ?? "").trim());
  if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });

  const proof = validateDataUrl(d.proofDataUrl);
  if (!proof.ok) return res.status(400).json({ error: proof.error });

  const donation = await Donation.create({
    ref: makeRef("DON"),
    amount: Math.max(0, Number(d.amount) || 0),
    fullName: d.fullName,
    email: d.email,
    mobile: d.mobile,
    pan: d.pan ?? "",
    message: d.message ?? "",
    proofName: d.proofName ?? "",
    proofDataUrl: proof.value,
    status: "pending",
  });

  res.status(201).json({ ref: donation.ref, id: donation._id });
});

/** GET /api/donations?status=pending — admin list. */
export const listDonations = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && req.query.status !== "all") filter.status = req.query.status;
  const donations = await Donation.find(filter).sort({ createdAt: -1 }).lean();
  res.json(donations);
});

/** PATCH /api/donations/:id — update status. */
export const updateDonationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body ?? {};
  if (!["pending", "received", "thanked"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const donation = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
  if (!donation) return res.status(404).json({ error: "Donation not found" });
  res.json(donation);
});

/** DELETE /api/donations/:id */
export const deleteDonation = asyncHandler(async (req, res) => {
  const deleted = await Donation.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Donation not found" });
  res.json({ ok: true });
});
