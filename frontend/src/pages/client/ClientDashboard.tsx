import { useAuth } from '../../hooks/useAuth';
import AppShell from '../../components/AppShell';

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <AppShell title="Dashboard">
      {/* Welcome */}
      <div className="mb-7">
        <h3 className="font-serif text-[17px] font-normal text-ink">
          Welcome back, {user?.full_name}
        </h3>
        <p className="font-sans text-[13px] text-ink3 mt-1">
          Track your projects, send feedback, and upload reference materials.
        </p>
      </div>

      {/* Informational cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-sans text-[11px] uppercase tracking-[0.6px] text-ink3 mb-2">
            Your Projects
          </div>
          <p className="font-sans text-[13px] text-ink2">
            View project status, deadlines, and budget progress in My Projects.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-sans text-[11px] uppercase tracking-[0.6px] text-ink3 mb-2">
            Feedback
          </div>
          <p className="font-sans text-[13px] text-ink2">
            Submit revisions, approvals, and questions directly on each project.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-sans text-[11px] uppercase tracking-[0.6px] text-ink3 mb-2">
            Files
          </div>
          <p className="font-sans text-[13px] text-ink2">
            Upload reference materials and brand guidelines for your design team.
          </p>
        </div>
      </div>
    </AppShell>
  );
}