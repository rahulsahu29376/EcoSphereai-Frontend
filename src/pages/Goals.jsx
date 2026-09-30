import React, { useState, useEffect } from 'react';
import { goalAPI } from '../services/api';
import { useSustainability } from '../context/SustainabilityContext';
import { Target, Plus, CheckCircle2, Clock, Trash2, Trophy, Sparkles } from 'lucide-react';

export const Goals = () => {
  const { refreshDashboard, refreshGamification, triggerCelebration } = useSustainability();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [newGoal, setNewGoal] = useState({
    goal_name: 'Walk 50 km this month',
    category: 'transport',
    target: '50',
    unit: 'km',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  });

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await goalAPI.getGoals();
      if (res.data?.data) {
        setGoals(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await goalAPI.createGoal(newGoal);
      setModalOpen(false);
      triggerCelebration();
      refreshDashboard();
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create goal');
    }
  };

  const handleUpdateProgress = async (id, newProgress, target) => {
    try {
      await goalAPI.updateProgress(id, newProgress);
      if (newProgress >= target) {
        triggerCelebration();
      }
      refreshDashboard();
      refreshGamification();
      fetchGoals();
    } catch (err) {
      alert('Failed to update progress');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sustainability goal?')) return;
    try {
      await goalAPI.deleteGoal(id);
      refreshDashboard();
      fetchGoals();
    } catch (err) {
      alert('Failed to delete goal');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Target className="w-6 h-6" />
            </span>
            Sustainability Goals & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Set ambitious environmental targets, track completion milestones, and unlock bonus eco-points!
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Create New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((g) => {
          const isCompleted = g.status === 'completed' || g.completionPercentage >= 100;

          return (
            <div
              key={g.id}
              className={`glass-card p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                isCompleted ? 'border-emerald-500/40 bg-emerald-950/15' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider">
                      {g.category}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-white mt-1.5">{g.goal_name}</h3>
                </div>

                <button
                  onClick={() => handleDelete(g.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar & Values */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Progress</span>
                  <span className="font-bold text-white">
                    {g.progress} / {g.target} {g.unit} ({g.completionPercentage || 0}%)
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-purple-500 to-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, g.completionPercentage || 0)}%` }}
                  />
                </div>
              </div>

              {/* Quick Update Buttons */}
              <div className="mt-5 flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Due: {g.deadline || 'Ongoing'}</span>
                </div>

                {!isCompleted && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleUpdateProgress(g.id, Math.min(g.target, parseFloat(g.progress) + 1), g.target)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold glass-card hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(g.id, Math.min(g.target, parseFloat(g.progress) + 5), g.target)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold glass-card hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(g.id, g.target, g.target)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg text-white">Set a New Sustainability Goal</h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Goal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reduce carbon footprint by 20%"
                  value={newGoal.goal_name}
                  onChange={(e) => setNewGoal({ ...newGoal, goal_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="carbon" className="bg-[#121E20]">Carbon Footprint</option>
                    <option value="transport" className="bg-[#121E20]">Transport & Walking</option>
                    <option value="energy" className="bg-[#121E20]">Home Energy</option>
                    <option value="waste" className="bg-[#121E20]">Waste & Recycling</option>
                    <option value="savings" className="bg-[#121E20]">Financial Savings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Value *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Unit (km, kg, ₹, trips)</label>
                  <input
                    type="text"
                    required
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
