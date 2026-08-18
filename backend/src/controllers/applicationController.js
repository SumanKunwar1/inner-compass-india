import { Application, APPLICATION_KINDS, APPLICATION_STATUSES } from "../models/Application.js";
import { SponsorshipPlan } from "../models/SponsorshipPlan.js";
import { asyncHandler, makeRef, validateDataUrl } from "../utils.js";

const REF_PREFIX = {
  membership: "MEM",
  "dharma-ideal": "SPN",
  community: "COM",
  corporate: "CRP",
};

/** POST /api/applications — public membership / sponsorship sign-up. */
export const createApplication = asyncHandler(async (req, res) => {
  const a = req.body ?? {};

  if (!APPLICATION_KINDS.includes(a.kind)) {
    return res.status(400).json({ error: `kind must be one of: ${APPLICATION_KINDS.join(", ")}` });
  }

  const required = ["fullName", "email", "mobile"];
  const missing = required.filter((k) => !String(a[k] ?? "").trim());
  if (missing.length) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(", ")}` });
  }

  const proof = validateDataUrl(a.proofDataUrl);
  if (!proof.ok) return res.status(400).json({ error: proof.error });

  // The fee comes from the database when a known plan is named, so the amount
  // cannot be altered by the client.
  const plan = a.planId ? await SponsorshipPlan.findOne({ id: a.planId }).lean() : null;

  const application = await Application.create({
    ref: makeRef(REF_PREFIX[a.kind] ?? "APP"),
    kind: a.kind,
    planId: plan?.id ?? "",
    planName: plan?.name ?? String(a.planName ?? ""),
    planPeriod: plan?.period ?? "",
    amount: plan ? plan.fee : Number(a.amount) || 0,
    fullName: a.fullName,
    email: a.email,
    mobile: a.mobile,
    pan: a.pan ?? "",
    address: a.address ?? "",
    message: a.message ?? "",
    organisation: a.organisation ?? "",
    designation: a.designation ?? "",
    website: a.website ?? "",
    memberCount: a.memberCount ?? "",
    proofName: a.proofName ?? "",
    proofDataUrl: proof.value,
    status: "pending",
  });

  res.status(201).json({ ref: application.ref, id: application._id });
});

/** GET /api/applications?kind=&status= — admin list. */
export const listApplications = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.kind && req.query.kind !== "all") filter.kind = req.query.kind;
  if (req.query.status && req.query.status !== "all") filter.status = req.query.status;
  const applications = await Application.find(filter).sort({ createdAt: -1 }).lean();
  res.json(applications);
});

/** PATCH /api/applications/:id — update status and/or the internal note. */
export const updateApplication = asyncHandler(async (req, res) => {
  const update = {};
  const { status, adminNote } = req.body ?? {};

  if (status !== undefined) {
    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${APPLICATION_STATUSES.join(", ")}` });
    }
    update.status = status;
  }
  if (adminNote !== undefined) update.adminNote = String(adminNote);

  if (!Object.keys(update).length) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const application = await Application.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
  if (!application) return res.status(404).json({ error: "Application not found" });
  res.json(application);
});

/** DELETE /api/applications/:id */
export const deleteApplication = asyncHandler(async (req, res) => {
  const deleted = await Application.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Application not found" });
  res.json({ ok: true });
});
