# Design System Reference

Extracted from the HTML prototype. Use this file as the cheat-sheet when
building components. All class names assume the tokens in `tailwind.config.ts`
are loaded.

No font imports needed — Georgia, system-ui, and Courier New are all
system fonts. Just set `font-sans` / `font-serif` / `font-mono` on elements.

---

## Color Tokens Quick-Ref

| Token           | Hex       | Use                                  |
|-----------------|-----------|--------------------------------------|
| `bg`            | #F7F5F0   | `<body>` / page background           |
| `surface`       | #FFFFFF   | cards, topbar, modals                |
| `surface2`      | #F0EDE6   | table `<thead>`, muted fills         |
| `border`        | #E2DDD6   | default dividers                     |
| `border-strong` | #C8C2BA   | inputs, prominent borders            |
| `ink`           | #1A1714   | primary text, sidebar bg, dark btns  |
| `ink2`          | #5C5751   | secondary text                       |
| `ink3`          | #9B948D   | muted / labels / placeholders        |
| `amber`         | #D97706   | accent, active sidebar item, links   |
| `amber-light`   | #FEF3C7   | badge fills, AI card background      |
| `amber-dark`    | #92400E   | badge text on amber-light            |
| `teal`          | #0F766E   | success, designer role               |
| `teal-light`    | #CCFBF1   | teal badge fills                     |
| `danger`        | #DC2626   | over-budget, scope creep             |
| `danger-light`  | #FEE2E2   | danger badge fills                   |
| `success`       | #15803D   | completed, on-budget                 |
| `success-light` | #DCFCE7   | success badge fills                  |
| `info`          | #1D4ED8   | deliverable file type badge          |
| `info-light`    | #DBEAFE   | info badge fills                     |

---

## Typography

```tsx
// Brand / page headings (Georgia)
<h1 className="font-serif text-lg font-normal tracking-tight text-ink">

// KPI metric values (Georgia, large)
<span className="font-serif text-[30px] leading-none text-ink">

// Project name on detail page (Georgia, prominent)
<h2 className="font-serif text-[22px] font-normal text-ink">

// Section headings
<h3 className="font-serif text-[17px] font-normal text-ink">

// Body / table cell text
<p className="font-sans text-[13px] text-ink">

// Secondary / description text
<p className="font-sans text-[13px] text-ink2">

// Table column headers
<th className="font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-ink3">

// Muted labels (KPI label, field label)
<span className="font-sans text-[11px] uppercase tracking-[0.6px] text-ink3">

// Numeric data — hours, budgets, EHR
<span className="font-mono text-[13px] text-ink">

// Sidebar section labels
<span className="font-sans text-[10px] uppercase tracking-[1px] text-[#6B6058]">
```

---

## Components

### Button — Primary (dark fill)
```tsx
<button className="px-[14px] py-[6px] rounded bg-ink text-white text-[12px] font-medium
                   border border-ink hover:bg-[#333] transition-colors">
  + New Project
</button>
```

### Button — Secondary (ghost)
```tsx
<button className="px-[14px] py-[6px] rounded bg-transparent text-ink2 text-[12px]
                   border border-border-strong hover:bg-surface2 transition-colors">
  Assign Designer
</button>
```

### Card
```tsx
<div className="bg-surface border border-border rounded-lg p-5">
  {children}
</div>
```

### KPI Card
```tsx
<div className="bg-surface border border-border rounded-lg p-5">
  <div className="text-[11px] uppercase tracking-[0.6px] text-ink3 mb-2">{label}</div>
  <div className="font-serif text-[30px] leading-none text-ink">{value}</div>
  <div className="text-[11px] mt-[6px] text-success">↑ 12% vs last month</div>
</div>
```

### Badge — Status Pills
```tsx
// Active
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-success-light text-success">Active</span>

// On Hold
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-amber-light text-amber-dark">On Hold</span>

// Completed
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-surface2 text-ink3">Completed</span>

// Todo
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-surface2 text-ink3">Todo</span>

// In Progress
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-info-light text-info">In Progress</span>

// Revision (feedback)
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-amber-light text-amber-dark">Revision</span>

// Approval
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-success-light text-success">Approval</span>

// Scope creep (unplanned task)
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-danger-light text-danger">Scope creep</span>

// Deliverable (file type)
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-info-light text-info">deliverable</span>

// Reference (file type)
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-surface2 text-ink3">reference</span>

// Brand guideline (file type)
<span className="inline-block px-2 py-[3px] rounded text-[11px] font-semibold
                 bg-teal-light text-teal-dark">brand_guideline</span>
```

### Role Pills (sidebar)
```tsx
// Manager
<div className="bg-amber text-white text-[11px] font-semibold uppercase tracking-[0.5px]
                text-center rounded-full px-3 py-[6px] mx-4 my-3 cursor-pointer">Manager</div>

// Designer
<div className="bg-teal ...">Designer</div>

// Client  (violet — use arbitrary value)
<div className="bg-[#7C3AED] ...">Client</div>
```

### Progress Bar
```tsx
// Wrapper
<div className="bg-surface2 rounded-full h-[6px] overflow-hidden">
  {/* amber = approaching limit */}
  <div className="h-full rounded-full bg-amber transition-[width]" style={{ width: '72%' }} />
  {/* green = healthy */}
  <div className="h-full rounded-full bg-teal" style={{ width: '45%' }} />
  {/* red = over budget */}
  <div className="h-full rounded-full bg-danger" style={{ width: '95%' }} />
</div>
```

