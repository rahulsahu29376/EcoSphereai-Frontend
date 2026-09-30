import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SustainabilityProvider } from './context/SustainabilityContext';
import { MainLayout } from './layouts/MainLayout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { ActivityTracking } from './pages/ActivityTracking';
import { EnergyTracking } from './pages/EnergyTracking';
import { FoodTracking } from './pages/FoodTracking';
import { WasteTracking } from './pages/WasteTracking';
import { MoneySavings } from './pages/MoneySavings';
import { Goals } from './pages/Goals';
import { AIAdvisor } from './pages/AIAdvisor';
import { Gamification } from './pages/Gamification';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { NotificationsPage } from './pages/NotificationsPage';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080E10] flex items-center justify-center text-emerald-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading EcoSphere Engine...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SustainabilityProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes inside MainLayout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="activities" element={<ActivityTracking />} />
              <Route path="energy" element={<EnergyTracking />} />
              <Route path="food" element={<FoodTracking />} />
              <Route path="waste" element={<WasteTracking />} />
              <Route path="money" element={<MoneySavings />} />
              <Route path="goals" element={<Goals />} />
              <Route path="ai-advisor" element={<AIAdvisor />} />
              <Route path="gamification" element={<Gamification />} />
              <Route path="reports" element={<Reports />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SustainabilityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
