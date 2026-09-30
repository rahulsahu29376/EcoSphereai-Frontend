import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { Sparkles, Send, Coins, TrendingDown, Target, Lightbulb, ShieldAlert, Award, Bot } from 'lucide-react';

export const AIAdvisor = () => {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Sustainability & Financial Optimization Advisor. Ask me anything about reducing your carbon footprint, cutting home electricity bills, or optimizing commute expenses in ₹!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoading(true);
        const res = await aiAPI.getAdvice();
        if (res.data?.data) {
          setAdvice(res.data.data);
        }
      } catch (err) {
        console.warn('AI Advisor fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userText = inputMessage;
    setInputMessage('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await aiAPI.chat(userText);
      const reply = res.data?.data?.reply || 'Could not parse response.';
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an issue analyzing that request. Please try again!' }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const summary = advice?.summary || {
    totalPotentialMonthlySavingsINR: 3550,
    totalPotentialMonthlyCarbonReductionKg: 68.5,
    overallSustainabilityGrade: 'A - High Potential'
  };

  const suggestions = advice?.personalizedSuggestions || [];
  const weeklyChallenges = advice?.weeklyChallenges || [];
  const monthlyGoals = advice?.monthlyGoals || [];
  const moneyTips = advice?.moneySavingSuggestions || [];
  const forecasts = advice?.forecasts || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="p-2 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-black shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </span>
          AI Sustainability & Financial Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Deep machine learning recommendations analyzing your travel, energy, diet, and spending to save carbon and money.
        </p>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Potential Monthly Savings</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">₹{summary.totalPotentialMonthlySavingsINR.toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-2">Achievable with recommended lifestyle adjustments</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Potential Carbon Drop</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">-{summary.totalPotentialMonthlyCarbonReductionKg} kg CO₂</h2>
          <p className="text-xs text-slate-400 mt-2">Reduction in your net monthly footprint</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Optimization Grade</p>
          <h2 className="text-3xl font-extrabold text-white mt-1">{summary.overallSustainabilityGrade.split(' ')[0]}</h2>
          <p className="text-xs text-slate-400 mt-2">{summary.overallSustainabilityGrade}</p>
        </div>
      </div>

      {/* Personalized AI Suggestions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            High-Impact Personalized Suggestions
          </h3>
          <span className="text-xs text-slate-400">Tailored to your current logs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase tracking-wider">
                    {sug.category}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {sug.impact} Impact
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{sug.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{sug.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold">Save ~₹{sug.savingsINR}/mo</span>
                <span className="text-cyan-400 font-bold">-{sug.carbonSavedKg} kg CO₂</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Challenges & 3-Month Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Challenges */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Active Weekly Eco Challenges
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">+Points</span>
          </div>

          <div className="space-y-3">
            {weeklyChallenges.map((wc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-white">{wc.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{wc.goal}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold mt-1 inline-block">
                    Potential Savings: {wc.estimatedSavings}
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap">
                  +{wc.rewardPoints} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Future Emission Forecasts */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-cyan-400" />
              Future Emission Forecasts (3-Months)
            </h3>
            <span className="text-xs text-slate-400">Trajectory Simulation</span>
          </div>

          <div className="space-y-3">
            {forecasts.map((fc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs text-white">{fc.month}</h4>
                  <span className="text-[11px] text-emerald-400 font-semibold">{fc.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">{fc.projectedEmission} kg CO₂</span>
                  <p className="text-[10px] text-slate-500">Projected footprint</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive AI Chat Assistant */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Ask EcoSphere AI Advisor</h3>
            <p className="text-xs text-slate-400">Inquire about commuting routes, home appliances, diet options, or investment ROI</p>
          </div>
        </div>

        <div className="h-64 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-500 text-black font-medium'
                    : 'glass-card border border-slate-700 text-slate-200 shadow-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="glass-card border border-slate-700 p-3 rounded-2xl text-xs text-slate-400 animate-pulse flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                AI is calculating emissions & savings...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI e.g. How can I save ₹2,000 this month on electricity?"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl glass-card border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={chatLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
