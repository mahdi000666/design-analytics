
Tool for project structure.
Project Name

Use the exact style of this report:
A4 portrait, Times New Roman body text at 12 pt, justified, 1.5 line spacing, with about 6 pt paragraph spacing before and after.
Main chapter titles must be centered, bold, 16 pt, dark navy blue (#1F3864).
Section headings are left-aligned, bold, 14 pt, medium blue (#2E5496).
Subsections are left-aligned, bold, 12 pt, same blue as sections. Sub-subsections are the same except 11 pt.
Captions for figures and tables are centered, italic, 9 pt, dark navy (#0E2841), written as “Figure X: …” or “Table X: …”.
Tables must have full grid borders, dark blue header rows (#1F3864) with white bold centered text, 10 pt for column, row and body text.
Table rows must follow the following pattern: first row (#000000), second row (#F2F7FB) then repeat.
Keep spacing clean, avoid cramped layouts, and preserve the report’s formal academic look.

```
Directory structure:
    ├── backend/
    │   ├── apps/
    │   │   ├── analytics/
    │   │   ├── feedback/
    │   │   ├── files/
    │   │   ├── messages/
    │   │   ├── projects/
    │   │   ├── tasks/
    │   │   ├── timelog/
    │   │   └── users/
    │   │       ├── __init__.py
    │   │       ├── admin.py
    │   │       ├── apps.py
    │   │       ├── models.py
    │   │       ├── permissions.py
    │   │       ├── serializers.py
    │   │       ├── signals.py
    │   │       ├── tests.py
    │   │       ├── urls.py
    │   │       ├── urls_users.py
    │   │       ├── views.py
    │   └── core/
    │       ├── __init__.py
    │       ├── asgi.py
    │       ├── settings.py
    │       ├── urls.py
    │       └── wsgi.py
    └── frontend/
        └── src/
            ├── App.css
            ├── App.tsx
            ├── index.css
            ├── main.tsx
            ├── api/
            │   ├── client.ts
            │   ├── projects.ts
            │   └── tasks.ts
            ├── components/
            │   ├── AssignDesignerPanel.tsx
            │   ├── ProjectForm.tsx
            │   ├── ProtectedRoute.tsx
            │   ├── TaskForm.tsx
            │   └── TaskRow.tsx
            ├── context/
            │   ├── authContext.ts
            │   └── AuthProvider.tsx
            ├── hooks/
            │   ├── useAuth.ts
            │   ├── useProjects.ts
            │   └── useTasks.ts
            ├── pages/
            │   ├── auth/
            │   │   ├── ActivatePage.tsx
            │   │   └── LoginPage.tsx
            │   ├── client/
            │   │   └── ClientDashboard.tsx
            │   ├── designer/
            │   │   ├── DesignerDashboard.tsx
            │   │   └── DesignerProjects.tsx
            │   └── manager/
            │       ├── ManagerDashboard.tsx
            │       ├── ProjectDetail.tsx
            │       └── ProjectList.tsx
            └── types/
                ├── project.ts
                └── task.ts
```


                