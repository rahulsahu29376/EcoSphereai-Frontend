import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dashboardAPI, gamificationAPI, notificationAPI } from '../services/api';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

const SustainabilityContext = createContext(null);

export const SustainabilityProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await dashboardAPI.getDashboardData();
      if (res.data?.data) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchGamification = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await gamificationAPI.getStatus();
      if (res.data?.data) {
        setGamification(res.data.data);
      }
    } catch (err) {
      console.warn('Gamification fetch error:', err.message);
    }
  }, [isAuthenticated]);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationAPI.getNotifications();
      if (res.data?.data) {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Notifications fetch error:', err.message);
    }
  }, [isAuthenticated]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      fetchGamification();
      fetchNotifications();
    } else {
      setDashboardData(null);
      setGamification(null);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchDashboardData, fetchGamification, fetchNotifications]);

  return (
    <SustainabilityContext.Provider
      value={{
        dashboardData,
        gamification,
        notifications,
        unreadCount,
        loading,
        refreshDashboard: fetchDashboardData,
        refreshGamification: fetchGamification,
        refreshNotifications: fetchNotifications,
        triggerCelebration
      }}
    >
      {children}
    </SustainabilityContext.Provider>
  );
};

export const useSustainability = () => {
  const context = useContext(SustainabilityContext);
  if (!context) {
    throw new Error('useSustainability must be used within a SustainabilityProvider');
  }
  return context;
};
