import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppShell from '../../components/AppShell';

// KPI cards are shown as placeholders here; Sprint 5 will wire in real data.
const KPI_PLACEHOLDERS = [
  { label: 'Active Projects',  value: '—' },
  { label: 'Total Revenue',    value: '—' },
  { label: 'Avg. EHR',         value: '—' },
  { label: 'Pending Feedback', value: '—' },
];

export default function ManagerDashboard() {
  const { user } = useAuth();

  return (
    <AppShell title="Dashboard">
      {/* Welcome */}
      <div className="mb-7">
        <h3 className="font-serif text-[17px] font-normal text-ink">
          Welcome back, {user?.full_name}
        </h3>
        <p className="font-sans text-[13px] text-ink3 mt-1">
          Here's an overview of your agency today.
        </p>
      </div>

      {/* KPI cards — 4 columns */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {KPI_PLACEHOLDERS.map(kpi => (
          <div key={kpi.label} className="bg-surface border border-border rounded-lg p-5">
            <div className="font-sans text-[11px] uppercase tracking-[0.6px] text-ink3 mb-2">
              {kpi.label}
            </div>
            <div className="font-serif text-[30px] leading-none text-ink">{kpi.value}</div>
            <div className="font-sans text-[11px] mt-[6px] text-ink3">Available in Sprint 5</div>
          </div>
        ))}
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/manager/projects"
          className="bg-surface border border-border rounded-lg p-6 hover:border-amber/60 hover:shadow-sm transition-all group"
        >
          <div className="font-sans text-[14px] text-ink3 mb-2 group-hover:text-amber transition-colors">▣</div>
          <div className="font-serif text-[17px] font-normal text-ink">Projects</div>
          <p className="font-sans text-[13px] text-ink3 mt-1">View and manage all client projects</p>
        </Link>

        <div className="bg-surface border border-border rounded-lg p-6 opacity-40 cursor-not-allowed select-none">
          <div className="font-sans text-[14px] text-ink3 mb-2">∑</div>
          <div className="font-serif text-[17px] font-normal text-ink">Analytics</div>
          <p className="font-sans text-[13px] text-ink3 mt-1">BI dashboards — available in Sprint 5</p>
        </div>
      </div>
    </AppShell>
  );
}