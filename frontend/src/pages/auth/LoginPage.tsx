import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import apiClient from '../../api/client';
import { useAuth } from '../../hooks/useAuth';

// Role → dashboard path mapping.
// Adding a new role only requires one line here.
const ROLE_HOME: Record<string, string> = {
  Manager:  '/manager',
  Designer: '/designer',
  Client:   '/client',
};

export default function LoginPage() {
  const navigate       = useNavigate();
  const location       = useLocation();
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Show a success message when arriving from the activation page
  const justActivated = (location.state as { activated?: boolean } | null)?.activated === true;

  const handleSubmit = async () => {
  setError('');
  setLoading(true);
  try {
    const { data } = await apiClient.post('/auth/token/', { email, password });
    const decoded = login(data.access, data.refresh);
    navigate(ROLE_HOME[decoded.role] ?? '/', { replace: true });
  } catch (err) {
    const e = err as { response?: { data?: { detail?: string } } };
    setError(e.response?.data?.detail ?? 'Invalid email or password.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Design Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account.</p>
        </div>

        {justActivated && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            Account activated — you can now log in.
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </div>
  );
}