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

## Notes

- Payment screenshots are stored as base64 data URLs inside the MongoDB documents. This is
  fine at the current volume, but object storage (S3/Cloudinary) is the better long-term home
  once uploads grow.
- `frontend/src/data/*` still holds the original seed content. It is used as the server-render
  snapshot so public pages have meaningful HTML on first paint; live data replaces it once the
  client fetches from the API.
