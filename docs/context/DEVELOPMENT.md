# Development Guide

> Daily workflow, code conventions, sprint checklists, and troubleshooting.
> Open this alongside your code editor during active development.

---

## Daily Workflow

Work in **vertical slices** — one complete feature per session, database to UI, then commit. Do not do "all models first, then all APIs, then all UI" — you will lose context, have nothing runnable to show, and unrelated things will break each other.

```
Each session:
  1.  git pull
  2.  venv\Scripts\activate
  3.  Pick one backlog ticket
  4.  Model + migration (if needed)
  5.  Serializer
  6.  API view + URL
  7.  Test endpoint (Thunder Client)
  8.  React component / page
  9.  Verify in browser
  10. git add . && git commit -m "feat: <what you built>"
  11. git push
```

---

## Sprint Checklists

Tick items off as you complete them. Each item maps to a user story in the sprint plan.

### Sprint 1 — Foundation & Data Layer (Weeks 1–2)
**Goal:** Working backend skeleton, all models migrated, JWT login endpoint, React app scaffolded.

- [ ] **US-01** Django project scaffolded with PostgreSQL connection verified
- [ ] **US-02** React/TypeScript SPA scaffolded (Vite), routing configured, app loads at :5173
- [ ] **US-03** All models created and migrated:
  - [ ] Custom `User` model with `role` enum and custom `UserManager` (email login)
  - [ ] `Designer` profile model (OneToOne → User)
  - [ ] `Client` profile model (OneToOne → User)
  - [ ] `InvitationToken` model
  - [ ] `Project` model
  - [ ] `ProjectAssignment` model
  - [ ] `Task` model (with `parent_task` self-FK and `is_unplanned`)
  - [ ] `TimeLog` model
  - [ ] `Feedback` model
  - [ ] `Message` model
  - [ ] `FileUpload` model
  - [ ] All migrations run clean — `python manage.py migrate` with no errors
- [ ] **US-04** JWT login endpoint (`POST /api/auth/token/`) returns access + refresh tokens
- [ ] **US-04** Token refresh endpoint (`POST /api/auth/token/refresh/`) works
- [ ] **US-04** Protected test route returns 401 without token, 200 with valid token
- [ ] **US-05** All models registered in Django Admin — Manager can create Designer/Client users via Admin panel

⚠️ **Risk:** Model mistakes cascade. Validate every field name against the ERD in DATA_MODEL.md before running the first migration. Changing models after migrating costs time.

---

### Sprint 2 — Authentication & User Onboarding (Weeks 3–4)
**Goal:** Full onboarding flow — Manager creates account → email sent → user sets password → JWT login → role-based redirect.

- [ ] **US-06** `post_save` signal on `User` auto-generates `InvitationToken` (UUID, 48h expiry)
- [ ] **US-06** Email sent to new user with activation link on account creation
- [ ] **US-07** Activation endpoint (`POST /api/auth/activate/`) validates token: exists + `is_used=False` + not expired
- [ ] **US-07** Activation sets password, `User.is_active = True`, `token.is_used = True`
- [ ] **US-07** React activation page (`/activate?token=xxx`) — password setup form
- [ ] **US-07** Full flow tested: create user in Django Admin → receive email → click link → set password → can log in
- [ ] **US-08** React login page (`/login`) — posts to `/api/auth/token/`, stores tokens
- [ ] **US-08** `AuthContext` stores current user object (decoded from JWT) and exposes `role`
- [ ] **US-08** `ProtectedRoute` component redirects unauthenticated users to `/login`
- [ ] **US-09** Role-based redirect after login: Manager → `/manager`, Designer → `/designer`, Client → `/client`
- [ ] **US-09** Stub dashboard pages for all three roles (can be empty — just need the routes to exist)
- [ ] `IsManager`, `IsDesigner`, `IsClient`, `IsManagerOrDesigner` permission classes created
- [ ] 403 responses verified: access a Manager-only endpoint as Designer/Client → HTTP 403

