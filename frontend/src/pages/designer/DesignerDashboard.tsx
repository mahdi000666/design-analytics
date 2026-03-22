import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const DesignerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Designer Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.full_name}</p>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Log out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/designer/projects"
          className="block border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="font-medium text-gray-900">My Projects</h2>
          <p className="text-sm text-gray-500 mt-1">View your assigned projects</p>
        </Link>
      </div>
    </div>
  );
};

export default DesignerDashboard;