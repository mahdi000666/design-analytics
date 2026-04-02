Email screenshot change and global use case, GANTT
TABLE Captions above.
Reverify bloat and tech, missing/incomplete. AI-ish. Humanify


FR, NFR, Product backlog, Sprint Planning tables and global use case

1.Monopage in abstr

2.In the middle of writing my report in microsoft word, I noticed that the guide requires table captions to be put on top of the table (i was putting them below). It would be very tedious to manually change each one since i have +50 tables. Is there a way to automate this?

3.I noticed the page number suddently resets in some areas, for example the pages are 16, 17, 18 then reset back to 1. Is this normal? Is there a fix?

4.When I open the microsoft document in my phone, for some reason every chapter title has a heading before it that says "Chapter 1"
for example "Chapter 1 Chapter 5 - Title" This doesn't show on PC, but it does on phone.

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