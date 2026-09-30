import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eco_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('eco_token');
      const storedUser = localStorage.getItem('eco_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Refresh profile in background
          const res = await authAPI.getProfile();
          if (res.data?.data?.user) {
            setUser(res.data.data.user);
            localStorage.setItem('eco_user', JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          console.warn('Failed to validate stored session, keeping local user state if valid', err);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user: userData, token: jwtToken } = res.data.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('eco_token', jwtToken);
    localStorage.setItem('eco_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { user: userData, token: jwtToken } = res.data.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('eco_token', jwtToken);
    localStorage.setItem('eco_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eco_token');
    localStorage.removeItem('eco_user');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedData };
      localStorage.setItem('eco_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout,
        updateUser
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
