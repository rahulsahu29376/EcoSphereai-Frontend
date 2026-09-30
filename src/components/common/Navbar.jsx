import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSustainability } from '../../context/SustainabilityContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Menu, X, Sparkles, LogOut, User, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { dashboardData, gamification } = useSustainability();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const score = dashboardData?.kpis?.sustainabilityScore || 75;
  const levelInfo = gamification?.levelInfo || { currentLevel: 1, levelName: 'Beginner', icon: '🌱' };
  const points = gamification?.points || 120;

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800/80 bg-[#080E10]/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white glass-card"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  EcoSphere
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wider uppercase">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-1 hidden sm:block">Production Sustainability & Carbon Footprint Engine</p>
            </div>
          </Link>
        </div>

        {/* Right: Gamification Badges, Score, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Sustainability Score Pill */}
          <Link
            to="/analytics"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card border border-emerald-500/30 hover:border-emerald-500/60 transition-all cursor-pointer group"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-400">Score: </span>
              <span className="font-bold text-emerald-400 group-hover:underline">{score}/100</span>
            </div>
          </Link>

          {/* Level Pill */}
          <Link
            to="/gamification"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card border border-amber-500/30 hover:border-amber-500/60 transition-all text-xs"
          >
            <span>{levelInfo.icon}</span>
            <span className="font-semibold text-amber-300">Lvl {levelInfo.currentLevel}</span>
            <span className="text-slate-500 font-medium">({points} pts)</span>
          </Link>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl glass-card hover:border-slate-600 transition-colors"
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'User'}`}
                alt="Avatar"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/50"
              />
              <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[100px] truncate">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl glass-card border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setProfileOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-emerald-400 hover:bg-slate-800/40 transition-colors"
                >
                  <User className="w-4 h-4" /> My Profile & Targets
                </Link>

                <Link
                  to="/gamification"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-300 hover:text-amber-400 hover:bg-slate-800/40 transition-colors"
                >
                  <Sparkles className="w-4 h-4" /> Gamification & Badges
                </Link>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
