import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import AppShell from '../../components/AppShell';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  Active:    'bg-success-light text-success',
  Completed: 'bg-surface2 text-ink3',
  OnHold:    'bg-amber-light text-amber-dark',
};

const barColor = (pct: number) =>
  pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-amber' : 'bg-teal';

// ─── Component ───────────────────────────────────────────────────────────────

export default function DesignerProjects() {
  // The backend already filters to assigned-only for the Designer role.
  const { data: projects, isLoading } = useProjects();

  return (
    <AppShell title="My Projects">
      {isLoading ? (
        <p className="font-sans text-[13px] text-ink3">Loading…</p>
      ) : projects?.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg px-5 py-10 text-center">
          <p className="font-sans text-[13px] text-ink3">
            You have not been assigned to any projects yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {projects?.map(p => {
            const budgetPct = p.budget_hours
              ? Math.min(100, Math.round((p.actual_hours / Number(p.budget_hours)) * 100))
              : null;

            return (
              <Link
                key={p.id}
                to={`/designer/projects/${p.id}`}
                className="bg-surface border border-border rounded-lg p-5 hover:border-amber/60 hover:shadow-sm transition-all block"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-serif text-[17px] font-normal text-ink leading-snug">
                    {p.project_name}
                  </div>
                  <span className={`inline-block shrink-0 px-2 py-[3px] rounded font-sans text-[11px] font-semibold ${STATUS_BADGE[p.status]}`}>
                    {p.status}
                  </span>
                </div>

                {/* Client */}
                <p className="font-sans text-[13px] text-ink2 mb-3">{p.client_name}</p>

                {/* Budget progress */}
                {budgetPct !== null && (
                  <div className="mb-3">
                    <div className="flex justify-between font-sans text-[11px] text-ink3 mb-[5px]">
                      <span>Budget</span>
                      <span className="font-mono">{p.actual_hours}h / {p.budget_hours}h</span>
                    </div>
                    <div className="bg-surface2 rounded-full h-[4px] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor(budgetPct)}`}
                        style={{ width: `${Math.min(budgetPct, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Deadline */}
                {p.deadline && (
                  <p className="font-sans text-[11px] text-ink3 mt-2">
                    Due <span className="text-ink">{p.deadline}</span>
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}