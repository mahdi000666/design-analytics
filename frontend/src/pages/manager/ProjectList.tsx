import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useProjects, useCreateProject } from '../../hooks/useProjects';
import ProjectForm from '../../components/ProjectForm';
import AppShell from '../../components/AppShell';
import type { ProjectPayload } from '../../types/project';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, string> = {
  Active:    'bg-success-light text-success',
  Completed: 'bg-surface2 text-ink3',
  OnHold:    'bg-amber-light text-amber-dark',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProjectList() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (payload: ProjectPayload) => {
    createProject.mutate(payload, { onSuccess: () => setShowForm(false) });
  };

  return (
    <AppShell
      title="Projects"
      actions={
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-[14px] py-[6px] rounded bg-ink text-white font-sans text-[12px] font-medium border border-ink hover:bg-[#333] transition-colors"
        >
          {showForm ? 'Cancel' : '+ New project'}
        </button>
      }
    >
      {/* Inline create form */}
      {showForm && (
        <div className="bg-surface border border-border rounded-lg p-5 mb-6">
          <h3 className="font-serif text-[17px] font-normal text-ink mb-4">Create project</h3>
          <ProjectForm onSubmit={handleCreate} isLoading={createProject.isPending} />
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <p className="font-sans text-[13px] text-ink3">Loading projects…</p>
      ) : (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface2">
                {['Project', 'Client', 'Status', 'Budget hrs', 'Actual hrs', 'Deadline'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-ink3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center font-sans text-[13px] text-ink3">
                    No projects yet. Create one above.
                  </td>
                </tr>
              )}
              {projects?.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-b-0 hover:bg-bg transition-colors"
                >
                  <td className="px-4 py-[13px]">
                    <Link
                      to={`/manager/projects/${p.id}`}
                      className="font-sans text-[13px] font-medium text-amber hover:underline underline-offset-2"
                    >
                      {p.project_name}
                    </Link>
                  </td>
                  <td className="px-4 py-[13px] font-sans text-[13px] text-ink2">{p.client_name}</td>
                  <td className="px-4 py-[13px]">
                    <span className={`inline-block px-2 py-[3px] rounded font-sans text-[11px] font-semibold ${STATUS_BADGE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-[13px] font-mono text-[13px] text-ink">
                    {p.budget_hours ?? <span className="text-ink3">—</span>}
                  </td>
                  <td className="px-4 py-[13px] font-mono text-[13px] text-ink">{p.actual_hours}</td>
                  <td className="px-4 py-[13px] font-sans text-[13px] text-ink2">
                    {p.deadline ?? <span className="text-ink3">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}