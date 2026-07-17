import { Booking } from "../models/Booking.js";
import { asyncHandler, makeRef, validateDataUrl } from "../utils.js";

/** POST /api/bookings — public submission from the charity event form. */
export const createBooking = asyncHandler(async (req, res) => {
  const b = req.body ?? {};
  const required = ["eventSlug", "fullName", "email", "mobile"];
  const missing = required.filter((k) => !String(b[k] ?? "").trim());
  if (missing.length) return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });

  const proof = validateDataUrl(b.proofDataUrl);
  if (!proof.ok) return res.status(400).json({ error: proof.error });

  // Reference and status are server-controlled — never trust the client for these.
  const booking = await Booking.create({
    ref: makeRef("CE"),
    eventSlug: b.eventSlug,
    eventTitle: b.eventTitle ?? "",
    session: b.session ?? "",
    sessionLabel: b.sessionLabel ?? "",
    seats: Math.max(1, Number(b.seats) || 1),
    amount: Math.max(0, Number(b.amount) || 0),
    fullName: b.fullName,
    email: b.email,
    mobile: b.mobile,
    whatsapp: b.whatsapp ?? "",
    city: b.city ?? "",
    message: b.message ?? "",
    proofName: b.proofName ?? "",
    proofDataUrl: proof.value,
    status: "pending",
  });

  res.status(201).json({ ref: booking.ref, id: booking._id });
});

/** GET /api/bookings?status=pending — admin list. */
export const listBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && req.query.status !== "all") filter.status = req.query.status;
  const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();
  res.json(bookings);
});

/** PATCH /api/bookings/:id — update status. */
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body ?? {};
  if (!["pending", "confirmed", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
  if (!booking) return res.status(404).json({ error: "Booking not found" });
  res.json(booking);
});

/** DELETE /api/bookings/:id */
export const deleteBooking = asyncHandler(async (req, res) => {
  const deleted = await Booking.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Booking not found" });
  res.json({ ok: true });
});
