# QuickHire – Server (Backend)

Backend for **QuickHire**, the job board application. This server exposes a RESTful API for jobs and applications. The client (Next.js app in `/client`) will consume these endpoints instead of using localStorage.

---

## Tech stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Language:** TypeScript (recommended)

---

## Server layout

Project structure at a glance:

```
server/
├── .env.example          # Example env vars (MONGODB_URI, PORT, ADMIN_API_KEY, CLIENT_ORIGIN)
├── .gitignore            # Ignores node_modules, dist, .env
├── README.md             # This file
├── package.json          # Scripts: dev, build, start
├── tsconfig.json         # TypeScript config (outDir: dist)
└── src/
    ├── index.ts          # Express app entry, CORS, route mounting, health check
    ├── config/
    │   └── db.ts         # MongoDB connection (connectDB)
    ├── models/
    │   ├── Job.ts        # Job schema (title, company, location, category, description, jobType, tags, logo)
    │   └── Application.ts # Application schema (job_id, name, email, resume_link, cover_note)
    ├── middleware/
    │   └── auth.ts       # requireAdmin – checks X-Admin-Key or Authorization: Bearer
    └── routes/
        ├── jobs.ts       # GET /api/jobs, GET /api/jobs/:id, POST /api/jobs, DELETE /api/jobs/:id
        └── applications.ts # POST /api/applications
```

| Path | Purpose |
|------|--------|
| `src/index.ts` | Starts server, enables CORS and JSON body, mounts `/api/jobs` and `/api/applications`, serves `/health`. |
| `src/config/db.ts` | Connects to MongoDB using `MONGODB_URI`. |
| `src/models/Job.ts` | Mongoose Job model; API responses include `id`, `companyName`, `created_at`. |
| `src/models/Application.ts` | Mongoose Application model; references Job via `job_id`. |
| `src/middleware/auth.ts` | Protects POST/DELETE job routes with admin API key. |
| `src/routes/jobs.ts` | List, get one, create (admin), delete (admin). |
| `src/routes/applications.ts` | Submit application; accepts `jobId`/`job_id`, `resumeUrl`/`resume_link`, `coverNote`/`cover_note`. |

---

## API requirements

### Backend (Express.js)

You must build a **RESTful API** with the following functionality.

### Required endpoints (examples)

#### Jobs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/jobs` | List all jobs | Public |
| GET | `/api/jobs/:id` | Get single job details | Public |
| POST | `/api/jobs` | Create a job | Admin |
| DELETE | `/api/jobs/:id` | Delete a job | Admin |

#### Applications

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/applications` | Submit job application | Public |

---

## Database (MongoDB)

- Use **MongoDB** for persistence.
- Persist **job listings** and **applications**.
- Use proper **model relationships** (e.g. Job → Applications).

### Example models

#### Job

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier (e.g. from MongoDB `_id`) |
| `title` | string | Job title |
| `company` | string | Company name |
| `location` | string | Job location |
| `category` | string | Category (e.g. Design, Marketing, Technology) |
| `description` | string | Job description |
| `created_at` | Date | Creation timestamp |

Additional fields (to align with client): `job_type`, `tags`, `company_logo` (URL or stored path), etc., as needed.

#### Application

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier |
| `job_id` | string | Reference to Job (`_id` or `id`) |
| `name` | string | Applicant name |
| `email` | string | Applicant email |
| `resume_link` | string | URL to resume (or uploaded file path) |
| `cover_note` | string | Cover letter / note |
| `created_at` | Date | Submission timestamp |

### Relationships

- **Job → Applications:** One job can have many applications. Store `job_id` on each Application document to reference the Job.
- Queries: e.g. “Get all applications for job X” by filtering applications where `job_id === job.id` (or equivalent).

---

## Alignment with client

The client currently uses:

- **Jobs:** List (search/filter), detail page, apply form (name, email, resume URL, cover note).
- **Admin:** Add job (company, job type, title, location, tags, description, company logo), delete job with confirmation.

The server API should support these flows:

1. **GET /api/jobs** – Used by jobs list and home (featured/latest).
2. **GET /api/jobs/:id** – Used by job detail page.
3. **POST /api/jobs** – Used by admin “Add job” form (Admin only).
4. **DELETE /api/jobs/:id** – Used by admin “Delete” action (Admin only).
5. **POST /api/applications** – Used by job detail “Apply” form (body: job_id, name, email, resume_link, cover_note).

---

## API usage

- **Admin routes** (POST `/api/jobs`, DELETE `/api/jobs/:id`): send the admin API key in one of:
  - Header: `X-Admin-Key: <your-admin-key>`
  - Header: `Authorization: Bearer <your-admin-key>`
- **Application body** can use either `job_id` or `jobId`, `resume_link` or `resumeUrl`, `cover_note` or `coverNote` for client compatibility.

---

## Getting started (after implementation)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   - Set `MONGODB_URI` (and optionally `PORT`, `NODE_ENV`).

3. **Run the server**

   ```bash
   npm run dev
   ```

   API base URL (example): `http://localhost:3001` (or your chosen port). Client should call e.g. `http://localhost:3001/api/jobs`.

---

## Summary checklist

- [ ] Express.js REST API with routes for `/api/jobs` and `/api/applications`
- [ ] MongoDB with **Job** and **Application** models as above
- [ ] Relationship: Application has `job_id` → Job
- [ ] Admin protection for POST/DELETE jobs (e.g. API key or auth middleware)
- [ ] CORS enabled for client origin (e.g. `http://localhost:3000`)
