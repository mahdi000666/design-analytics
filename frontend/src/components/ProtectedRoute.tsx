import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

interface Props {
  // Which roles are allowed through. Pass an empty array to allow any authenticated user.
  allowedRoles: string[];
  children: ReactNode;
}

// Wraps any route that requires authentication and/or a specific role.
// - No user at all → redirect to /login (they need to authenticate first)
// - Wrong role → redirect to / (which will re-redirect to their own dashboard)
export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}