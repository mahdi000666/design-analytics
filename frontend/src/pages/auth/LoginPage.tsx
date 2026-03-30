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
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Show a success message when arriving from the activation page.
  const justActivated = (location.state as { activated?: boolean } | null)?.activated === true;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/token/', { email, password });
      const decoded  = login(data.access, data.refresh);
      navigate(ROLE_HOME[decoded.role] ?? '/', { replace: true });
    } catch (err) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail ?? 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-sm">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="font-serif text-[30px] text-ink tracking-tight">DesignOps</div>
          <div className="font-sans text-[10px] uppercase tracking-[2px] text-ink3 mt-1">
            Analytics Platform
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-8">
          <div className="mb-6">
            <h1 className="font-serif text-[20px] font-normal text-ink">Sign in</h1>
            <p className="font-sans text-[13px] text-ink3 mt-1">Access your workspace</p>
          </div>

          {justActivated && (
            <div className="mb-5 px-3 py-[10px] rounded bg-success-light border border-success/20 font-sans text-[13px] text-success">
              Account activated — you can now sign in.
            </div>
          )}

          {error && (
            <div className="mb-5 px-3 py-[10px] rounded bg-danger-light border border-danger/20 font-sans text-[13px] text-danger">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-sans text-[11px] uppercase tracking-[0.6px] text-ink3 mb-[6px]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-[14px] py-[10px] border border-border-strong rounded bg-surface font-sans text-[14px] text-ink outline-none focus:border-amber transition-colors placeholder:text-ink3"
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] uppercase tracking-[0.6px] text-ink3 mb-[6px]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full px-[14px] py-[10px] border border-border-strong rounded bg-surface font-sans text-[14px] text-ink outline-none focus:border-amber transition-colors placeholder:text-ink3"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full px-[14px] py-[10px] rounded bg-ink text-white font-sans text-[13px] font-medium border border-ink hover:bg-[#333] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
}