# Project Context — Design Project Profitability Analytics System

> This file is the fast-read primer. For full Django model code see DATA_MODEL.md. For workflow patterns see DEVELOPMENT.md.

---

## What This Is

A web-based **project management + BI system** for a graphic design agency. Tracks projects, designer time, client feedback, and generates profitability analytics for managers.

**Academic context:** Final year IT internship project · solo developer · 3 months · 6 sprints  
**Core problem solved:** Agencies lose money due to scope creep and no visibility into actual vs. budgeted hours.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.12, Django 5, Django REST Framework 3.15 |
| Auth | JWT via `djangorestframework-simplejwt` + custom invitation tokens |
| Database | PostgreSQL 16 |
| Frontend | React 18, TypeScript, Vite |
| Data fetching | TanStack React Query |
| HTTP client | Axios |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Email | Django SMTP (Gmail App Password) |
| PDF export | ReportLab |
| Excel export | openpyxl |
| Deployment | Render (Web Service + Static Site + PostgreSQL) |

---

## Folder Structure

```
design-analytics/
├── backend/
│   ├── core/               # settings, urls, wsgi
│   └── apps/
│       ├── users/          # User, Designer, Client, InvitationToken
│       ├── projects/       # Project, ProjectAssignment
│       ├── tasks/          # Task
│       ├── timelog/        # TimeLog
│       ├── feedback/       # Feedback
│       ├── files/          # FileUpload
│       ├── messages/       # Message
│       └── analytics/      # No models — aggregate query views only
└── frontend/src/
    ├── api/                # Axios instance + per-resource typed functions
    ├── components/         # ui/ (Button, Card, Modal…) + feature components
    ├── pages/              # manager/ · designer/ · client/ · auth/
    ├── hooks/              # React Query hooks per resource
    ├── context/            # AuthContext
    ├── types/              # TypeScript interfaces mirroring DB tables
    └── utils/              # date formatting, currency helpers
```

---

## Roles & Permissions

`User.role` stores one of `'Manager' | 'Designer' | 'Client'`. Enforced on every API view and mirrored in the frontend with `<ProtectedRoute>`.

| Capability | Manager | Designer | Client |
|---|:---:|:---:|:---:|
| All BI dashboards & analytics | ✅ | ❌ | ❌ |
| Create / edit / delete projects | ✅ | ❌ | ❌ |
| Assign designers to projects | ✅ | ❌ | ❌ |
| View all projects | ✅ | ❌ | ❌ |
| View assigned projects | ✅ | ✅ | ❌ |
| Log time / update task status | ✅ | ✅ | ❌ |
| Upload deliverables | ✅ | ✅ | ❌ |
| View & resolve client feedback | ✅ | ✅ | ❌ |
| View own projects | ✅ | ❌ | ✅ |
| Submit feedback / revisions | ✅ | ❌ | ✅ |
| Upload reference materials | ✅ | ❌ | ✅ |
| Send messages | ✅ | ✅ | ✅ |
| Generate & export reports | ✅ | ❌ | ❌ |
| Create user accounts | ✅ | ❌ | ❌ |

---

## Data Model (field-level reference)

> Full Django model code with key rules is in DATA_MODEL.md.

**User** — `user_id`, `email` (unique), `password_hash`, `full_name`, `role` ENUM('Manager','Designer','Client'), `is_active` (false until invitation accepted), `created_at`

**Designer** *(1:1 → User)* — `designer_id`, `user_id`, `hourly_rate` decimal, `specialization` varchar(50), `available_hours_per_week` int

**Client** *(1:1 → User)* — `client_id`, `user_id`, `phone` varchar(20), `industry` varchar(100)

**InvitationToken** — `token_id`, `user_id`, `token` varchar(255) unique, `expires_at`, `is_used` bool

**Project** — `project_id`, `client_id` FK→Client, `project_name`, `description`, `budget_hours` decimal, `budget_amount` decimal, `deadline` date, `status` ENUM('Active','Completed','OnHold'), `category` varchar, `created_at`, `updated_at`

**ProjectAssignment** *(Project ↔ Designer M2M)* — `assignment_id`, `project_id`, `designer_id`, `assigned_at`

**Task** — `task_id`, `project_id`, `parent_task_id` FK→self (nullable, for subtasks), `task_name`, `description`, `estimated_hours` decimal, `status` ENUM('Todo','InProgress','Completed'), `is_unplanned` bool (⚠️ `true` = scope creep), `created_at`

**TimeLog** — `log_id`, `task_id`, `designer_id` FK→Designer, `hours_spent` decimal, `description`, `created_at`

**Feedback** — `feedback_id`, `project_id`, `category` ENUM('Revision','Approval','Question'), `content_text` text, `status` ENUM('Pending','InProgress','Resolved'), `submitted_at`, `resolved_at` (nullable)

**Message** — `message_id`, `project_id`, `sender_id` FK→User, `content_text`, `is_read` bool, `created_at`

**FileUpload** — `file_id`, `project_id`, `uploaded_by` FK→User, `file_type` ENUM('Deliverable','Reference','Brand_Guideline'), `file_name`, `file_path`, `file_size` int, `uploaded_at`

> ⚠️ There is **no Revision model**. Revisions are `Feedback` records with `category='Revision'`.

---

## Auth Flow

**Login:**
1. `POST /api/auth/token/` → `{ access, refresh }` JWT pair
2. JWT payload contains `user_id`, `email`, `role`
3. Axios interceptor attaches `Authorization: Bearer <access>` automatically
4. On 401, interceptor calls `/api/auth/token/refresh/` and retries
5. Frontend reads `role` from decoded token → redirects to `/manager`, `/designer`, or `/client`

