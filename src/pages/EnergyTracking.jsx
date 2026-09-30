import React, { useState, useEffect } from 'react';
import { energyAPI } from '../services/api';
import { useSustainability } from '../context/SustainabilityContext';
import { Zap, Sun, Wind, Check, Flame, AlertCircle } from 'lucide-react';

export const EnergyTracking = () => {
  const { refreshDashboard, refreshGamification, triggerCelebration } = useSustainability();
  const [energyLogs, setEnergyLogs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    electricity_units: '8.5',
    ac_hours: '3.5',
    fan_hours: '8.0',
    solar_energy: '3.0',
    renewable_percentage: '35',
    cost: '75',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchLogs = async () => {
    try {
      const res = await energyAPI.getEnergyLogs();
      if (res.data?.data) {
        setEnergyLogs(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Live Carbon & Savings Preview
  const calculateEnergyPreview = () => {
    const units = parseFloat(formData.electricity_units) || 0;
    const ac = parseFloat(formData.ac_hours) || 0;
    const fan = parseFloat(formData.fan_hours) || 0;
    const solar = parseFloat(formData.solar_energy) || 0;
    const renewablePct = Math.min(100, Math.max(0, parseFloat(formData.renewable_percentage) || 0));

    const effectiveUnits = units > 0 ? units : (ac * 1.5 + fan * 0.075);
    const netGridUnits = Math.max(0, effectiveUnits - solar);
    const emissions = netGridUnits * 0.72 * ((100 - renewablePct) / 100);
    const solarSavingsINR = solar * 8.5; // ~₹8.5 per unit generated

    return {
      emissions: parseFloat(emissions.toFixed(2)),
      solarSavingsINR: Math.round(solarSavingsINR),
      netGridUnits: parseFloat(netGridUnits.toFixed(1))
    };
  };

  const preview = calculateEnergyPreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await energyAPI.logEnergy(formData);
      triggerCelebration();
      refreshDashboard();
      refreshGamification();
      fetchLogs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log energy usage');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-6 h-6" />
          </span>
          Home Energy & Appliance Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor your home grid electricity, AC hours, rooftop solar generation, and clean energy percentage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Log Daily Energy Profile</h3>
            <p className="text-xs text-slate-400">Record appliance hours and renewable offset</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Electricity Units (kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.electricity_units}
                  onChange={(e) => setFormData({ ...formData, electricity_units: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bill Cost (₹)</label>
                <input
                  type="number"
                  step="1"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Air Conditioner (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.ac_hours}
                  onChange={(e) => setFormData({ ...formData, ac_hours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Fans & Lighting (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.fan_hours}
                  onChange={(e) => setFormData({ ...formData, fan_hours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Solar Energy Gen (kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.solar_energy}
                  onChange={(e) => setFormData({ ...formData, solar_energy: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Renewable Energy (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.renewable_percentage}
                  onChange={(e) => setFormData({ ...formData, renewable_percentage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Log Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Live Calculation Preview */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Net Grid Carbon Emission:</span>
                <span className="font-bold text-white text-sm">{preview.emissions} kg CO₂</span>
              </div>
              {preview.solarSavingsINR > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>Solar Energy Bill Savings:</span>
                  <span>+₹{preview.solarSavingsINR} Saved Today</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Recording Energy...' : 'Log Energy & Compute Emissions'}
            </button>
          </form>
        </div>

        {/* History Column (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-white">Energy Usage Records</h3>
                <p className="text-xs text-slate-400">{energyLogs.length} energy logs saved</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Units (kWh)</th>
                    <th className="pb-3 font-semibold">AC Hours</th>
                    <th className="pb-3 font-semibold">Renewable %</th>
                    <th className="pb-3 font-semibold">Carbon</th>
                    <th className="pb-3 font-semibold">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {energyLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">
                        No energy records found. Log your first record on the left!
                      </td>
                    </tr>
                  ) : (
                    energyLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 text-slate-300 font-medium">{log.date}</td>
                        <td className="py-3 text-white font-bold">{log.electricity_units} kWh</td>
                        <td className="py-3 text-slate-300">{log.ac_hours} hrs</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {log.renewable_percentage}% Green
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-amber-300">{log.carbon_emission} kg</td>
                        <td className="py-3 text-slate-300">₹{log.cost}</td>
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
