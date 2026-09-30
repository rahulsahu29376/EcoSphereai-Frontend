import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, Award, AlertTriangle, Lightbulb, Check } from 'lucide-react';
import { useSustainability } from '../../context/SustainabilityContext';
import { notificationAPI } from '../../services/api';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, refreshNotifications } = useSustainability();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
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
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'money':
        return <Lightbulb className="w-4 h-4 text-emerald-400" />;
      case 'carbon_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'goal':
        return <Clock className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-slate-600 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black ring-2 ring-[#0B1315] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-card border border-slate-700/80 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} New
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No notifications right now. Keep up the green habits!
              </div>
            ) : (
              notifications.slice(0, 6).map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 hover:bg-slate-800/40 transition-colors flex items-start gap-3 ${
                    !n.is_read ? 'bg-emerald-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs font-semibold truncate ${!n.is_read ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          title="Mark read"
                          className="text-slate-500 hover:text-emerald-400 p-0.5 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-800 text-center bg-slate-900/60">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