⚠️ **Risk:** Gmail SMTP setup frequently blocks progress. Test email sending on day 1 of this sprint before writing any other S2 code. If SMTP fails, temporarily use Django's console email backend (`EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'`) to keep moving.

---

### Sprint 3 — Project & Task Management (Weeks 5–6)
**Goal:** Managers can create/edit/delete projects and tasks; designers and clients see their scoped views.

- [ ] **US-10** Project CRUD endpoints (create/edit/delete: Manager only)
- [ ] **US-10** React create project form (Manager) — client, budget hours, budget currency, deadline, description, category
- [ ] **US-11** Designer assignment endpoint (`POST /api/projects/{id}/assign/`)
- [ ] **US-11** React: assign designer UI on project detail page
- [ ] **US-12** Task CRUD endpoints — supports `parent_task` for subtasks, `estimated_hours`
- [ ] **US-12** React task list within project detail page (Manager view)
- [ ] **US-12** React create task form — includes estimated hours and `is_unplanned` toggle
- [ ] **US-13** Edit and delete for projects and tasks (Manager only)
- [ ] **US-14** Project list endpoint filters to assigned projects only for Designer role
- [ ] **US-14** React project list page (Designer view — assigned only)
- [ ] **US-15** Project list endpoint filters to own projects only for Client role
- [ ] **US-15** React project list page (Client view — own only, shows status)
- [ ] Budget progress bar (hours used / budget hours) visible on project detail

⚠️ **Risk:** RBAC queryset filtering must be correct before building client-facing views. Test that a Designer cannot see a project they are not assigned to, and a Client cannot see another client's project, before moving to UI work.

---

### Sprint 4 — Time Tracking & Feedback (Weeks 7–8)
**Goal:** Designers log time per task; clients submit categorised feedback; managers view all data.

- [ ] **US-16** TimeLog CRUD endpoints — Designer logs against a specific task with description
- [ ] **US-16** React time log form (Designer) — select task, enter hours and description
- [ ] **US-17** Task status update endpoint (`PATCH /api/tasks/{id}/`) — Designer/Manager
- [ ] **US-17** React task status toggle (Todo → InProgress → Completed) on task list
- [ ] **US-18** Manager can see all time logs across projects and designers
- [ ] **US-18** React time log list on project detail (Manager view) — shows designer, task, hours, date
- [ ] **US-19** `is_unplanned=True` tasks visually flagged in the UI (badge or colour indicator)
- [ ] **US-19** Manager can mark a task as unplanned when creating or editing it
- [ ] **US-20** Feedback submission endpoint (`POST /api/feedback/`) — Client only
- [ ] **US-20** React feedback form (Client) — category (Revision/Approval/Question), content
- [ ] **US-21** Feedback list endpoint for a project — visible to Manager and Designer
- [ ] **US-21** React feedback list (Manager/Designer) with status update (Pending → InProgress → Resolved)
- [ ] `resolved_at` automatically set in serializer when status transitions to `'Resolved'`

⚠️ **Risk:** Keep the `is_unplanned` UI simple — a checkbox on the task form is enough for MVP. Do not over-engineer it.

---

### Sprint 5 — BI Dashboards & File Uploads (Weeks 9–10)
**Goal:** Core KPI cards, budget vs actual bar chart, EHR, client profitability table, file uploads, and message board operational.

- [ ] **DB indexes added first** — add all indexes from DATA_MODEL.md before writing any analytics queries
- [ ] **US-22** File upload endpoint (`POST /api/files/`) — multipart/form-data, stored in `MEDIA_ROOT`
- [ ] **US-22** React file upload component (Client uploads reference materials; Designer uploads deliverables)
- [ ] **US-22** React file list with download links
- [ ] **US-23** Message list + create endpoints (`GET/POST /api/messages/?project={id}`)
- [ ] **US-23** React project message board — all roles on a project can send and view messages
- [ ] **US-24** Analytics endpoint: budget vs actual hours per project
- [ ] **US-24** React: Budget vs Actual bar chart (Recharts `BarChart`)
- [ ] **US-25** Analytics endpoint: EHR per project (`budget_amount / SUM(hours_spent)`)
- [ ] **US-25** EHR displayed per project on the manager dashboard
- [ ] **US-26** Analytics endpoint: client profitability ranking (revenue, total hours, revision count)
- [ ] **US-26** React: client profitability ranking table
- [ ] **US-27** Analytics endpoint: scope creep index per project
- [ ] **US-27** Scope creep index displayed per project
- [ ] **US-28** Analytics endpoint: KPI summary (total revenue, avg EHR, active project count, pending feedback count)
- [ ] **US-28** React: KPI cards on manager dashboard

⚠️ **Risk:** PostgreSQL aggregate queries across multiple joined tables can be slow without indexes. Add them before testing analytics queries, not after.

---

### Sprint 6 — Charts, Reports, Testing & Deployment (Weeks 11–12)
**Goal:** Full chart suite, PDF/Excel export, API tests passing, deployed and documented.

- [ ] **US-29** React: line chart — cumulative hours over time (Recharts `LineChart`)
- [ ] **US-29** React: pie chart — revenue by client (Recharts `PieChart`)
- [ ] **US-29** React: bar chart for budget vs actual already done in S5 — verify it's polished
- [ ] **US-30** Dashboard filter controls: date range, client selector, project selector
- [ ] **US-30** Analytics endpoints accept `?date_from=&date_to=&client=&project=` query params
- [ ] **US-31** PDF export endpoint (ReportLab) — project profitability summary
- [ ] **US-31** React: Export PDF button triggers file download
- [ ] **US-32** Excel export endpoint (openpyxl) — client profitability + budget data
- [ ] **US-32** React: Export Excel button
- [ ] **US-33** API tests: auth flow, project CRUD, time log, feedback (Django `TestCase`)
- [ ] **US-34** Backend deployed to Render Web Service
- [ ] **US-34** Frontend deployed to Render Static Site
- [ ] **US-34** Both connected to Render PostgreSQL — end-to-end flow verified on live URLs
- [ ] **US-35** README updated with screenshots and setup instructions

⚠️ **Risk:** ReportLab (PDF generation) has a steeper learning curve than openpyxl. Prioritise PDF first — if time runs short, Excel is lower priority (US-32 is marked Low).

---

## Backend Conventions

### App structure
Every app follows the same layout:
```
apps/tasks/
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── permissions.py   # App-specific overrides (if any)
├── filters.py       # django-filter FilterSets
└── admin.py
```

### `core/urls.py` wiring
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/',      include('apps.users.urls')),
    path('api/users/',     include('apps.users.urls_users')),
    path('api/projects/',  include('apps.projects.urls')),
    path('api/tasks/',     include('apps.tasks.urls')),
    path('api/timelogs/',  include('apps.timelog.urls')),
    path('api/feedback/',  include('apps.feedback.urls')),
    path('api/files/',     include('apps.files.urls')),
    path('api/messages/',  include('apps.messages.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/reports/',   include('apps.analytics.report_urls')),
]
```

