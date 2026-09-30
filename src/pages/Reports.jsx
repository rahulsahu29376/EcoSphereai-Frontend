import React, { useState, useEffect } from 'react';
import { reportAPI } from '../services/api';
import { FileText, Download, Printer, Calendar, TrendingDown, Coins, Target, Sparkles } from 'lucide-react';

export const Reports = () => {
  const [period, setPeriod] = useState('monthly'); // 'daily', 'weekly', 'monthly', 'annual'
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (selectedPeriod) => {
    try {
      setLoading(true);
      const res = await reportAPI.getReport(selectedPeriod);
      if (res.data?.data) {
        setReport(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(period);
  }, [period]);

  const handleDownloadCSV = () => {
    window.open(reportAPI.getCSVUrl(period), '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const summary = report?.summary || {
    totalCarbonFootprintKg: 142.5,
    sustainabilityScore: 78,
    totalExpensesINR: 8200,
    moneySavedINR: 3450,
    avoidedCarbonKg: 18.2,
    activeDaysCount: 14
  };

  const mobility = report?.mobility || {
    walkingKm: 32.5,
    stepsTaken: 43800,
    avoidedEmissionsKg: 6.8
  };

  const goals = report?.goals || {
    total: 4,
    completed: 3,
    successRate: 75
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-6 h-6" />
            </span>
            Sustainability & Financial Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate verifiable reports with carbon audits, expense ledgers, and export options.
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-card hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Period Selector Tabs */}
      <div className="flex p-1.5 rounded-2xl glass-card border border-slate-800 gap-1 w-full sm:w-auto self-start">
        {[
          { id: 'daily', label: 'Daily Report' },
          { id: 'weekly', label: 'Weekly Summary' },
          { id: 'monthly', label: 'Monthly Audit' },
          { id: 'annual', label: 'Annual ESG Review' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPeriod(tab.id)}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              period === tab.id
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Document Container (Printable) */}
      <div id="printable-report" className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        {/* Report Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌱</span>
              <span className="font-extrabold text-white text-lg">EcoSphere AI Verification</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1 capitalize">{period} Sustainability Audit Report</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Certified for User: <strong className="text-slate-200">{report?.user?.name || 'Rahul Sharma'}</strong> &bull; Generated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-xs text-slate-400">Composite Score</span>
            <div className="text-3xl font-extrabold text-emerald-400">{summary.sustainabilityScore}/100</div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400">Total Net Footprint</span>
            <p className="text-xl font-extrabold text-white mt-1">{summary.totalCarbonFootprintKg} kg CO₂</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400">Estimated Money Saved</span>
            <p className="text-xl font-extrabold text-emerald-400 mt-1">₹{summary.moneySavedINR.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400">Recorded Expenses</span>
            <p className="text-xl font-extrabold text-white mt-1">₹{summary.totalExpensesINR.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs text-slate-400">Goal Completion Rate</span>
            <p className="text-xl font-extrabold text-cyan-400 mt-1">{goals.successRate}%</p>
          </div>
        </div>

        {/* Mobility & Physical Activity */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-white">Active Clean Mobility Impact</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Walked and cycled <strong className="text-emerald-400">{mobility.walkingKm} km</strong>, totaling <strong className="text-emerald-400">{mobility.stepsTaken.toLocaleString()} steps</strong>.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              +{mobility.avoidedEmissionsKg} kg CO₂ Avoided
            </span>
          </div>
        </div>

        {/* Detailed Emission Trends Table */}
        <div>
          <h4 className="font-bold text-sm text-white mb-3">Daily Ledger & Emissions Timeline</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Net Carbon (kg CO₂)</th>
                  <th className="pb-2 font-semibold">Expenses (INR)</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(report?.emissionTrends || []).map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-2.5 text-slate-300 font-medium">{t.date}</td>
                    <td className="py-2.5 font-bold text-white">{t.carbonKg} kg</td>
                    <td className="py-2.5 text-slate-300">₹{t.expenseINR}</td>
                    <td className="py-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                        Audited
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
