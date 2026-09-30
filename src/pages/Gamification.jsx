import React, { useEffect } from 'react';
import { useSustainability } from '../context/SustainabilityContext';
import { Trophy, Award, Flame, Zap, ShieldCheck, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export const Gamification = () => {
  const { gamification, refreshGamification } = useSustainability();

  useEffect(() => {
    refreshGamification();
  }, [refreshGamification]);

  const levelInfo = gamification?.levelInfo || {
    currentLevel: 4,
    levelName: 'Carbon Reducer',
    points: 840,
    icon: '⚡',
    progressToNext: 68,
    nextLevelPoints: 1000,
    pointsNeeded: 160
  };

  const badges = gamification?.badges || [
    { id: 'b1', name: 'Eco Starter', icon: '🌱', description: 'First activity logged' },
    { id: 'b2', name: 'Green Hero', icon: '🦸‍♂️', description: 'Saved > 50 kg CO₂' },
    { id: 'b3', name: 'Recycling Master', icon: '♻️', description: 'Recycled over 25 kg waste' },
    { id: 'b4', name: 'Money Saver', icon: '💰', description: 'Saved over ₹3,000 sustainably' }
  ];

  const allAvailableBadges = [
    { id: 'b1', name: 'Eco Starter', icon: '🌱', description: 'First activity logged' },
    { id: 'b2', name: 'Green Hero', icon: '🦸‍♂️', description: 'Reduced > 50 kg CO₂ emissions' },
    { id: 'b3', name: 'Carbon Saver', icon: '📉', description: 'Kept daily carbon under 4 kg for 5 days' },
    { id: 'b4', name: 'Money Saver', icon: '💰', description: 'Saved over ₹3,000 sustainably' },
    { id: 'b5', name: 'Recycling Master', icon: '♻️', description: 'Recycled over 20 kg of waste' },
    { id: 'b6', name: 'Energy Efficient User', icon: '💡', description: 'Utilized over 30% solar or renewable energy' }
  ];

  const achievements = gamification?.achievements || [
    { id: 'a1', title: 'First Activity Logged', completed: true, date: '2026-09-05' },
    { id: 'a2', title: '100 km Walked', completed: false, current: 62.5, target: 100 },
    { id: 'a3', title: '30 Days Recycling', completed: true, date: '2026-09-28' },
    { id: 'a4', title: '10% Carbon Reduction', completed: true, date: '2026-09-20' },
    { id: 'a5', title: '₹5000 Saved', completed: false, current: 3450, target: 5000 }
  ];

  const dailyStreak = gamification?.daily_streak || 6;
  const weeklyStreak = gamification?.weekly_streak || 3;
  const goalStreak = gamification?.goal_streak || 4;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-6 h-6" />
          </span>
          Eco-Gamification & Badges
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Level up from Beginner to Sustainability Champion by recording green commutes, saving money, and completing streaks.
        </p>
      </div>

      {/* Main Level Status Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-surface to-[#0B1315] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/20">
              {levelInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Level {levelInfo.currentLevel}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">Eco Rank</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{levelInfo.levelName}</h2>
              <p className="text-xs text-slate-400 mt-1">
                You have accumulated <strong className="text-amber-400">{levelInfo.points} Eco-Points</strong>
              </p>
            </div>
          </div>

          <div className="md:w-80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Progress to Next Tier</span>
              <span className="font-bold text-amber-300">
                {levelInfo.pointsNeeded > 0 ? `${levelInfo.pointsNeeded} pts needed` : 'Max Tier Reached!'}
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-500"
                style={{ width: `${levelInfo.progressToNext}%` }}
              />
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 -mb-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Streaks Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-orange-500/30 bg-orange-950/20 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-orange-500/20 text-orange-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Daily Logging Streak</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{dailyStreak} Days</h3>
            <p className="text-[11px] text-slate-400">Log daily to keep streak alive</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Weekly Streak</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{weeklyStreak} Weeks</h3>
            <p className="text-[11px] text-slate-400">Maintained carbon targets</p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Goal Streaks</p>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{goalStreak} Completed</h3>
            <p className="text-[11px] text-slate-400">Goals finished on deadline</p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-base text-white">Sustainability Badges</h3>
            <p className="text-xs text-slate-400">Unlocked badges reflect your milestones and green leadership</p>
          </div>
          <span className="text-xs font-semibold text-amber-400">
            {badges.length} / {allAvailableBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {allAvailableBadges.map((badge) => {
            const isUnlocked = badges.some((b) => b.id === badge.id || b.name === badge.name);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center flex flex-col items-center justify-between transition-all ${
                  isUnlocked
                    ? 'glass-card border border-amber-500/30 bg-amber-500/5 hover:scale-105'
                    : 'glass-card border border-slate-800 opacity-40'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="font-bold text-xs text-white mb-1">{badge.name}</h4>
                <p className="text-[10px] text-slate-400 leading-tight">{badge.description}</p>
                <div className="mt-3">
                  {isUnlocked ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Checklist */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white">Milestone Achievements</h3>

        <div className="space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${ach.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  {ach.completed ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${ach.completed ? 'text-white' : 'text-slate-400'}`}>
                    {ach.title}
                  </h4>
                  {ach.target && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Progress: {ach.current} / {ach.target}
                    </p>
                  )}
                </div>
              </div>

              <div>
                {ach.completed ? (
                  <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10">
                    Completed
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">In Progress</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