### Permission classes
```python
# apps/users/permissions.py
from rest_framework.permissions import BasePermission

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Manager'

class IsDesigner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Designer'

class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Client'

class IsManagerOrDesigner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('Manager', 'Designer')
```

### Read/Write serializer pattern
```python
# Read serializer — computed/nested data for list and detail views
class ProjectReadSerializer(serializers.ModelSerializer):
    client_name  = serializers.CharField(source='client.user.full_name', read_only=True)
    actual_hours = serializers.SerializerMethodField()

    def get_actual_hours(self, obj):
        from django.db.models import Sum
        return obj.tasks.aggregate(total=Sum('time_logs__hours_spent'))['total'] or 0

    class Meta:
        model = Project
        fields = '__all__'

# Write serializer — only writable fields on create/update
class ProjectWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['client', 'project_name', 'description', 'budget_hours',
                  'budget_amount', 'deadline', 'status', 'category']
```

### ViewSet pattern
```python
class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return ProjectWriteSerializer
        return ProjectReadSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'Manager':
            return Project.objects.select_related('client__user').all()
        elif user.role == 'Designer':
            return Project.objects.filter(assignments__designer__user=user)
        elif user.role == 'Client':
            return Project.objects.filter(client__user=user)
        return Project.objects.none()

    def get_permissions(self):
        if self.action in ('create', 'destroy'):
            return [IsManager()]
        if self.action in ('update', 'partial_update'):
            return [IsManagerOrDesigner()]
        return [IsAuthenticated()]
```

