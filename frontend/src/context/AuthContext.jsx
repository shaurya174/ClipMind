import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  forgotPassword,
  getCurrentUser,
  getGithubOAuthUrl,
  getGoogleOAuthUrl,
  loginUser,
  logoutAllDevices,
  logoutUser,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../services/authApi";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../services/tokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [authError, setAuthError] = useState(null);

  const applySession = useCallback((session) => {
    setTokens(session);
    setUser(session.user || null);
  }, []);

  const clearSession = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  // On first load, if a token was persisted from a previous visit, restore
  // the session by asking the backend who it belongs to — never trust a
  // stored token blindly without verifying it's still valid.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = getAccessToken();
      if (!token) {
        setIsBootstrapping(false);
        return;
      }
      try {
        const me = await getCurrentUser();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) clearTokens();
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  // The api.js interceptor dispatches this when a token refresh fails —
  // it can't reach into React state directly, so it hands off via an event.
  useEffect(() => {
    function handleExpired() {
      setUser(null);
    }
    window.addEventListener("clipmind:auth-expired", handleExpired);
    return () => window.removeEventListener("clipmind:auth-expired", handleExpired);
  }, []);

  async function register(payload) {
    setAuthError(null);
    try {
      const session = await registerUser(payload);
      applySession(session);
      return session;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }

  async function login(payload) {
    setAuthError(null);
    try {
      const session = await loginUser(payload);
      applySession(session);
      return session;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  }

  async function logout() {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await logoutUser(refreshToken);
    } catch {
      // Best-effort — the local session is cleared regardless of whether
      // the server-side call succeeded, so the UI never gets stuck logged in.
    }
    clearSession();
  }

  async function logoutAll() {
    try {
      await logoutAllDevices();
    } finally {
      clearSession();
    }
  }

  async function refreshCurrentUser() {
    const me = await getCurrentUser();
    setUser(me);
    return me;
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isBootstrapping,
    authError,
    setAuthError,
    register,
    login,
    logout,
    logoutAll,
    forgotPassword,
    resetPassword,
    verifyEmail,
    refreshCurrentUser,
    googleLoginUrl: getGoogleOAuthUrl(),
    githubLoginUrl: getGithubOAuthUrl(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
