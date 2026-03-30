import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppShell from '../../components/AppShell';

export default function DesignerDashboard() {
  const { user } = useAuth();

  return (
    <AppShell title="Dashboard">
      {/* Welcome */}
      <div className="mb-7">
        <h3 className="font-serif text-[17px] font-normal text-ink">
          Welcome back, {user?.full_name}
        </h3>
        <p className="font-sans text-[13px] text-ink3 mt-1">
          Here are your active workspaces.
        </p>
      </div>

      {/* Navigation card */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/designer/projects"
          className="bg-surface border border-border rounded-lg p-6 hover:border-amber/60 hover:shadow-sm transition-all group"
        >
          <div className="font-sans text-[14px] text-ink3 mb-2 group-hover:text-amber transition-colors">▣</div>
          <div className="font-serif text-[17px] font-normal text-ink">My Projects</div>
          <p className="font-sans text-[13px] text-ink3 mt-1">View your assigned projects and log time</p>
        </Link>
      </div>
    </AppShell>
  );
}