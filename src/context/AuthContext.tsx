import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ApiTokens, AuthState } from '@/types';

const STORAGE_KEY = 'devpilot_auth';

const defaultTokens: ApiTokens = {
  github: '',
  cloudflare_token: '',
  cloudflare_account_id: '',
  openai: '',
};

interface AuthContextValue {
  auth: AuthState;
  login: (tokens: ApiTokens, username: string) => void;
  logout: () => void;
  updateTokens: (tokens: Partial<ApiTokens>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch {
    // ignore
  }
  return { isAuthenticated: false, tokens: defaultTokens, username: '' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadFromStorage);

  const persist = useCallback((state: AuthState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setAuth(state);
  }, []);

  const login = useCallback(
    (tokens: ApiTokens, username: string) => {
      persist({ isAuthenticated: true, tokens, username });
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ isAuthenticated: false, tokens: defaultTokens, username: '' });
  }, []);

  const updateTokens = useCallback(
    (partial: Partial<ApiTokens>) => {
      setAuth((prev) => {
        const next: AuthState = {
          ...prev,
          tokens: { ...prev.tokens, ...partial },
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateTokens }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