**Invitation (new users):**
1. Manager creates user in Django Admin → `post_save` signal → UUID token generated → email sent
2. User clicks link → `/activate?token=xxx` → sets password
3. `POST /api/auth/activate/` validates: exists + `is_used=False` + `expires_at > now()`
4. `User.is_active = True`, `token.is_used = True` → redirect to login

---

## API Endpoints

```
# Auth
POST   /api/auth/token/                  Login
POST   /api/auth/token/refresh/
POST   /api/auth/activate/               First-time password setup

# Users
GET    /api/users/me/                    Own profile
PATCH  /api/users/me/

# Projects
GET    /api/projects/                    List (role-filtered automatically)
POST   /api/projects/                    Manager only
GET    /api/projects/{id}/
PATCH  /api/projects/{id}/
DELETE /api/projects/{id}/
GET    /api/projects/{id}/summary/       EHR + budget utilisation snapshot
POST   /api/projects/{id}/assign/        Assign designer (Manager only)

# Tasks
GET    /api/tasks/?project={id}
POST   /api/tasks/                       Manager only
PATCH  /api/tasks/{id}/
DELETE /api/tasks/{id}/

# Time Logs
GET    /api/timelogs/?task={id}
POST   /api/timelogs/                    Designer only
PATCH  /api/timelogs/{id}/              Own logs only
DELETE /api/timelogs/{id}/

# Feedback
GET    /api/feedback/?project={id}
POST   /api/feedback/                    Client only
PATCH  /api/feedback/{id}/              Update status (Manager/Designer)

# Messages
GET    /api/messages/?project={id}
POST   /api/messages/

# Files
GET    /api/files/?project={id}
POST   /api/files/                       multipart/form-data
DELETE /api/files/{id}/

# Analytics — Manager only
GET    /api/analytics/ehr/
GET    /api/analytics/budget-variance/   ?date_from=&date_to=&project=&client=
GET    /api/analytics/profitability/
GET    /api/analytics/designer-utilization/
GET    /api/analytics/scope-creep/
GET    /api/analytics/kpi-summary/       KPI cards data

# Reports — Manager only
GET    /api/reports/export/?format=pdf&project={id}
GET    /api/reports/export/?format=excel&project={id}
```

---

## Frontend Routes

```
/                       Redirect by role
/login                  Public
/activate               Public (requires valid token query param)

/manager/               KPI dashboard
/manager/projects/      All projects
/manager/projects/:id   Project detail (tasks, timelogs, feedback)
/manager/analytics/     BI dashboards + charts
/manager/reports/       Export PDF / Excel

/designer/              Assigned projects overview
/designer/projects/:id  Project detail (time logging, task management)

/client/                Own project status
/client/projects/:id    Project detail (feedback, file upload, messages)
```

---

## BI Metrics

All computed server-side via PostgreSQL aggregations. No stored calculated fields.

| Metric | Formula |
|--------|---------|
| Effective Hourly Rate (EHR) | `budget_amount / SUM(hours_spent)` |
| Budget Utilisation % | `SUM(hours_spent) / budget_hours * 100` |
| Estimation Variance % | `(SUM(actual) - SUM(estimated)) / SUM(estimated) * 100` |
| Scope Creep Index | `COUNT(is_unplanned=True) / COUNT(*) * 100` per project |
| Client Profitability | Ranked by EHR weighted down by revision count |
| Designer Utilisation | `SUM(hours_spent this week) / available_hours_per_week * 100` |
| Revision-to-Approval Ratio | `COUNT(category='Revision') / COUNT(category='Approval')` |

---

## Sprint Plan

6 × 2-week sprints. Update the checkbox as you progress. Estimation in person-days; total: 85.

| Sprint | Weeks | Goal | Days |
|--------|-------|------|------|
| **S1** | 1–2 | Foundation & Auth: scaffold Django + React, all models migrated, JWT login, invitation flow, user management | 16 |
| S2 | 3–4 | Project & Task Management: project/task CRUD, designer assignment, role-scoped views | 19 |
| S3 | 5–6 | Time Tracking & Deliverables: time logging, task status, file uploads, view client feedback | 13 |
| S4 | 7–8 | Client Portal & Feedback: client portal, feedback submission & replies, resolution, messaging | 19 |
| S5 | 9–10 | BI Dashboards: KPI cards, budget vs actual, EHR, client profitability, scope creep | 8 |
| S6 | 11–12 | Reports, Export & Deployment: report generation, PDF/Excel export, tests, Render deploy, README | 10 |

**Per-sprint risks:**
- **S1:** Model mistakes cascade — validate every field against ERD before first migration; test Gmail SMTP on day 1
- **S2:** RBAC queryset filtering must be correct before building client-facing views
- **S3:** File upload storage — plan Cloudinary/S3 early; Render disk is ephemeral
- **S4:** Keep messaging UI simple for MVP; scope creep risk is high for this sprint
- **S5:** Add DB indexes before writing aggregate queries
- **S6:** ReportLab (PDF) is fiddly — prioritise it over Excel

---

## Key Design Decisions

- **No `Revision` model** — revisions are `Feedback` with `category='Revision'`
- **`is_unplanned` on Task** — `True` means scope creep; drives the Scope Creep Index metric
- **Designer and Client are profile tables** — separate from User, 1:1 via `user_id UNIQUE`; all auth goes through User
- **`analytics` app has no models** — only views running aggregate queries across other apps
- **No public signup** — all users created by Manager via Django Admin; invitation email is the only entry point
- **`budget_amount` stores the monetary amount** (e.g. `2000.00` for $2,000)
- **Files stored in `MEDIA_ROOT/projects/{project_id}/`** — on Render, use Cloudinary or S3 since Render's disk is ephemeral
