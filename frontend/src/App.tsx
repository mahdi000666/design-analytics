import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AuthProvider from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import ActivatePage from './pages/auth/ActivatePage';

// Temporary stub component — replaced with real pages in Sprint 3+
const Stub = ({ label }: { label: string }) => (
  <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
    <p style={{ color: '#6366f1', fontSize: 12 }}>Stub — Sprint 3</p>
    <h2>{label}</h2>
  </div>
);

// Root redirect — reads the current user's role and sends them to the right dashboard.
// Unauthenticated users are sent to /login.
function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Manager')  return <Navigate to="/manager"  replace />;
  if (user.role === 'Designer') return <Navigate to="/designer" replace />;
  if (user.role === 'Client')   return <Navigate to="/client"   replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    // AuthProvider must wrap BrowserRouter so useNavigate is available inside login()
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes — no token required */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/activate" element={<ActivatePage />} />

          {/* Role-gated dashboards */}
          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <Stub label="Manager Dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/designer/*"
            element={
              <ProtectedRoute allowedRoles={['Designer']}>
                <Stub label="Designer Dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/*"
            element={
              <ProtectedRoute allowedRoles={['Client']}>
                <Stub label="Client Dashboard" />
              </ProtectedRoute>
            }
          />

          {/* / → redirect to the user's own dashboard (or /login if unauthenticated) */}
          <Route path="/" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}