Progress colour rule: `< 80%` → teal, `80–99%` → amber, `≥ 100%` → danger.

### Table
```tsx
<div className="bg-surface border border-border rounded-lg overflow-hidden">
  <table className="w-full border-collapse">
    <thead>
      <tr className="border-b border-border bg-surface2">
        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase
                       tracking-[0.5px] text-ink3">Column</th>
      </tr>
    </thead>
    <tbody className="text-[13px]">
      <tr className="border-b border-border last:border-b-0 hover:bg-bg transition-colors
                     cursor-pointer">
        <td className="px-4 py-[13px] text-ink">Cell</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Tabs
```tsx
// Active tab has amber bottom border
<div className="flex border-b border-border mb-6">
  <button className="px-[18px] py-[10px] text-[13px] font-medium text-ink
                     border-b-2 border-amber -mb-px transition-colors">
    Tasks (14)
  </button>
  <button className="px-[18px] py-[10px] text-[13px] text-ink3
                     border-b-2 border-transparent -mb-px hover:text-ink transition-colors">
    Time Logs (23)
  </button>
</div>
```

### Form Input
```tsx
<input
  className="w-full px-[14px] py-[10px] border border-border-strong rounded
             bg-surface text-[14px] text-ink outline-none
             focus:border-amber transition-colors placeholder:text-ink3"
/>
```

### AI Health Summary Card
```tsx
<div className="mt-4 p-[14px] rounded flex gap-[10px] items-start
                bg-gradient-to-br from-[#FFFBF0] to-amber-light
                border border-[#F6D860]">
  <span className="text-[16px] shrink-0">✦</span>
  <div>
    <div className="text-[11px] font-semibold uppercase tracking-[0.5px]
                    text-amber-dark mb-1">AI Health Summary</div>
    <p className="text-[13px] text-ink2 leading-relaxed">{summary}</p>
  </div>
</div>
```

### Message Bubble
```tsx
// Other person
<div className="bg-surface2 rounded-[0_12px_12px_12px] px-[14px] py-[10px] max-w-[75%]">
  <p className="text-[13px] text-ink leading-snug">{text}</p>
</div>

// Own message
<div className="bg-amber-light rounded-[12px_0_12px_12px] px-[14px] py-[10px]
                max-w-[75%] ml-auto">
  <p className="text-[13px] text-ink leading-snug">{text}</p>
</div>
```

### Timeline Item (activity feed)
```tsx
<div className="flex gap-3 mb-[14px]">
  <div className="flex flex-col items-center">
    <div className="w-[10px] h-[10px] rounded-full bg-amber mt-[3px] shrink-0" />
    <div className="flex-1 w-px bg-border mt-1" />   {/* omit on last item */}
  </div>
  <div className="flex-1 pb-1">
    <div className="text-[13px] font-medium text-ink">{title}</div>
    <div className="text-[11px] text-ink3 mt-[2px]">{meta}</div>
  </div>
</div>
```

Dot colours: time log → amber, feedback → teal, task complete → success, scope creep → danger.

---

## Layout Shell

```tsx
// Shell
<div className="flex h-screen overflow-hidden bg-bg">

  {/* Sidebar — 220px, dark */}
  <nav className="w-[220px] h-screen bg-sidebar flex flex-col shrink-0 overflow-y-auto">
    {/* brand */}
    <div className="p-5 border-b border-white/[0.08]">
      <div className="font-serif text-[17px] text-white">DesignOps</div>
      <div className="text-[11px] uppercase tracking-[0.5px] text-[#9B8E84] mt-[2px]">
        Analytics Platform
      </div>
    </div>

    {/* role pill */}
    {/* nav sections */}

    {/* footer avatar */}
    <div className="mt-auto p-5 border-t border-white/[0.06]">
      {/* avatar row */}
    </div>
  </nav>

  {/* Main */}
  <div className="flex-1 flex flex-col overflow-hidden">

    {/* Topbar — 56px */}
    <header className="h-14 bg-surface border-b border-border flex items-center
                       px-7 gap-4 shrink-0">
      <h2 className="font-serif text-[18px] font-normal text-ink">{title}</h2>
      <span className="text-[12px] text-ink3 ml-2">{breadcrumb}</span>
      <div className="flex-1" />
      {/* action buttons */}
    </header>

    {/* Scrollable content */}
    <main className="flex-1 overflow-y-auto p-7">
      {children}
    </main>

  </div>
</div>
```

---

## Grid Patterns

```tsx
// KPI cards — 4 columns
<div className="grid grid-cols-4 gap-4 mb-6">{kpiCards}</div>

// Two equal columns (charts + activity)
<div className="grid grid-cols-2 gap-4">{cols}</div>

// Three equal columns (designer KPIs)
<div className="grid grid-cols-3 gap-4">{cols}</div>
```

---

## Sidebar Nav Item
```tsx
// Active
<div className="flex items-center gap-[10px] px-5 py-2 text-[13px] font-medium
                text-white border-l-2 border-amber bg-amber/10 cursor-pointer">
  <span className="w-4 text-center text-[14px]">{icon}</span>
  {label}
</div>

// Default
<div className="flex items-center gap-[10px] px-5 py-2 text-[13px] font-medium
                text-[#B8B0A8] border-l-2 border-transparent cursor-pointer
                hover:text-[#F0EDE6] hover:bg-white/[0.04] transition-all">
  <span className="w-4 text-center text-[14px]">{icon}</span>
  {label}
</div>
```
