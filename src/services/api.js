import axios from 'axios';

// Resolve API URL: if running in browser on a production domain (e.g. vercel.app), NEVER call localhost
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://ecosphereai-backend-3.onrender.com/api';
  }
  return import.meta.env.VITE_API_URL || 'https://ecosphereai-backend-3.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token and runtime safeguard against localhost
api.interceptors.request.use(
  (config) => {
    // Runtime safeguard: if on a remote domain (Vercel, custom domain), prevent localhost calls
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      if (!config.baseURL || config.baseURL.includes('localhost')) {
        config.baseURL = 'https://ecosphereai-backend-3.onrender.com/api';
      }
      if (config.url && config.url.startsWith('http://localhost')) {
        config.url = config.url.replace(/^http:\/\/localhost:\d+\/api/, 'https://ecosphereai-backend-3.onrender.com/api');
      }
    }

    const token = localStorage.getItem('eco_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear token and notify
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('eco_token');
        localStorage.removeItem('eco_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const dashboardAPI = {
  getDashboardData: () => api.get('/dashboard'),
};

export const activityAPI = {
  logActivity: (data) => api.post('/activities', data),
  getActivities: () => api.get('/activities'),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
};

export const energyAPI = {
  logEnergy: (data) => api.post('/energy', data),
  getEnergyLogs: () => api.get('/energy'),
};

export const foodAPI = {
  logFood: (data) => api.post('/food', data),
  getFoodLogs: () => api.get('/food'),
};

export const wasteAPI = {
  logWaste: (data) => api.post('/waste', data),
  getWasteLogs: () => api.get('/waste'),
};

export const goalAPI = {
  createGoal: (data) => api.post('/goals', data),
  getGoals: () => api.get('/goals'),
  updateProgress: (id, progress) => api.patch(`/goals/${id}/progress`, { progress }),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
};

export const expenseAPI = {
  logExpense: (data) => api.post('/expenses', data),
  getExpenses: () => api.get('/expenses'),
  getAnalytics: () => api.get('/expenses/analytics'),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

export const aiAPI = {
  getAdvice: () => api.get('/ai/advice'),
  chat: (message) => api.post('/ai/chat', { message }),
};

export const reportAPI = {
  getReport: (period = 'monthly') => api.get(`/reports?period=${period}`),
  getCSVUrl: (period = 'monthly') => `${API_BASE_URL}/reports/export/csv?period=${period}`,
};

export const gamificationAPI = {
  getStatus: () => api.get('/gamification/status'),
};

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export default api;
