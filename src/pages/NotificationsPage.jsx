import React, { useEffect } from 'react';
import { useSustainability } from '../context/SustainabilityContext';
import { notificationAPI } from '../services/api';
import { Bell, CheckCheck, Award, AlertTriangle, Lightbulb, Clock, Check } from 'lucide-react';

export const NotificationsPage = () => {
  const { notifications, unreadCount, refreshNotifications } = useSustainability();

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      refreshNotifications();
    } catch (err) {
      console.warn(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationAPI.markAllAsRead();
      refreshNotifications();
    } catch (err) {
      console.warn(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'money':
        return <Lightbulb className="w-5 h-5 text-emerald-400" />;
      case 'carbon_alert':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'goal':
        return <Clock className="w-5 h-5 text-cyan-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bell className="w-6 h-6" />
            </span>
            Notification Center & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time reminders for missing daily logs, goal deadline alerts, and newly unlocked eco badges.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-card hover:bg-slate-700 text-xs font-semibold text-emerald-400 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            You're all caught up! No active notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                !n.is_read ? 'bg-emerald-950/20' : 'hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-800 shrink-0">
                  {getIcon(n.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-bold ${!n.is_read ? 'text-white' : 'text-slate-300'}`}>
                      {n.title}
                    </h3>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">{n.message}</p>
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="px-3 py-1.5 rounded-lg glass-card hover:bg-slate-800 text-xs font-medium text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
