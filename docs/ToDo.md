Redo Burndown

Redo Timelog (opt problem)

Brief Class diagram paragraph

When I confired the time log, the console shows this:
Uncaught TypeError: total.toFixed is not a function
    TimeLogList TimeLogList.tsx:59
    React 13
TimeLogList.tsx:59:22
    TimeLogList TimeLogList.tsx:59
    React 13

And when I refreshed the page, it showed this:
Uncaught TypeError: total.toFixed is not a function
    TimeLogList TimeLogList.tsx:59
    React 18
    batchCalls notifyManager.ts:73
    notifyFn notifyManager.ts:21
    flush notifyManager.ts:44
    flush notifyManager.ts:43
    batchNotifyFn notifyManager.ts:24
    flush notifyManager.ts:42
    setTimeout handler*systemSetTimeoutZero timeoutManager.ts:134
    flush notifyManager.ts:41
    batch notifyManager.ts:60
    #dispatch query.ts:680
    setData query.ts:234
    fetch query.ts:558
    #executeFetch queryObserver.ts:342
    onSubscribe queryObserver.ts:100
    subscribe subscribable.ts:11
    useBaseQuery useBaseQuery.ts:107
    React 18
TimeLogList.tsx:59:22



In order to save tokens, you may only generate the document for S3 chapter, instead of rewriting the entire report.

Use the exact style of this report:
A4 portrait, Times New Roman body text at 12 pt, justified, 1.5 line spacing, with about 6 pt paragraph spacing before and after.
Main chapter titles must be centered, bold, 16 pt, dark navy blue (#1F3864).
Section headings are left-aligned, bold, 14 pt, medium blue (#2E5496).
Subsections are left-aligned, bold, 12 pt, same blue as sections. Sub-subsections are the same except 11 pt.
Captions for figures and tables are centered, italic, 9 pt, dark navy (#0E2841), written as “Figure X: …” or “Table X: …”.
Tables must have full grid borders, dark blue header rows (#1F3864) with white bold centered text, 10 pt for column, row and body text.
Table rows must follow the following pattern: first row (#000000), second row (#F2F7FB) then repeat.
Keep spacing clean, avoid cramped layouts, and preserve the report’s formal academic look.
Preserve the textual use case table structure.
Ignore TOC and caption issues.

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

Its important that you don't accidentally contradict or overwrite already existing files from past sprints. You can always pause and ask me to provide any files you require.