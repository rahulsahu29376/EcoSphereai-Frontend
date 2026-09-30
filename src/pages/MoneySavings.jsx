import React, { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { useSustainability } from '../context/SustainabilityContext';
import { Coins, PiggyBank, ArrowDownRight, TrendingUp, Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const MoneySavings = () => {
  const { refreshDashboard, triggerCelebration } = useSustainability();
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: 'transport',
    amount: '40',
    date: new Date().toISOString().split('T')[0],
    description: 'Metro recharge instead of taxi',
    is_sustainable: true,
    savings_estimate: '160'
  });

  const fetchData = async () => {
    try {
      const [expRes, anaRes] = await Promise.all([
        expenseAPI.getExpenses(),
        expenseAPI.getAnalytics()
      ]);
      if (expRes.data?.data) setExpenses(expRes.data.data);
      if (anaRes.data?.data) setAnalytics(anaRes.data.data);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await expenseAPI.logExpense(formData);
      triggerCelebration();
      refreshDashboard();
      fetchData();
      setFormData({
        category: 'sustainable_purchase',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        is_sustainable: true,
        savings_estimate: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense entry?')) return;
    try {
      await expenseAPI.deleteExpense(id);
      refreshDashboard();
      fetchData();
    } catch (err) {
      alert('Failed to delete expense');
    }
  };

  const totalSaved = analytics?.totalSaved || 3450;
  const totalSpent = analytics?.totalSpent || 8200;
  const monthlyBudget = analytics?.monthlyBudget || 25000;
  const budgetUsedPct = analytics?.budgetUsedPct || 33;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Coins className="w-6 h-6" />
          </span>
          Money-Saving & Sustainable Spending
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track expenses across transportation, electricity, food, and eco-friendly purchases with AI-driven savings forecasts.
        </p>
      </div>

      {/* Analytics KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Total Money Saved</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">₹{totalSaved.toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
            Saved via clean transit & solar habits
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Expenses</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">₹{totalSpent.toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-2">
            Budget: ₹{monthlyBudget.toLocaleString()} ({budgetUsedPct}% utilized)
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Green Investment ROI</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            {totalSpent > 0 ? `${Math.round((totalSaved / totalSpent) * 100)}%` : '42%'}
          </h2>
          <p className="text-xs text-slate-400 mt-2">Savings returned relative to spend</p>
        </div>
      </div>

      {/* AI Money Saving Tips Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: 'Public Transit Smart Pass',
            desc: 'Using public transit for 16 trips/month saves ~₹1,200 compared to ride-hailing cabs.',
            saving: 'Save ₹1,200/mo',
            color: 'emerald'
          },
          {
            title: 'LED Bulbs & Smart Strips',
            desc: 'Switching remaining halogens to LED and cutting standby vampire loads reduces electricity by 15%.',
            saving: 'Save ₹850/mo',
            color: 'amber'
          },
          {
            title: 'Reusable Essentials',
            desc: 'Stainless steel thermo bottles and silicone snack wraps eliminate ~180 single-use items per year.',
            saving: 'Save ₹2,000/yr',
            color: 'cyan'
          }
        ].map((tip, idx) => (
          <div key={idx} className="glass-card p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{tip.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {tip.saving}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Record Expense & Savings</h3>
            <p className="text-xs text-slate-400">Tag sustainable purchases and estimate ROI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Expense Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="transport" className="bg-[#121E20]">Transportation (Fuel, Metro, Bus, Cab)</option>
                <option value="electricity" className="bg-[#121E20]">Electricity & Utilities</option>
                <option value="food" className="bg-[#121E20]">Food & Groceries</option>
                <option value="sustainable_purchase" className="bg-[#121E20]">Sustainable Eco Purchase (Reusable, Solar, etc.)</option>
                <option value="other" className="bg-[#121E20]">Other Expenses</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount Spent (₹) *</label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="e.g. 850"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Savings (₹)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="e.g. 250"
                  value={formData.savings_estimate}
                  onChange={(e) => setFormData({ ...formData, savings_estimate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description / Notes</label>
              <input
                type="text"
                placeholder="e.g. Reusable water bottle, Solar inverter service"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_sustainable}
                  onChange={(e) => setFormData({ ...formData, is_sustainable: e.target.checked })}
                  className="rounded accent-emerald-500"
                />
                Mark as Sustainable Eco-Friendly Purchase
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Recording Expense...' : 'Save Expense & Compute Savings'}
            </button>
          </form>
        </div>

        {/* History (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-white">Expense Records</h3>
                <p className="text-xs text-slate-400">{expenses.length} transactions recorded</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Description</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Savings</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">
                        No expense records found.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 font-medium text-white capitalize">{exp.category.replace('_', ' ')}</td>
                        <td className="py-3 text-slate-300 max-w-[160px] truncate">{exp.description || '-'}</td>
                        <td className="py-3 text-white font-bold">₹{exp.amount}</td>
                        <td className="py-3">
                          {exp.savings_estimate > 0 ? (
                            <span className="text-emerald-400 font-bold">+₹{exp.savings_estimate}</span>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-3 text-slate-400">{exp.date}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
