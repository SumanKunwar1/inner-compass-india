import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import { CharityEvent } from "./models/CharityEvent.js";
import { Product } from "./models/Product.js";
import { AdminUser } from "./models/AdminUser.js";
import { events, products } from "./seedData.js";

/**
 * Seeds initial content and the admin account.
 * Safe to re-run: upserts by slug/id and never touches bookings or orders.
 * Pass --force to overwrite existing event/product documents.
 */
async function seed() {
  const force = process.argv.includes("--force");
  await connectDB();

  // Admin user
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }
  const existingAdmin = await AdminUser.findOne({ email });
  if (existingAdmin) {
    console.log(`• Admin already exists: ${email}`);
  } else {
    await AdminUser.create({ email, passwordHash: await AdminUser.hashPassword(password), name: "Administrator" });
    console.log(`✔ Admin created: ${email}`);
  }

  // Events
  let created = 0;
  let skipped = 0;
  for (const e of events) {
    const exists = await CharityEvent.findOne({ slug: e.slug });
    if (exists && !force) {
      skipped++;
      continue;
    }
    await CharityEvent.findOneAndUpdate({ slug: e.slug }, e, { upsert: true, new: true, setDefaultsOnInsert: true });
    created++;
  }
  console.log(`✔ Events — ${created} upserted, ${skipped} left untouched`);

  // Products
  created = 0;
  skipped = 0;
  for (const p of products) {
    const exists = await Product.findOne({ id: p.id });
    if (exists && !force) {
      skipped++;
      continue;
    }
    await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true, setDefaultsOnInsert: true });
    created++;
  }
  console.log(`✔ Products — ${created} upserted, ${skipped} left untouched`);

  if (skipped > 0 && !force) console.log("  (re-run with --force to overwrite existing records)");

  await mongoose.disconnect();
  console.log("✔ Seed complete");
}

seed().catch((err) => {
  console.error("✖ Seed failed:", err.message);
  process.exit(1);
});
