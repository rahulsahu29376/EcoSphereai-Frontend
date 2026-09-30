import React, { useState } from 'react';
import { useSustainability } from '../context/SustainabilityContext';
import { useAuth } from '../context/AuthContext';
import { MetricCard } from '../components/common/MetricCard';
import { CarbonTrendChart } from '../components/charts/CarbonTrendChart';
import { ScoreTrendChart } from '../components/charts/ScoreTrendChart';
import { ExpenseBreakdownChart, CarbonSourcesChart } from '../components/charts/PieCharts';
import { MonthlyComparisonChart, ActivityDistributionChart } from '../components/charts/BarAndDoughnutCharts';
import {
  Leaf,
  Coins,
  TrendingDown,
  Target,
  Sparkles,
  ArrowUpRight,
  Flame,
  Award,
  PlusCircle,
  Calendar,
  Zap,
  Car,
  Recycle,
  HelpCircle
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const { user } = useAuth();
  const { dashboardData, gamification, loading } = useSustainability();
  const outletContext = useOutletContext();

  const kpis = dashboardData?.kpis || {
    sustainabilityScore: 78,
    totalCarbonFootprint: 142.5,
    moneySaved: 3450,
    totalExpenses: 8200,
    greenActivities: 18,
    goalsAchieved: 3,
    totalGoals: 4,
    emissionReductionPct: 24,
    monthlyProgressPct: 65,
    carbonOffsetKg: 8.4
  };

  const charts = dashboardData?.charts || {};
  const recentActivities = dashboardData?.recentActivities || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden glass-card border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-surface to-[#0B1315]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Sustainability Engine Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Eco Champion'}</span>!
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your carbon footprint is down <strong className="text-emerald-400 font-semibold">{kpis.emissionReductionPct}%</strong> this cycle.
              You've unlocked <strong className="text-emerald-300 font-semibold">₹{kpis.moneySaved.toLocaleString()}</strong> in sustainable savings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={outletContext?.onOpenQuickLog}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              Quick Log Activity
            </button>
            <Link
              to="/ai-advisor"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl glass-card border border-slate-700 hover:border-slate-500 text-white font-semibold text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              AI Recommendations
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Sustainability Score"
          value={kpis.sustainabilityScore}
          unit="/100"
          subtitle="Grade A Eco Rating"
          trend={12}
          trendLabel="vs last month"
          icon={Leaf}
          color="emerald"
        />

        <MetricCard
          title="Total Carbon Footprint"
          value={kpis.totalCarbonFootprint}
          unit="kg CO₂"
          subtitle={`Avoided ${kpis.carbonOffsetKg} kg via recycling`}
          trend={-kpis.emissionReductionPct}
          trendLabel="net reduced"
          icon={TrendingDown}
          color="cyan"
        />

        <MetricCard
          title="Money Saved Sustainably"
          value={`₹${kpis.moneySaved.toLocaleString()}`}
          subtitle="Transit, Energy & Habits"
          trend={18}
          trendLabel="budget gain"
          icon={Coins}
          color="amber"
        />

        <MetricCard
          title="Eco Goals & Streaks"
          value={`${kpis.goalsAchieved}/${kpis.totalGoals}`}
          unit="Completed"
          subtitle={`${gamification?.daily_streak || 6}-Day Active Streak`}
          icon={Target}
          color="purple"
        />
      </div>

      {/* AI Quick Insight Highlight Card */}
      <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Advisor Alert</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">High Financial ROI</span>
            </div>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Setting your AC to 24°C and switching your upcoming 3 car commutes to Rapid Metro will save ~<span className="text-emerald-400 font-bold">₹1,850/month</span> and prevent <span className="text-emerald-400 font-bold">42 kg CO₂</span>.
            </p>
          </div>
        </div>
        <Link
          to="/ai-advisor"
          className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:text-white glass-card hover:bg-emerald-500/20 border border-emerald-500/30 whitespace-nowrap transition-colors flex items-center gap-1.5"
        >
          View Full Plan <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary Data Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carbon Trend Line Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Carbon Footprint Trend</h3>
              <p className="text-xs text-slate-400">Daily Net vs Transport & Energy (kg CO₂)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 font-medium">
              Last 7 Days
            </span>
          </div>
          <CarbonTrendChart data={charts.carbonTrend || []} />
        </div>

        {/* Sustainability Score Trend Area Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Sustainability Score Trajectory</h3>
              <p className="text-xs text-slate-400">7-Day Composite Score Progression</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              Current: {kpis.sustainabilityScore}/100
            </span>
          </div>
          <ScoreTrendChart data={charts.scoreTrend || []} />
        </div>
      </div>

      {/* Secondary Visualizations (Pie, Doughnut, Bar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white mb-1">Expense Breakdown</h3>
            <p className="text-xs text-slate-400 mb-2">Spending by Category (₹)</p>
          </div>
          <ExpenseBreakdownChart data={charts.expenseBreakdown || []} />
          <div className="text-center pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">Total: </span>
            <span className="text-xs font-bold text-white">₹{kpis.totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        {/* Activity Distribution Doughnut Chart */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white mb-1">Activity Distribution</h3>
            <p className="text-xs text-slate-400 mb-2">Transport Modal Split</p>
          </div>
          <ActivityDistributionChart data={charts.activityDistribution || []} />
          <div className="text-center pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">Clean Commute Share: </span>
            <span className="text-xs font-bold text-emerald-400">72%</span>
          </div>
        </div>

        {/* Carbon Sources Breakdown */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white mb-1">Carbon Sources</h3>
            <p className="text-xs text-slate-400 mb-2">Emissions Share by Sector</p>
          </div>
          <CarbonSourcesChart data={charts.carbonSources || []} />
          <div className="text-center pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400">Net Emissions: </span>
            <span className="text-xs font-bold text-cyan-400">{kpis.totalCarbonFootprint} kg</span>
          </div>
        </div>
      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-white">Monthly Multi-Dimensional Comparison</h3>
            <p className="text-xs text-slate-400">Tracking Carbon Reductions vs Financial Savings (₹)</p>
          </div>
          <Link
            to="/reports"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto"
          >
            Detailed Reports →
          </Link>
        </div>
        <MonthlyComparisonChart data={charts.monthlyComparison || []} />
      </div>

      {/* Recent Activities Feed */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-white">Recent Environmental Activities</h3>
            <p className="text-xs text-slate-400">Your latest logged commutes, meals and energy offsets</p>
          </div>
          <Link
            to="/activities"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            View all logs →
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60">
          {recentActivities.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No recent activities. Use "Quick Log" above to record your first activity!
            </div>
          ) : (
            recentActivities.map((act) => (
              <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                    {act.activity_type === 'walking' && <span className="text-base">🚶</span>}
                    {act.activity_type === 'bike' && <span className="text-base">🚲</span>}
                    {act.activity_type === 'metro' && <span className="text-base">🚇</span>}
                    {act.activity_type === 'bus' && <span className="text-base">🚌</span>}
                    {act.activity_type === 'car' && <span className="text-base">🚗</span>}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white capitalize">
                      {act.activity_type} Commute &bull; {act.distance} km
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {act.notes || `${act.duration || 0} mins &bull; ${act.date}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold block ${act.carbon_emission === 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {act.carbon_emission === 0 ? '0.0 kg CO₂ (Zero Emission)' : `${act.carbon_emission} kg CO₂`}
                  </span>
                  {act.cost > 0 && (
                    <span className="text-[11px] text-slate-400 block">₹{act.cost} spent</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
