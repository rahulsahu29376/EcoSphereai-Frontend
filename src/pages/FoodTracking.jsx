import React, { useState, useEffect } from 'react';
import { foodAPI } from '../services/api';
import { useSustainability } from '../context/SustainabilityContext';
import { Apple, Utensils, Check, Sparkles, Sprout, Heart } from 'lucide-react';

export const FoodTracking = () => {
  const { refreshDashboard, refreshGamification, triggerCelebration } = useSustainability();
  const [foodLogs, setFoodLogs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    food_type: 'vegetarian',
    meals_per_day: '3',
    food_spending: '300',
    is_organic: true,
    is_local: true,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchLogs = async () => {
    try {
      const res = await foodAPI.getFoodLogs();
      if (res.data?.data) {
        setFoodLogs(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Calculate live preview
  const getFoodEmissionPreview = () => {
    const baseDaily = {
      vegan: 1.0,
      vegetarian: 1.5,
      mixed: 3.2,
      meat_heavy: 5.0
    }[formData.food_type] || 1.5;

    let total = (baseDaily / 3) * (parseInt(formData.meals_per_day, 10) || 3);
    if (formData.is_organic) total *= 0.90;
    if (formData.is_local) total *= 0.85;

    // Avoided compared to meat heavy
    const meatBaseline = (5.0 / 3) * (parseInt(formData.meals_per_day, 10) || 3);
    const avoided = Math.max(0, meatBaseline - total);

    return {
      emission: parseFloat(total.toFixed(2)),
      avoided: parseFloat(avoided.toFixed(2))
    };
  };

  const preview = getFoodEmissionPreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await foodAPI.logFood(formData);
      triggerCelebration();
      refreshDashboard();
      refreshGamification();
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log food consumption');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Apple className="w-6 h-6" />
          </span>
          Food Consumption & Diet Habits
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Track plant-forward meals, organic certification, and locally grown foods to shrink agricultural emissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Log Today's Meals</h3>
            <p className="text-xs text-slate-400">Select dietary style and sourcing metrics</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Diet Style</label>
              <select
                value={formData.food_type}
                onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="vegan" className="bg-[#121E20]">Vegan - 1.0 kg CO₂/day (Highest Eco Impact)</option>
                <option value="vegetarian" className="bg-[#121E20]">Vegetarian - 1.5 kg CO₂/day</option>
                <option value="mixed" className="bg-[#121E20]">Mixed Diet (Occasional Meat) - 3.2 kg CO₂/day</option>
                <option value="meat_heavy" className="bg-[#121E20]">Meat Heavy Diet - 5.0 kg CO₂/day</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Meals Tracked</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.meals_per_day}
                  onChange={(e) => setFormData({ ...formData, meals_per_day: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Food Spending (₹)</label>
                <input
                  type="number"
                  value={formData.food_spending}
                  onChange={(e) => setFormData({ ...formData, food_spending: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_organic}
                  onChange={(e) => setFormData({ ...formData, is_organic: e.target.checked })}
                  className="rounded accent-emerald-500"
                />
                Organic Farming (-10% CO₂)
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_local}
                  onChange={(e) => setFormData({ ...formData, is_local: e.target.checked })}
                  className="rounded accent-emerald-500"
                />
                Local Farm Produce (-15% CO₂)
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Notes</label>
              <input
                type="text"
                placeholder="e.g. Lentil curry, tofu stir fry, organic salad"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Live Calculation Preview */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Diet Carbon Footprint:</span>
                <span className="font-bold text-white text-sm">{preview.emission} kg CO₂</span>
              </div>
              {preview.avoided > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Avoided vs Meat Heavy Diet:</span>
                  <span>+{preview.avoided} kg CO₂ Saved</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Recording Food...' : 'Log Meals & Calculate Diet Footprint'}
            </button>
          </form>
        </div>

        {/* History (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-white">Food Habit Records</h3>
                <p className="text-xs text-slate-400">{foodLogs.length} food logs saved</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Diet Type</th>
                    <th className="pb-3 font-semibold">Meals</th>
                    <th className="pb-3 font-semibold">Sourcing</th>
                    <th className="pb-3 font-semibold">Carbon</th>
                    <th className="pb-3 font-semibold">Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {foodLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">
                        No food habit records found.
                      </td>
                    </tr>
                  ) : (
                    foodLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 text-slate-300 font-medium">{log.date}</td>
                        <td className="py-3 capitalize text-white font-bold">{log.food_type.replace('_', ' ')}</td>
                        <td className="py-3 text-slate-300">{log.meals_per_day}</td>
                        <td className="py-3">
                          <div className="flex gap-1">
                            {log.is_organic && <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400">Organic</span>}
                            {log.is_local && <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-400">Local</span>}
                          </div>
                        </td>
                        <td className="py-3 font-semibold text-emerald-400">{log.carbon_emission} kg</td>
                        <td className="py-3 text-slate-300">₹{log.food_spending}</td>
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
