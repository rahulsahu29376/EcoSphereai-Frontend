import React, { useState } from 'react';
import { X, Car, Zap, Apple, Recycle, Coins, Check, Sparkles } from 'lucide-react';
import { activityAPI, energyAPI, foodAPI, wasteAPI, expenseAPI } from '../../services/api';
import { useSustainability } from '../../context/SustainabilityContext';

export const QuickLogModal = ({ isOpen, onClose }) => {
  const { refreshDashboard, refreshGamification, triggerCelebration } = useSustainability();
  const [activeTab, setActiveTab] = useState('travel');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Travel Form
  const [travelData, setTravelData] = useState({
    activity_type: 'metro',
    distance: '10',
    fuel_type: 'petrol',
    duration: '25',
    cost: '30',
    notes: ''
  });

  // Energy Form
  const [energyData, setEnergyData] = useState({
    electricity_units: '6',
    ac_hours: '2',
    fan_hours: '6',
    solar_energy: '2',
    renewable_percentage: '25',
    cost: '50'
  });

  // Food Form
  const [foodData, setFoodData] = useState({
    food_type: 'vegetarian',
    meals_per_day: '3',
    food_spending: '250',
    is_organic: true,
    is_local: true
  });

  // Waste Form
  const [wasteData, setWasteData] = useState({
    plastic_waste: '0.2',
    recycled_waste: '1.0',
    composting: '0.5',
    paper_waste: '0.3',
    electronic_waste: '0'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      if (activeTab === 'travel') {
        await activityAPI.logActivity(travelData);
      } else if (activeTab === 'energy') {
        await energyAPI.logEnergy(energyData);
      } else if (activeTab === 'food') {
        await foodAPI.logFood(foodData);
      } else if (activeTab === 'waste') {
        await wasteAPI.logWaste(wasteData);
      }

      setSuccessMsg('Logged successfully! +Points awarded');
      triggerCelebration();
      refreshDashboard();
      refreshGamification();

      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg glass-card rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-white text-base">Quick Sustainability Log</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white glass-card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/30 p-1.5 gap-1 text-xs font-semibold">
          {[
            { id: 'travel', label: 'Travel', icon: Car },
            { id: 'energy', label: 'Energy', icon: Zap },
            { id: 'food', label: 'Food', icon: Apple },
            { id: 'waste', label: 'Waste', icon: Recycle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {successMsg ? (
            <div className="p-6 text-center text-emerald-400 font-bold flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <p>{successMsg}</p>
            </div>
          ) : (
            <>
              {activeTab === 'travel' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mode of Transport</label>
                    <select
                      value={travelData.activity_type}
                      onChange={(e) => setTravelData({ ...travelData, activity_type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="metro" className="bg-[#121E20]">Metro (Rapid Rail) - Low Carbon</option>
                      <option value="bus" className="bg-[#121E20]">City Bus - Efficient</option>
                      <option value="walking" className="bg-[#121E20]">Walking - Zero Emission</option>
                      <option value="bike" className="bg-[#121E20]">Bicycle / E-Bike</option>
                      <option value="car" className="bg-[#121E20]">Car (Solo Driving)</option>
                      <option value="shared_ride" className="bg-[#121E20]">Shared Cab / Carpool</option>
                      <option value="train" className="bg-[#121E20]">Long Distance Train</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Distance (km)</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={travelData.distance}
                        onChange={(e) => setTravelData({ ...travelData, distance: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Cost (₹)</label>
                      <input
                        type="number"
                        value={travelData.cost}
                        onChange={(e) => setTravelData({ ...travelData, cost: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {travelData.activity_type === 'car' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Fuel Type</label>
                      <select
                        value={travelData.fuel_type}
                        onChange={(e) => setTravelData({ ...travelData, fuel_type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="petrol" className="bg-[#121E20]">Petrol (0.21 kg CO₂/km)</option>
                        <option value="diesel" className="bg-[#121E20]">Diesel (0.19 kg CO₂/km)</option>
                        <option value="electric" className="bg-[#121E20]">Electric Vehicle (0.05 kg CO₂/km)</option>
                        <option value="hybrid" className="bg-[#121E20]">Hybrid (0.12 kg CO₂/km)</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'energy' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Electricity (kWh)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={energyData.electricity_units}
                        onChange={(e) => setEnergyData({ ...energyData, electricity_units: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">AC Usage (Hours)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={energyData.ac_hours}
                        onChange={(e) => setEnergyData({ ...energyData, ac_hours: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Solar Generation (kWh)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={energyData.solar_energy}
                        onChange={(e) => setEnergyData({ ...energyData, solar_energy: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Renewable Share (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={energyData.renewable_percentage}
                        onChange={(e) => setEnergyData({ ...energyData, renewable_percentage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'food' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Diet Type</label>
                    <select
                      value={foodData.food_type}
                      onChange={(e) => setFoodData({ ...foodData, food_type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="vegan" className="bg-[#121E20]">Vegan (1.0 kg CO₂/day - Lowest)</option>
                      <option value="vegetarian" className="bg-[#121E20]">Vegetarian (1.5 kg CO₂/day)</option>
                      <option value="mixed" className="bg-[#121E20]">Mixed Diet (3.2 kg CO₂/day)</option>
                      <option value="meat_heavy" className="bg-[#121E20]">Meat Heavy (5.0 kg CO₂/day)</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={foodData.is_organic}
                        onChange={(e) => setFoodData({ ...foodData, is_organic: e.target.checked })}
                        className="rounded accent-emerald-500"
                      />
                      Organic Certified
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={foodData.is_local}
                        onChange={(e) => setFoodData({ ...foodData, is_local: e.target.checked })}
                        className="rounded accent-emerald-500"
                      />
                      Locally Sourced
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'waste' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Recycled (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={wasteData.recycled_waste}
                      onChange={(e) => setWasteData({ ...wasteData, recycled_waste: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Composted (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={wasteData.composting}
                      onChange={(e) => setWasteData({ ...wasteData, composting: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Plastic Waste (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={wasteData.plastic_waste}
                      onChange={(e) => setWasteData({ ...wasteData, plastic_waste: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Paper Waste (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={wasteData.paper_waste}
                      onChange={(e) => setWasteData({ ...wasteData, paper_waste: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'Recording Carbon Data...' : 'Save & Calculate Carbon Footprint'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
