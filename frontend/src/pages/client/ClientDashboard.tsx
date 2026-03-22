import { useAuth } from '../../hooks/useAuth';

const ClientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Client Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.full_name}</p>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default ClientDashboard;