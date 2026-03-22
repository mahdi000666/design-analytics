import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';

const DesignerProjects = () => {
  const { data: projects, isLoading } = useProjects();
  // The backend already filters to assigned-only for the Designer role.

  if (isLoading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Projects</h1>
      {projects?.length === 0 && (
        <p className="text-gray-500">You have not been assigned to any projects yet.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects?.map(p => (
          <Link
            key={p.id}
            to={`/designer/projects/${p.id}`}
            className="block border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-medium text-gray-900">{p.project_name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {p.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{p.client_name}</p>
            {p.deadline && <p className="text-xs text-gray-400 mt-2">Due {p.deadline}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DesignerProjects;