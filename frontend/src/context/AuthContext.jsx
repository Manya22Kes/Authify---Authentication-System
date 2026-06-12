import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import authService from '../services/authService';
import axiosInstance from '../api/axios';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const accessTokenRef = useRef(null);

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const applySession = useCallback(({ user: userData, accessToken: token }) => {
    accessTokenRef.current = token;
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(Boolean(token && userData));
  }, []);

  const mergeUser = useCallback((updates) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const nextUser = { ...currentUser, ...updates };
      const hasChanged = Object.keys(updates).some(
        (key) => currentUser[key] !== nextUser[key]
      );

      return hasChanged ? nextUser : currentUser;
    });
  }, []);

  // Added for Profile Management
  const updateUser = useCallback((partialUser) => {
    mergeUser(partialUser);
  }, [mergeUser]);

  useEffect(() => {
    axiosInstance.setTokenGetter(() => accessTokenRef.current);

    axiosInstance.onRefreshSuccess((newToken) => {
      accessTokenRef.current = newToken;
      setAccessToken(newToken);
      setIsAuthenticated(true);
    });

    axiosInstance.onRefreshFailure(() => {
      clearSession();
    });
  }, [clearSession]);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session = await authService.refreshSession();
        applySession(session);
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [applySession, clearSession]);

  const login = useCallback(async (email, password) => {
    const session = await authService.login(email, password);
    applySession(session);
    return session;
  }, [applySession]);

  const register = useCallback(async (name, email, password) => {
    const result = await authService.register(name, email, password);
    clearSession();
    return result;
  }, [clearSession]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const refreshSession = useCallback(async () => {
    const session = await authService.refreshSession();
    applySession(session);
    return session;
  }, [applySession]);

  const syncUser = useCallback(async () => {
    const currentUser = await authService.getMe();
    setUser(currentUser);
    setIsAuthenticated(Boolean(accessTokenRef.current && currentUser));
    return currentUser;
  }, []);

  const syncVerificationStatus = useCallback(async () => {
    const verification = await authService.getVerificationStatus();
    mergeUser({ isVerified: verification.isVerified });
    return verification;
  }, [mergeUser]);

  const resendVerification = useCallback(async (emailOverride) => {
    const email = emailOverride || user?.email;

    if (!email) {
      throw new Error('Email address is required to resend verification.');
    }

    return authService.resendVerification(email);
  }, [user?.email]);

  const verifyEmail = useCallback(async (token) => {
    const result = await authService.verifyEmail(token);

    if (result.user) {
      setUser((currentUser) => {
        if (!currentUser || currentUser.id !== result.user.id) {
          return currentUser;
        }

        return {
          ...currentUser,
          ...result.user,
          isVerified: true,
        };
      });
    } else {
      mergeUser({ isVerified: true });
    }

    return result;
  }, [mergeUser]);

  const hasRole = useCallback((role) => user?.role === role, [user]);
  const hasAnyRole = useCallback((...roles) => roles.includes(user?.role), [user]);
  const isAdmin = hasRole('admin');

  const value = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    isAdmin,

    login,
    register,
    logout,

    refreshSession,
    syncUser,

    syncVerificationStatus,
    verifyEmail,
    resendVerification,

    // Added for Profile Management
    updateUser,

    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}