import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';

// This page is reached by clicking the invitation email link:
//   /activate?token=<uuid>
// It collects a new password and posts both to the activate endpoint.
// On success it redirects to /login.
export default function ActivatePage() {
  const [searchParams]          = useSearchParams();
  const navigate                = useNavigate();
  const token                   = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/activate/', { token, password });
      navigate('/login', { state: { activated: true } });
    } catch (err) {
      const error = err as { response?: { data?: { token?: string[]; password?: string[]; detail?: string } } };
      const data  = error.response?.data;
      const msg   = data?.token?.[0] ?? data?.password?.[0] ?? data?.detail ?? 'Activation failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="bg-surface border border-border rounded-lg px-8 py-6 max-w-sm w-full text-center">
          <div className="font-serif text-[20px] text-ink mb-2">Invalid link</div>
          <p className="font-sans text-[13px] text-ink3">
            No token found in the URL. Check your invitation email and try again.
          </p>
        </div>
      </div>
    );
  }

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
            <h1 className="font-serif text-[20px] font-normal text-ink">Set your password</h1>
            <p className="font-sans text-[13px] text-ink3 mt-1">Activate your account to continue</p>
          </div>

          {error && (
            <div className="mb-5 px-3 py-[10px] rounded bg-danger-light border border-danger/20 font-sans text-[13px] text-danger">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-sans text-[11px] uppercase tracking-[0.6px] text-ink3 mb-[6px]">
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full px-[14px] py-[10px] border border-border-strong rounded bg-surface font-sans text-[14px] text-ink outline-none focus:border-amber transition-colors placeholder:text-ink3"
              />
            </div>

            <div>
              <label className="block font-sans text-[11px] uppercase tracking-[0.6px] text-ink3 mb-[6px]">
                Confirm password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
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
            {loading ? 'Activating…' : 'Activate account'}
          </button>
        </div>

      </div>
    </div>
  );
}