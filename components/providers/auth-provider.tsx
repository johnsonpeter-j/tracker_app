"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthSuccessResponse, AuthUser } from "@/api/auth.api";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (payload: AuthSuccessResponse) => void;
  clearAuth: () => void;
};

const STORAGE_KEY = "tracker-auth-state";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, user: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthState;
        setState(parsed);
      }
    } catch (error) {
      console.warn("Failed to hydrate auth state:", error);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      if (state.token && state.user) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Failed to persist auth state:", error);
    }
  }, [state, hydrated]);

  const setAuth = useCallback((payload: AuthSuccessResponse) => {
    setState({
      token: payload.token,
      user: payload.user,
    });
  }, []);

  const clearAuth = useCallback(() => {
    setState({ token: null, user: null });
  }, []);

  const value = useMemo(
    () => ({
      token: state.token,
      user: state.user,
      isAuthenticated: Boolean(state.token && state.user),
      setAuth,
      clearAuth,
    }),
    [state.token, state.user, setAuth, clearAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}




