# QuickHire-Backend (Server)

Backend API for **QuickHire**, the job board application. This server provides a RESTful API for **jobs** and **applications** and stores data in **MongoDB**.

This repository contains **only the backend**. The frontend (Next.js app) lives in a separate repository.

---

## Related repository

| Repository | Description |
|------------|-------------|
| **[QuickHire](https://github.com/your-username/QuickHire)** | Frontend (Next.js) – job listings, search, apply form, and admin add/delete. |

---

## What this project does

- **Jobs API** – List all jobs, get one job, create job (admin), delete job (admin).
- **Applications API** – Submit a job application (name, email, resume link, cover note).
- **Database** – MongoDB stores jobs and applications; admin routes are protected by an API key.

The frontend calls these endpoints to show jobs, handle apply forms, and let admins add/delete jobs.

---

## Tech stack

| Area | Stack |
|------|--------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | MongoDB (Mongoose) |

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** (or yarn/pnpm)

---

## Getting started

### 1. Clone this repository

```bash
git clone https://github.com/your-username/QuickHire-backend.git
cd QuickHire-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create `.env` from the example and set at least `MONGODB_URI`:

```bash
cp .env.example .env
```

Edit ` .env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string (e.g. `mongodb://localhost:27017/quickhire` or Atlas SRV) |
| `PORT` | No | Server port (default: `3001`) |
| `CLIENT_ORIGIN` | No | CORS allowed origin (default: `http://localhost:3000`) |
| `ADMIN_API_KEY` | No | Secret for admin routes (default: `quickhire-admin-key`) |

### 4. Run the server

**Development:**

```bash
npm run dev
```

You should see `MongoDB connected` and `Server running at http://localhost:3001`.

**Production:**

```bash
npm run build
npm start
```

### 5. Quick checks

- **Health:** [http://localhost:3001/health](http://localhost:3001/health) → `{"ok":true}`
- **Jobs:** [http://localhost:3001/api/jobs](http://localhost:3001/api/jobs) → `[]` or list of jobs

To use the app in the browser, run the [QuickHire](https://github.com/your-username/QuickHire) frontend and set its `NEXT_PUBLIC_API_URL` to `http://localhost:3001` (and match `ADMIN_API_KEY` in the client’s `NEXT_PUBLIC_ADMIN_API_KEY`).

---

## Server layout

```
server/
├── .env.example       # Example env (MONGODB_URI, PORT, CLIENT_ORIGIN, ADMIN_API_KEY)
├── package.json       # Scripts: dev, build, start
├── tsconfig.json      # TypeScript (outDir: dist)
└── src/
    ├── index.ts       # Express app, CORS, routes, health check
    ├── config/db.ts   # MongoDB connection
    ├── models/
    │   ├── Job.ts     # Job schema (title, company, location, category, etc.)
    │   └── Application.ts  # Application schema (job_id, name, email, resume_link, cover_note)
    ├── middleware/auth.ts  # requireAdmin (X-Admin-Key or Authorization: Bearer)
    └── routes/
        ├── jobs.ts          # GET/POST/DELETE /api/jobs
        └── applications.ts  # POST /api/applications
```

---

## API endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Health check | Public |
| GET | `/api/jobs` | List all jobs | Public |
| GET | `/api/jobs/:id` | Get one job | Public |
| POST | `/api/jobs` | Create job | Admin (`X-Admin-Key` or `Authorization: Bearer`) |
| DELETE | `/api/jobs/:id` | Delete job | Admin (`X-Admin-Key` or `Authorization: Bearer`) |
| POST | `/api/applications` | Submit application | Public |

**Admin routes:** Send the admin API key in header `X-Admin-Key: <key>` or `Authorization: Bearer <key>`.

**Application body:** Supports `job_id` or `jobId`, `resume_link` or `resumeUrl`, `cover_note` or `coverNote`.

---

## Database models

**Job:** `title`, `company`, `location`, `category`, `description`, `jobType`, `tags`, `logo`, `created_at`.

**Application:** `job_id`, `name`, `email`, `resume_link`, `cover_note`, `created_at`. Applications reference a job via `job_id`.

---

## Learn more

- **Frontend and full app setup:** [QuickHire](https://github.com/your-username/QuickHire)
- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
