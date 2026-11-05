import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { healthApi } from '../api/healthApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('taskflow_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [serverDetails, setServerDetails] = useState(null);

  // Health check helper
  const checkBackendHealth = useCallback(async () => {
    try {
      const data = await healthApi.checkHealth();
      setServerStatus('online');
      setServerDetails(data);
      return true;
    } catch {
      setServerStatus('offline');
      return false;
    }
  }, []);

  // Check health on mount and every 60 seconds
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 60000);
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  // Listen to network offline / unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    const handleOffline = () => {
      setServerStatus('offline');
    };

    window.addEventListener('taskflow_auth_unauthorized', handleUnauthorized);
    window.addEventListener('taskflow_backend_offline', handleOffline);

    return () => {
      window.removeEventListener('taskflow_auth_unauthorized', handleUnauthorized);
      window.removeEventListener('taskflow_backend_offline', handleOffline);
    };
  }, []);

  // Fetch current user details if token exists
  useEffect(() => {
    let isMounted = true;
    const initAuth = async () => {
      if (token) {
        try {
          const freshUser = await authApi.getMe();
          if (isMounted) {
            setUser(freshUser);
            localStorage.setItem('taskflow_user', JSON.stringify(freshUser));
          }
        } catch {
          // If token verification failed, clear state
          if (isMounted) {
            logout();
          }
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    initAuth();
    return () => { isMounted = false; };
  }, [token]);

  const login = async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem('taskflow_token', data.token);
    const userInfo = { id: data.id, name: data.name, email: data.email };
    localStorage.setItem('taskflow_user', JSON.stringify(userInfo));
    setToken(data.token);
    setUser(userInfo);
    setServerStatus('online');
    return userInfo;
  };

  const register = async (name, email, password) => {
    const data = await authApi.register({ name, email, password });
    localStorage.setItem('taskflow_token', data.token);
    const userInfo = { id: data.id, name: data.name, email: data.email };
    localStorage.setItem('taskflow_user', JSON.stringify(userInfo));
    setToken(data.token);
    setUser(userInfo);
    setServerStatus('online');
    return userInfo;
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isLoading,
        serverStatus,
        serverDetails,
        checkBackendHealth,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};