import React, { useState, useEffect } from 'react';
import { wasteAPI } from '../services/api';
import { useSustainability } from '../context/SustainabilityContext';
import { Recycle, Trash2, Sprout, Check, Award } from 'lucide-react';

export const WasteTracking = () => {
  const { refreshDashboard, refreshGamification, triggerCelebration } = useSustainability();
  const [wasteLogs, setWasteLogs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    plastic_waste: '0.2',
    recycled_waste: '1.2',
    composting: '0.8',
    paper_waste: '0.4',
    electronic_waste: '0',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchLogs = async () => {
    try {
      const res = await wasteAPI.getWasteLogs();
      if (res.data?.data) {
        setWasteLogs(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Live Waste Preview
  const calculateWastePreview = () => {
    const plastic = parseFloat(formData.plastic_waste) || 0;
    const recycled = parseFloat(formData.recycled_waste) || 0;
    const compost = parseFloat(formData.composting) || 0;
    const paper = parseFloat(formData.paper_waste) || 0;
    const ewaste = parseFloat(formData.electronic_waste) || 0;

    const total = plastic + recycled + compost + paper + ewaste;
    const diverted = recycled + compost;
    const score = total > 0 ? Math.min(100, (diverted / total) * 100) : 100;
    const offset = (recycled * 1.2) + (compost * 0.8);

    return {
      score: parseFloat(score.toFixed(1)),
      offset: parseFloat(offset.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  const preview = calculateWastePreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await wasteAPI.logWaste(formData);
      triggerCelebration();
      refreshDashboard();
      refreshGamification();
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log waste');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Recycle className="w-6 h-6" />
          </span>
          Waste Management & Circularity
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Log segregation, recycling, organic composting and electronic waste disposal to maximize your diversion score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Log Waste & Diversion</h3>
            <p className="text-xs text-slate-400">Record diverted materials in kilograms</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Recycled Waste (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.recycled_waste}
                  onChange={(e) => setFormData({ ...formData, recycled_waste: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Composted Scraps (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.composting}
                  onChange={(e) => setFormData({ ...formData, composting: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Plastic Landfill (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.plastic_waste}
                  onChange={(e) => setFormData({ ...formData, plastic_waste: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Paper Waste (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.paper_waste}
                  onChange={(e) => setFormData({ ...formData, paper_waste: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Electronic Waste (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0"
                value={formData.electronic_waste}
                onChange={(e) => setFormData({ ...formData, electronic_waste: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Live Calculation Preview */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Waste Reduction Score:</span>
                <span className="font-bold text-cyan-400 text-sm">{preview.score}% Diverted</span>
              </div>
              {preview.offset > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Carbon Avoided / Offset:</span>
                  <span>+{preview.offset} kg CO₂ Neutralized</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Recording Waste...' : 'Log Waste & Compute Circularity'}
            </button>
          </form>
        </div>

        {/* History (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-white">Waste & Recycling Logs</h3>
                <p className="text-xs text-slate-400">{wasteLogs.length} logs recorded</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Recycled</th>
                    <th className="pb-3 font-semibold">Compost</th>
                    <th className="pb-3 font-semibold">Plastic</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Offset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {wasteLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">
                        No waste records found. Log your recycling today!
                      </td>
                    </tr>
                  ) : (
                    wasteLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 text-slate-300 font-medium">{log.date}</td>
                        <td className="py-3 text-white font-bold">{log.recycled_waste} kg</td>
                        <td className="py-3 text-slate-300">{log.composting} kg</td>
                        <td className="py-3 text-slate-400">{log.plastic_waste} kg</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            {log.waste_reduction_score}%
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-emerald-400">+{log.carbon_offset} kg</td>
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
