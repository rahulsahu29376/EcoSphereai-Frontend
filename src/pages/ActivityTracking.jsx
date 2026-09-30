import React, { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';
import { useSustainability } from '../context/SustainabilityContext';
import {
  Car,
  Bike,
  Bus,
  Footprints,
  Train,
  Plus,
  Trash2,
  Check,
  TrendingDown,
  Sparkles,
  Navigation
} from 'lucide-react';

export const ActivityTracking = () => {
  const { refreshDashboard, refreshGamification, triggerCelebration } = useSustainability();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('car'); // 'car', 'bike', 'public', 'walking'

  // Form State
  const [formData, setFormData] = useState({
    activity_type: 'car',
    distance: '15',
    fuel_type: 'petrol',
    fuel_consumed: '1.2',
    duration: '30',
    steps: '0',
    cost: '120',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await activityAPI.getActivities();
      if (res.data?.data) {
        setActivities(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Update activity_type when category tab changes
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    let newType = 'car';
    if (cat === 'bike') newType = 'bike';
    if (cat === 'public') newType = 'metro';
    if (cat === 'walking') newType = 'walking';

    setFormData(prev => ({
      ...prev,
      activity_type: newType,
      cost: cat === 'walking' || cat === 'bike' ? '0' : prev.cost
    }));
  };

  // Live Carbon Preview Calculation
  const calculatePreview = () => {
    const dist = parseFloat(formData.distance) || 0;
    const type = formData.activity_type;
    let emission = 0;

    if (type === 'car') {
      const factor = formData.fuel_type === 'diesel' ? 0.19 : formData.fuel_type === 'electric' ? 0.05 : 0.21;
      emission = dist * factor;
    } else if (type === 'bike') {
      emission = formData.fuel_type === 'motorbike' ? dist * 0.09 : 0.0;
    } else if (type === 'bus') {
      emission = dist * 0.10;
    } else if (type === 'metro') {
      emission = dist * 0.05;
    } else if (type === 'train') {
      emission = dist * 0.04;
    } else if (type === 'shared_ride') {
      emission = dist * 0.08;
    } else if (type === 'walking') {
      emission = 0.0;
    }

    const avoided = (dist * 0.21) - emission;
    return {
      emission: parseFloat(emission.toFixed(2)),
      avoided: parseFloat(Math.max(0, avoided).toFixed(2)),
      steps: type === 'walking' ? Math.round(dist * 1350) : 0
    };
  };

  const preview = calculatePreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await activityAPI.logActivity({
        ...formData,
        steps: preview.steps || formData.steps
      });
      triggerCelebration();
      refreshDashboard();
      refreshGamification();
      fetchActivities();
      setFormData({
        activity_type: formData.activity_type,
        distance: '',
        fuel_type: formData.fuel_type,
        fuel_consumed: '',
        duration: '',
        steps: '',
        cost: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log activity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity log?')) return;
    try {
      await activityAPI.deleteActivity(id);
      refreshDashboard();
      fetchActivities();
    } catch (err) {
      alert('Failed to delete activity');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Navigation className="w-6 h-6" />
            </span>
            Activity & Travel Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Log your daily commutes, car trips, public transport and walks to compute live carbon emissions and savings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Logging Form (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white">Log Environmental Activity</h3>
            <p className="text-xs text-slate-400">Select mode and enter travel parameters</p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'car', label: 'Car', icon: Car },
              { id: 'bike', label: 'Bike', icon: Bike },
              { id: 'public', label: 'Transit', icon: Bus },
              { id: 'walking', label: 'Walking', icon: Footprints },
            ].map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-md'
                      : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sub-type picker for public transport */}
            {selectedCategory === 'public' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Public Transit Type</label>
                <select
                  value={formData.activity_type}
                  onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="metro" className="bg-[#121E20]">Metro (Rapid Rail) - 0.05 kg CO₂/km</option>
                  <option value="bus" className="bg-[#121E20]">City Bus - 0.10 kg CO₂/km</option>
                  <option value="train" className="bg-[#121E20]">Train (Intercity) - 0.04 kg CO₂/km</option>
                  <option value="shared_ride" className="bg-[#121E20]">Shared Cab / Carpool - 0.08 kg CO₂/km</option>
                </select>
              </div>
            )}

            {/* Sub-type picker for bike */}
            {selectedCategory === 'bike' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bike Type</label>
                <select
                  value={formData.fuel_type}
                  onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="bicycle" className="bg-[#121E20]">Bicycle (Zero Emission)</option>
                  <option value="electric" className="bg-[#121E20]">E-Bike (0.015 kg CO₂/km)</option>
                  <option value="motorbike" className="bg-[#121E20]">Motorcycle / Scooter (0.09 kg CO₂/km)</option>
                </select>
              </div>
            )}

            {/* Fuel type picker for car */}
            {selectedCategory === 'car' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuel_type}
                    onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="petrol" className="bg-[#121E20]">Petrol (0.21 kg/km)</option>
                    <option value="diesel" className="bg-[#121E20]">Diesel (0.19 kg/km)</option>
                    <option value="electric" className="bg-[#121E20]">Electric EV (0.05 kg/km)</option>
                    <option value="hybrid" className="bg-[#121E20]">Hybrid (0.12 kg/km)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Fuel Consumed (L/kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 1.5"
                    value={formData.fuel_consumed}
                    onChange={(e) => setFormData({ ...formData, fuel_consumed: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Distance & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Distance (km) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 12.5"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Cost & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Trip Cost (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
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
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Destination</label>
              <input
                type="text"
                placeholder="e.g. Commute to Office, Evening Walk"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Live Calculation Preview Badge */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Carbon:</span>
                <span className="font-bold text-white text-sm">{preview.emission} kg CO₂</span>
              </div>
              {preview.avoided > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>Avoided Emissions:</span>
                  <span className="font-bold">+{preview.avoided} kg CO₂ Saved</span>
                </div>
              )}
              {preview.steps > 0 && (
                <div className="flex items-center justify-between text-xs text-cyan-400">
                  <span>Estimated Steps:</span>
                  <span className="font-bold">~{preview.steps.toLocaleString()} Steps</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Recording Activity...' : 'Log Activity & Award Eco-Points'}
            </button>
          </form>
        </div>

        {/* Right Column: Historical Logs Table (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-white">Travel History</h3>
                <p className="text-xs text-slate-400">{activities.length} total activities recorded</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Mode</th>
                    <th className="pb-3 font-semibold">Distance</th>
                    <th className="pb-3 font-semibold">Carbon</th>
                    <th className="pb-3 font-semibold">Cost</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-500">
                        No activity records found. Use the form on the left to log your first trip!
                      </td>
                    </tr>
                  ) : (
                    activities.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 font-medium text-white flex items-center gap-2">
                          <span className="text-sm">
                            {act.activity_type === 'car' ? '🚗' : act.activity_type === 'bike' ? '🚲' : act.activity_type === 'walking' ? '🚶' : '🚌'}
                          </span>
                          <span className="capitalize">{act.activity_type}</span>
                        </td>
                        <td className="py-3 text-slate-300 font-semibold">{act.distance} km</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            act.carbon_emission === 0
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {act.carbon_emission} kg
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">
                          {act.cost > 0 ? `₹${act.cost}` : <span className="text-slate-500">Free</span>}
                        </td>
                        <td className="py-3 text-slate-400">{act.date}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDelete(act.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete"
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
