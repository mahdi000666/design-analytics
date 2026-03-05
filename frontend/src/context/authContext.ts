import { createContext } from 'react';

export interface AuthUser {
  user_id: number;
  email: string;
  role: 'Manager' | 'Designer' | 'Client';
}

export interface AuthContextValue {
  user: AuthUser | null;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);