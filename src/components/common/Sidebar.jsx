import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Zap,
  Apple,
  Recycle,
  Coins,
  Target,
  Sparkles,
  Trophy,
  FileText,
  BarChart3,
  Bell,
  X,
  PlusCircle
} from 'lucide-react';

const navSections = [
  {
    title: 'Core Hub',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Deep Analytics', path: '/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Sustainability Logs',
    items: [
      { name: 'Travel & Mobility', path: '/activities', icon: Car },
      { name: 'Home Energy', path: '/energy', icon: Zap },
      { name: 'Food & Diet', path: '/food', icon: Apple },
      { name: 'Waste Management', path: '/waste', icon: Recycle },
    ]
  },
  {
    title: 'Smart Features',
    items: [
      { name: 'Money & Savings', path: '/money', icon: Coins, badge: 'Save ₹' },
      { name: 'AI Advisor', path: '/ai-advisor', icon: Sparkles, highlight: true },
      { name: 'Goals & Targets', path: '/goals', icon: Target },
      { name: 'Gamification', path: '/gamification', icon: Trophy },
      { name: 'Reports & Export', path: '/reports', icon: FileText },
      { name: 'Notifications', path: '/notifications', icon: Bell },
    ]
  }
];

export const Sidebar = ({ isOpen, onClose, onOpenQuickLog }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 glass-card border-r border-slate-800/80 bg-[#0B1315]/95 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-white text-base">EcoSphere AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white glass-card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Log Action CTA */}
        <div className="p-4">
          <button
            onClick={() => {
              if (onOpenQuickLog) onOpenQuickLog();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            Quick Log Activity
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <h5 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400/80 mb-2">
                {section.title}
              </h5>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => onClose && onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                        } ${item.highlight ? 'relative overflow-hidden' : ''}`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      )}
                      {item.highlight && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-black shadow-sm">
                          AI
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            EcoSphere v1.0.0 &bull; <span className="text-emerald-400">Online</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">Net Zero &bull; Budget Optimized</p>
        </div>
      </aside>
    </>
  );
};
