import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import bookingRoutes from "./routes/bookings.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import donationRoutes from "./routes/donations.js";
import messageRoutes from "./routes/messages.js";
import teamRoutes from "./routes/team.js";
import settingsRoutes from "./routes/settings.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------------- middleware ------------------------- */

const isProd = process.env.NODE_ENV === "production";

const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const LOCALHOST = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function isAllowedOrigin(origin) {
  // Same-origin / non-browser callers send no Origin header.
  if (!origin) return true;
  if (allowed.length === 0) return true;
  if (allowed.includes(origin)) return true;
  // Outside production, accept any localhost port so the dev server's port doesn't matter.
  if (!isProd && LOCALHOST.test(origin)) return true;
  return false;
}

app.use(
  cors({
    origin(origin, cb) {
      if (isAllowedOrigin(origin)) return cb(null, true);
      cb(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

// Screenshots arrive as base64 data URLs, so the body limit is generous.
const bodyLimit = process.env.MAX_BODY_SIZE || "10mb";
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ------------------------- routes ------------------------- */

app.get("/api/health", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    ok: true,
    db: states[mongoose.connection.readyState] ?? "unknown",
    uptime: process.uptime(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/settings", settingsRoutes);

app.use((req, res) => res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` }));

/* ------------------------- error handling ------------------------- */

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err?.message?.includes("not allowed by CORS")) {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  console.error("Unhandled error:", err);
  if (err?.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ error: "Duplicate key — that record already exists." });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "Upload too large." });
  }
  res.status(500).json({ error: "Internal server error" });
});

/* ------------------------- start ------------------------- */

async function start() {
  try {
    await connectDB();
  } catch (err) {
    console.error("✖ Failed to connect to MongoDB:", err.message);
    console.error("  Check MONGODB_URI in backend/.env, and that your IP is allowed in Atlas → Network Access.");
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`✔ API listening on http://localhost:${PORT}`);
    console.log(`  Allowed origins: ${allowed.length ? allowed.join(", ") : "(all)"}`);
    if (!isProd) console.log("  (dev mode — any http://localhost:<port> is also allowed)");
  });

  // `listen` reports failures via an 'error' event, not a rejected promise.
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n✖ Port ${PORT} is already in use — another server is still running.\n`);
      console.error("  Stop it, or set a different PORT in backend/.env. To find and stop it:\n");
      console.error(`    Windows (PowerShell):`);
      console.error(`      Get-NetTCPConnection -LocalPort ${PORT} -State Listen | Stop-Process -Id { $_.OwningProcess } -Force`);
      console.error(`    Windows (cmd):`);
      console.error(`      netstat -ano | findstr :${PORT}     then     taskkill /PID <pid> /F`);
      console.error(`    macOS / Linux:`);
      console.error(`      lsof -ti:${PORT} | xargs kill -9\n`);
    } else {
      console.error("✖ Server error:", err.message);
    }
    process.exit(1);
  });
}

start();

export default app;
