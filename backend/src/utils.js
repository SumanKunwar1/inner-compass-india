/** Wraps an async route handler so rejections reach the error middleware. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/** Generates a short human-readable reference, e.g. BTMC-CE-A1B2C. */
export function makeRef(prefix) {
  return `BTMC-${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

/**
 * Rejects oversized or non-image data URLs. Screenshots arrive as base64 data URLs;
 * anything else is refused so we never persist arbitrary payloads.
 */
export function validateDataUrl(value, maxBytes = 5 * 1024 * 1024) {
  if (!value) return { ok: true, value: "" };
  if (typeof value !== "string" || !/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value)) {
    return { ok: false, error: "Payment screenshot must be a base64 image data URL." };
  }
  const base64 = value.split(",")[1] ?? "";
  const bytes = Math.floor((base64.length * 3) / 4);
  if (bytes > maxBytes) return { ok: false, error: "Payment screenshot must be under 5 MB." };
  return { ok: true, value };
}
