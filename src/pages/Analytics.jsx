import React from 'react';
import { useSustainability } from '../context/SustainabilityContext';
import { CarbonTrendChart } from '../components/charts/CarbonTrendChart';
import { ScoreTrendChart } from '../components/charts/ScoreTrendChart';
import { ExpenseBreakdownChart, CarbonSourcesChart } from '../components/charts/PieCharts';
import { MonthlyComparisonChart, ActivityDistributionChart } from '../components/charts/BarAndDoughnutCharts';
import { BarChart3, TrendingDown, ArrowUpRight, ShieldCheck, Leaf } from 'lucide-react';

export const Analytics = () => {
  const { dashboardData } = useSustainability();
  const charts = dashboardData?.charts || {};
  const kpis = dashboardData?.kpis || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 className="w-6 h-6" />
          </span>
          Deep Sustainability Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Multi-dimensional carbon trend analysis, financial correlations, and emission source breakdowns.
        </p>
      </div>

      {/* Row 1: Net Carbon & Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Carbon Emission Trend</h3>
              <p className="text-xs text-slate-400">Daily net carbon across transport, energy, and food</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 font-semibold">
              Live Feed
            </span>
          </div>
          <CarbonTrendChart data={charts.carbonTrend || []} />
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Sustainability Score Curve</h3>
              <p className="text-xs text-slate-400">Calculated composite score trajectory</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
              Current: {kpis.sustainabilityScore || 78}/100
            </span>
          </div>
          <ScoreTrendChart data={charts.scoreTrend || []} />
        </div>
      </div>

      {/* Row 2: Pies & Doughnuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-sm text-white mb-1">Carbon Sources</h3>
          <p className="text-xs text-slate-400 mb-3">Relative footprint share</p>
          <CarbonSourcesChart data={charts.carbonSources || []} />
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-sm text-white mb-1">Expense Breakdown</h3>
          <p className="text-xs text-slate-400 mb-3">Spending allocation</p>
          <ExpenseBreakdownChart data={charts.expenseBreakdown || []} />
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <h3 className="font-bold text-sm text-white mb-1">Mobility Modal Share</h3>
          <p className="text-xs text-slate-400 mb-3">Commute distribution</p>
          <ActivityDistributionChart data={charts.activityDistribution || []} />
        </div>
      </div>

      {/* Row 3: Monthly Multi-Dimensional Comparison */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-white">Monthly Historic Emissions vs Financial Savings</h3>
            <p className="text-xs text-slate-400">Correlation between reducing emissions and increasing pocket savings (₹)</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
            Past 4 Months
          </span>
        </div>
        <MonthlyComparisonChart data={charts.monthlyComparison || []} />
      </div>
    </div>
  );
};