---

## Frontend Conventions

### Axios client
```typescript
// src/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      const { data } = await apiClient.post('/auth/token/refresh/', { refresh });
      localStorage.setItem('access_token', data.access);
      original.headers.Authorization = `Bearer ${data.access}`;
      return apiClient(original);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### TypeScript types
```typescript
// src/types/project.ts
export interface Project {
  readonly id: number;
  readonly client_name: string;
  readonly actual_hours: number;       // Computed by backend
  readonly created_at: string;
  project_name: string;
  description: string;
  budget_hours: number | null;
  budget_amount: number | null;
  deadline: string | null;             // ISO date string
  status: 'Active' | 'Completed' | 'OnHold';
  category: string;
}

export interface CreateProjectPayload {
  client: number;
  project_name: string;
  description?: string;
  budget_hours?: number;
  budget_amount?: number;
  deadline?: string;
  status?: Project['status'];
  category?: string;
}
```

### TanStack React Query pattern
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, createProject } from '../api/projects';

// Read
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: getProjects,
});

// Write — invalidates the cache on success so the list auto-refreshes
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: createProject,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
});
```

### Route protection
```tsx
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: Props) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};
```

---

## Testing Endpoints

Use **Thunder Client** (VS Code extension — no account needed).

Standard test sequence for every new endpoint:
1. `POST /api/auth/token/` with `{ "email": "...", "password": "..." }` → copy the `access` token
2. Set header `Authorization: Bearer <token>`
3. Test your endpoint — verify status code and response shape
4. Test with wrong role — confirm HTTP 403
5. Test with bad/missing data — confirm HTTP 400 with a useful error message

---

## Common Commands

```bash
# Backend (always run with venv active)
python manage.py makemigrations          # After any model change
python manage.py migrate
python manage.py createsuperuser
python manage.py shell                   # Django-aware Python REPL
python manage.py runserver               # :8000

# Inspect DB directly
psql -U analytics_user -d design_analytics
\dt                                      # List all tables
SELECT * FROM projects_project LIMIT 5;

# Frontend
npm run dev          # :5173
npm run build
npm run lint
```

---

## Git Conventions

Work directly on `main` for solo dev. Branch only for risky experiments:
```bash
git checkout -b experiment/recharts-custom-tooltip
```

Commit format — use conventional commits (looks professional in your submission history):
```
feat: add time log endpoint and designer form
fix: resolve 403 on project list for client role
chore: add openpyxl to requirements.txt
docs: update analytics endpoints in PROJECT_CONTEXT
refactor: extract permission classes to shared module
```

Commit after each working vertical slice, not at the end of the day. Small commits are easy to revert.

---

## Troubleshooting

**CORS error in browser**
Ensure `CORS_ALLOWED_ORIGINS=http://localhost:5173` is in `.env` and `corsheaders.middleware.CorsMiddleware` is the **first** item in `MIDDLEWARE` in `settings.py`.

**HTTP 403 from API**
The user's role doesn't match the permission class. Check in the Django shell:
```python
from apps.users.models import User
u = User.objects.get(email='test@test.com')
print(u.role, u.is_active)
```

**JWT token expired**
Access token expires after 1 hour. The Axios interceptor handles auto-refresh. If it is misbehaving during development, just log out and back in.

**Migration conflict after model edit**
Always run `makemigrations` before `migrate`. If there is a conflict, delete the conflicting migration file and regenerate it. As a last resort: `python manage.py migrate --fake-initial`.

**`ModuleNotFoundError: apps.users`**
Check that `apps/__init__.py` exists (empty file is fine) and `'apps.users'` is in `INSTALLED_APPS`.

**Email not sending in Sprint 2**
Confirm you are using a Gmail **App Password**, not your real Gmail password, and that 2FA is enabled. As a fallback while debugging, add this to `settings.py` to print emails to the terminal instead:
```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```
