Email screenshot change.
TABLE Captions above.
Figure insert -> cross refernce

1.Carefully analyse the report.
2.Extract each and every content you deem as redundant, unnecessary, bloated or can potentially be made concise.
3.Identify any usage of Technical Identifiers in Prose and suggest it's plain language alternative.
4.Verify if the Product backlog, Sprint Planning and Context markdown files are consistent with each other. In case no, pick the most realistic one and correct the other.

Generate a markdown document containing every problem and it's fix next to it (to be copy-pasted).
Note: Ignore TOC and Caption issues.
Note: AI- prefixes are added post sprint plan, as per my supervisor's request.

In order to save tokens, you may only generate the document for S3 chapter, instead of rewriting the entire report.

1.Use the exact style of this report:
A4 portrait, Times New Roman body text at 12 pt, justified, 1.5 line spacing, with about 6 pt paragraph spacing before and after.
Main chapter titles must be centered, bold, 16 pt, dark navy blue (#1F3864).
Section headings are left-aligned, bold, 14 pt, medium blue (#2E5496).
Subsections are left-aligned, bold, 12 pt, same blue as sections. Sub-subsections are the same except 11 pt.
Captions for figures and tables are centered, italic, 9 pt, dark navy (#0E2841), written as “Figure X: …” or “Table X: …”.
Tables must have full grid borders, dark blue header rows (#1F3864) with white bold centered text, 10 pt for column, row and body text.
Table rows must follow the following pattern: first row (#000000), second row (#F2F7FB) then repeat.

2.Preserve the textual use case table structure.
3.Keep spacing clean, avoid cramped layouts, and preserve the report’s formal academic look.
4.Keep it concise and avoid technical identifiers in prose.
5.Ignore TOC and Caption issues.

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
            │   ├── feedback.ts
            │   ├── files.ts
            │   ├── projects.ts
            │   ├── tasks.ts
            │   └── timelogs.ts
            ├── components/
            │   ├── AssignDesignerPanel.tsx
            │   ├── FeedbackList.tsx
            │   ├── FileUploadPanel.tsx
            │   ├── ProjectForm.tsx
            │   ├── ProtectedRoute.tsx
            │   ├── TaskForm.tsx
            │   ├── TaskRow.tsx
            │   ├── TimeLogForm.tsx
            │   └── TimeLogList.tsx
            ├── context/
            │   ├── authContext.ts
            │   └── AuthProvider.tsx
            ├── hooks/
            │   ├── useAuth.ts
            │   ├── useFeedback.ts
            │   ├── useFiles.ts
            │   ├── useProjects.ts
            │   ├── useTasks.ts
            │   └── useTimeLogs.ts
            ├── pages/
            │   ├── auth/
            │   │   ├── ActivatePage.tsx
            │   │   └── LoginPage.tsx
            │   ├── client/
            │   │   └── ClientDashboard.tsx
            │   ├── designer/
            │   │   ├── DesignerDashboard.tsx
            │   │   ├── DesignerProjectDetail.tsx
            │   │   └── DesignerProjects.tsx
            │   └── manager/
            │       ├── ManagerDashboard.tsx
            │       ├── ProjectDetail.tsx
            │       └── ProjectList.tsx
            └── types/
                ├── feedback.ts
                ├── file.ts
                ├── project.ts
                ├── task.ts
                └── timelog.ts
```

Its important that you don't accidentally contradict or overwrite already existing files from past sprints. You can always pause and ask me to provide any files you require.