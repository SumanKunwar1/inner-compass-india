import { SiteSettings } from "../models/SiteSettings.js";
import { asyncHandler } from "../utils.js";

const KEY = "site";

/** Returns the singleton, creating it with defaults on first access. */
async function getOrCreate() {
  let settings = await SiteSettings.findOne({ key: KEY });
  if (!settings) settings = await SiteSettings.create({ key: KEY });
  return settings;
}

/** GET /api/settings — public. */
export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreate();
  res.json(settings.toObject());
});

/** PUT /api/settings — admin update. */
export const updateSettings = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  // The key is fixed — never let it be overwritten.
  delete body.key;
  delete body._id;

  const settings = await SiteSettings.findOneAndUpdate({ key: KEY }, body, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  }).lean();
  res.json(settings);
});
