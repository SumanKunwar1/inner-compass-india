import { SponsorshipPlan, PLAN_KINDS } from "../models/SponsorshipPlan.js";
import { Application } from "../models/Application.js";
import { asyncHandler, slugify } from "../utils.js";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

/** Fills in what the public pages rely on so the admin form doesn't have to. */
function normalize(body) {
  const d = { ...body };
  delete d._id;
  delete d.__v;
  delete d.createdAt;
  delete d.updatedAt;

  if (typeof d.name === "string") d.name = d.name.trim();
  if (typeof d.id === "string") d.id = d.id.trim();

  if (d.fee !== undefined && !String(d.feeLabel ?? "").trim()) {
    d.feeLabel = Number(d.fee) > 0 ? inr(d.fee) : "";
  }

  for (const key of ["benefits", "suitableFor"]) {
    if (Array.isArray(d[key])) d[key] = d[key].map((x) => String(x).trim()).filter(Boolean);
  }

  if (Array.isArray(d.mediaBenefits)) {
    d.mediaBenefits = d.mediaBenefits
      .map((m) => ({ title: String(m?.title ?? "").trim(), detail: String(m?.detail ?? "").trim() }))
      .filter((m) => m.title || m.detail);
  }

  return d;
}

/** GET /api/sponsorship-plans?kind=membership — ordered for the public pages. */
export const listPlans = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.kind && req.query.kind !== "all") {
    const kinds = String(req.query.kind).split(",").map((k) => k.trim()).filter(Boolean);
    filter.kind = kinds.length > 1 ? { $in: kinds } : kinds[0];
  }
  // Drafts are admin-only.
  if (req.query.includeHidden !== "true") filter.published = { $ne: false };

  const plans = await SponsorshipPlan.find(filter).sort({ sortOrder: 1, fee: 1, createdAt: 1 }).lean();
  res.json(plans);
});

/** GET /api/sponsorship-plans/:id */
export const getPlan = asyncHandler(async (req, res) => {
  const plan = await SponsorshipPlan.findOne({ id: req.params.id }).lean();
  if (!plan) return res.status(404).json({ error: "Plan not found" });
  res.json(plan);
});

/** POST /api/sponsorship-plans */
export const createPlan = asyncHandler(async (req, res) => {
  const body = normalize(req.body ?? {});
  if (!PLAN_KINDS.includes(body.kind)) {
    return res.status(400).json({ error: `kind must be one of: ${PLAN_KINDS.join(", ")}` });
  }
  if (!body.id) body.id = slugify(body.name) || "plan_" + Math.random().toString(36).slice(2, 8);

  const exists = await SponsorshipPlan.findOne({ id: body.id });
  if (exists) return res.status(409).json({ error: "A plan with this id already exists" });

  const plan = await SponsorshipPlan.create(body);
  res.status(201).json(plan.toObject());
});

/** PUT /api/sponsorship-plans/:id */
export const updatePlan = asyncHandler(async (req, res) => {
  const body = normalize(req.body ?? {});
  if (body.kind && !PLAN_KINDS.includes(body.kind)) {
    return res.status(400).json({ error: `kind must be one of: ${PLAN_KINDS.join(", ")}` });
  }
  if (body.id && body.id !== req.params.id) {
    const clash = await SponsorshipPlan.findOne({ id: body.id });
    if (clash) return res.status(409).json({ error: "A plan with this id already exists" });
  }

  const plan = await SponsorshipPlan.findOneAndUpdate({ id: req.params.id }, body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!plan) return res.status(404).json({ error: "Plan not found" });
  res.json(plan);
});

/**
 * DELETE /api/sponsorship-plans/:id
 * Refused while applications reference it, so deleting can't orphan a record.
 * Unpublishing is the safe way to retire a plan people already applied to.
 */
export const deletePlan = asyncHandler(async (req, res) => {
  const inUse = await Application.countDocuments({ planId: req.params.id });
  if (inUse > 0) {
    return res.status(409).json({
      error: `${inUse} application${inUse === 1 ? " references" : "s reference"} this plan. Unpublish it instead of deleting.`,
    });
  }
  const deleted = await SponsorshipPlan.findOneAndDelete({ id: req.params.id });
  if (!deleted) return res.status(404).json({ error: "Plan not found" });
  res.json({ ok: true });
});
