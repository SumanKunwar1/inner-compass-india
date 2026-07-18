# BTMC Foundation India

Monorepo containing the public website + admin panel (`frontend/`) and the REST API (`backend/`).

```
.
├── frontend/   TanStack Start (React 19 + Vite + Tailwind) — public site & admin panel
└── backend/    Express + Mongoose — REST API backed by MongoDB Atlas
    └── src/
        ├── config/       db connection
        ├── models/       Mongoose schemas
        ├── controllers/  request handlers (business logic)
        ├── routes/       path → controller wiring
        ├── middleware/    JWT auth guard
        ├── seed.js       seeds admin + events + products
        └── server.js     app entry
```

---

## Quick start

Run the two apps in **two terminals**.

### 1. Backend (API)

```bash
cd backend
cp .env.example .env      # then fill in MONGODB_URI, JWT_SECRET, ADMIN_* values
npm install
npm run seed              # creates the admin user + seeds events/products (safe to re-run)
npm run dev               # http://localhost:5000
```

### 2. Frontend (site + admin)

```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:3000
```

Then open:

- Public site → http://localhost:3000
- Admin panel → http://localhost:3000/admin

Sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env`.

> The frontend dev port must be listed in the backend's `CORS_ORIGIN`, otherwise the
> browser's API calls are rejected with `403 Origin not allowed`.

---

## Environment

Secrets live only in `.env` files, which are gitignored. `.env.example` in each folder
documents every variable.

**backend/.env**

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string (include the `/btmc` database name) |
| `JWT_SECRET` | Secret used to sign admin sessions — use a long random string |
| `JWT_EXPIRES_IN` | Session lifetime (default `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin account created by `npm run seed` |
| `CORS_ORIGIN` | Comma-separated list of allowed frontend origins |
| `MAX_BODY_SIZE` | Max JSON body (payment screenshots are base64 data URLs) |

**frontend/.env**

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:5000/api` |

---

## Seeding

```bash
cd backend
npm run seed            # upserts only what's missing; never touches bookings/orders
npm run seed -- --force # overwrite existing events/products with the defaults
```

---

## API

Public (no auth):

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health + DB status |
| `GET` | `/api/events` | List charity events |
| `GET` | `/api/events/:slug` | Single charity event |
| `POST` | `/api/bookings` | Submit an event booking |
| `GET` | `/api/products` | List healing items (`?category=`) |
| `GET` | `/api/products/:id` | Single product |
| `POST` | `/api/orders` | Place an order |

Admin (`Authorization: Bearer <token>`):

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Exchange email+password for a JWT |
| `GET` | `/api/auth/me` | Current admin |
| `POST`/`PUT`/`DELETE` | `/api/events[/:slug]` | Manage events |
| `GET`/`PATCH`/`DELETE` | `/api/bookings[/:id]` | Manage bookings |
| `POST`/`PUT`/`DELETE` | `/api/products[/:id]` | Manage products |
| `GET`/`PATCH`/`DELETE` | `/api/orders[/:id]` | Manage orders |

### Server-enforced rules

- Booking/order **reference numbers and status are assigned by the server**, never the client.
- Order **prices are read from the database**, so a tampered client amount is ignored.
- Payment screenshots must be base64 **image** data URLs under 5 MB.
- Login and public submissions are rate limited.

---

## Production deployment (Ubuntu VPS · PM2 · Nginx)

### Frontend — TanStack Start / Nitro **node-server**

The Lovable Vite wrapper defaults Nitro to the `cloudflare-module` preset, which emits a
Cloudflare **Worker** (`export default { fetch }`) — not a Node server. Running that with
`node .output/server/index.mjs` binds nothing and exits instantly (→ PM2 "online" but nothing
listening → Nginx 502). This repo pins the Node preset in [`vite.config.ts`](frontend/vite.config.ts):

```ts
nitro: { preset: process.env.NITRO_PRESET || "node-server" }
```

Verify a build is a Node server (not Cloudflare):

```bash
cd frontend
npm ci
npm run build
grep '"preset"' .output/nitro.json        # → "preset": "node-server"
grep -c 'serve(' .output/server/index.mjs  # → 1  (the Cloudflare build prints 0)
```

Run it:

```bash
PORT=3000 node .output/server/index.mjs
# ➜ Listening on: http://localhost:3000/     ← stays alive, binds the port
# or: npm start        (same command)
```

Under PM2 (config: [`frontend/ecosystem.config.cjs`](frontend/ecosystem.config.cjs)):

```bash
cd frontend
npm ci && npm run build
pm2 start ecosystem.config.cjs
pm2 save                 # + `pm2 startup` once, to survive reboot
```

The server binds `127.0.0.1:3000` (loopback); Nginx proxies public traffic to it:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

> `VITE_API_URL` is baked in **at build time**. On the VPS set it to the public API URL
> (e.g. `https://api.your-domain.com/api`) in `frontend/.env` **before** `npm run build`.

### Backend — Express API

```bash
cd backend
npm ci
npm run seed            # first deploy only
pm2 start src/server.js --name inner-compass-api
pm2 save
```

Set `NODE_ENV=production` and put the real frontend origin in `CORS_ORIGIN` (the dev
"any localhost port" allowance is disabled in production).

---

## Notes

- Payment screenshots are stored as base64 data URLs inside the MongoDB documents. This is
  fine at the current volume, but object storage (S3/Cloudinary) is the better long-term home
  once uploads grow.
- `frontend/src/data/*` still holds the original seed content. It is used as the server-render
  snapshot so public pages have meaningful HTML on first paint; live data replaces it once the
  client fetches from the API.
