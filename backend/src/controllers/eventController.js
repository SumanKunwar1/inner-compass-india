import { CharityEvent } from "../models/CharityEvent.js";
import { asyncHandler, slugify } from "../utils.js";

/** GET /api/events — list all events (upcoming first, then newest). */
export const listEvents = asyncHandler(async (_req, res) => {
  const events = await CharityEvent.find().sort({ status: 1, createdAt: -1 }).lean();
  res.json(events);
});

/** GET /api/events/:slug — a single event. */
export const getEvent = asyncHandler(async (req, res) => {
  const event = await CharityEvent.findOne({ slug: req.params.slug }).lean();
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

/** POST /api/events — create an event. */
export const createEvent = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  body.slug = slugify(body.slug || body.title);
  if (!body.slug) return res.status(400).json({ error: "A title or slug is required" });
  if (!body.title?.trim()) return res.status(400).json({ error: "Title is required" });
  if (!body.city?.trim()) return res.status(400).json({ error: "City is required" });

  const exists = await CharityEvent.findOne({ slug: body.slug });
  if (exists) return res.status(409).json({ error: "An event with this slug already exists" });

  const event = await CharityEvent.create(body);
  res.status(201).json(event.toObject());
});

/** PUT /api/events/:slug — update an event (the slug may change). */
export const updateEvent = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (body.slug) body.slug = slugify(body.slug);

  // Guard against renaming onto an existing slug.
  if (body.slug && body.slug !== req.params.slug) {
    const clash = await CharityEvent.findOne({ slug: body.slug });
    if (clash) return res.status(409).json({ error: "An event with this slug already exists" });
  }

  const event = await CharityEvent.findOneAndUpdate({ slug: req.params.slug }, body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json(event);
});

/** DELETE /api/events/:slug */
export const deleteEvent = asyncHandler(async (req, res) => {
  const deleted = await CharityEvent.findOneAndDelete({ slug: req.params.slug });
  if (!deleted) return res.status(404).json({ error: "Event not found" });
  res.json({ ok: true });
});
