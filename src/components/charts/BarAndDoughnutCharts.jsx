import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const MonthlyComparisonChart = ({ data = [] }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
          <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" stroke="#38bdf8" tick={{ fontSize: 12 }} unit="kg" />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{ fontSize: 12 }} unit="₹" />
          <Tooltip
            contentStyle={{ backgroundColor: '#182729', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar yAxisId="left" dataKey="emissions" name="Emissions (kg CO₂)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="savings" name="Money Saved (₹)" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ActivityDistributionChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No travel logs logged yet.
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} trips`, 'Logged']}
            contentStyle={{ backgroundColor: '#182729', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
