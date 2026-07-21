import { TeamMember } from "../models/TeamMember.js";
import { asyncHandler } from "../utils.js";

/** GET /api/team — public, ordered list. */
export const listTeam = asyncHandler(async (_req, res) => {
  const team = await TeamMember.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(team);
});

/** POST /api/team — create a member. */
export const createTeamMember = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (!body.name?.trim()) return res.status(400).json({ error: "Name is required" });
  if (!body.id?.trim()) body.id = "tm_" + Math.random().toString(36).slice(2, 8);
  if (!body.initials?.trim()) {
    body.initials = body.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  }

  const exists = await TeamMember.findOne({ id: body.id });
  if (exists) return res.status(409).json({ error: "A member with this id already exists" });

  const member = await TeamMember.create(body);
  res.status(201).json(member.toObject());
});

/** PUT /api/team/:id — update a member. */
export const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!member) return res.status(404).json({ error: "Member not found" });
  res.json(member);
});

/** DELETE /api/team/:id */
export const deleteTeamMember = asyncHandler(async (req, res) => {
  const deleted = await TeamMember.findOneAndDelete({ id: req.params.id });
  if (!deleted) return res.status(404).json({ error: "Member not found" });
  res.json({ ok: true });
});
