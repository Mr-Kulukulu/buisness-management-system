# Kazi Electric — Management System (MERN rebuild)

This is a rebuild of the original Flask + MySQL app as a **MERN stack**
(MongoDB, Express, React, Node.js) project, with the same features:
login, dashboard, product inventory, customers, sales, payments, due
payments, and Excel backup/restore.

## Project structure

```
kazi-electric/
├── backend/     Express API + MongoDB (Mongoose)
└── frontend/    React app (Vite), same Bootstrap-based look as the original
```

## 1. Prerequisites

- Node.js 18+ installed
- MongoDB running locally (or a MongoDB Atlas connection string)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env if your MongoDB URI, port, or JWT secret should differ

npm run seed   # creates a default admin user: admin / admin123
npm run dev    # starts the API on http://localhost:5000
```

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev    # starts React on http://localhost:5173
```

Open http://localhost:5173 and log in with:
- **Username:** admin
- **Password:** admin123

(Change this password, or create new users directly in MongoDB — there's
no user-management UI yet, same as the original app.)

## Notes on the port from Flask/MySQL

- **Auth**: session cookies → replaced with an httpOnly JWT cookie.
  Passwords are now hashed with bcrypt (the original stored plaintext).
- **IDs**: MySQL auto-increment integers → MongoDB ObjectIds. Any code
  referencing `customer.id` now uses `customer._id` / `customer_id`.
- **Backup/Restore**: still exports/imports an `.xlsx` file with the
  same sheet names (Dashboard, Customers, Products, Sales, Payments),
  built with ExcelJS instead of openpyxl. Because IDs are now ObjectIds
  rather than sequential integers, a restore creates fresh documents
  (mapped from the old IDs in the sheet) rather than doing a MySQL-style
  `ON DUPLICATE KEY UPDATE` upsert.
- **Styling**: same Bootstrap 5 + Bootstrap Icons + Inter font as the
  original `base.html`, now loaded via CDN in `frontend/index.html`.

## API overview

| Method | Route                     | Purpose                          |
|--------|---------------------------|-----------------------------------|
| POST   | /api/auth/login            | Log in, sets JWT cookie          |
| POST   | /api/auth/logout           | Clear session                     |
| GET    | /api/auth/me                | Current logged-in user           |
| GET    | /api/dashboard              | Revenue/profit/stock summary     |
| GET/POST/PUT/DELETE | /api/products      | Product CRUD                     |
| GET/POST/PUT/DELETE | /api/customers     | Customer CRUD + totals           |
| GET/POST | /api/sales                | Sales history / record a sale    |
| GET/POST/DELETE | /api/payments       | Payments list / add / delete     |
| GET    | /api/backup/export           | Download full .xlsx backup       |
| POST   | /api/backup/restore          | Upload .xlsx to restore data     |

All routes except `/api/auth/login` require the JWT cookie (i.e. being
logged in).

## Production build

```bash
cd frontend
npm run build       # outputs static files to frontend/dist
```

Serve `frontend/dist` with any static host, and point `VITE_API_URL`
(set at build time, or via a `.env` file in `frontend/`) at your
deployed backend's `/api` URL.
