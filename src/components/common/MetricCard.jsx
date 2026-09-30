import React from 'react';
import { motion } from 'framer-motion';

export const MetricCard = ({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = 'emerald',
  onClick
}) => {
  const colorStyles = {
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      bgGlow: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-400'
    },
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/50',
      bgGlow: 'bg-cyan-500/10',
      text: 'text-cyan-400',
      iconBg: 'bg-cyan-500/20 text-cyan-400'
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/50',
      bgGlow: 'bg-amber-500/10',
      text: 'text-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-400'
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/50',
      bgGlow: 'bg-purple-500/10',
      text: 'text-purple-400',
      iconBg: 'bg-purple-500/20 text-purple-400'
    },
    rose: {
      border: 'border-rose-500/20 hover:border-rose-500/50',
      bgGlow: 'bg-rose-500/10',
      text: 'text-rose-400',
      iconBg: 'bg-rose-500/20 text-rose-400'
    }
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${style.border} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
            {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${style.iconBg} shadow-inner`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-400">{subtitle}</span>}
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-1 font-semibold ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || ''}
          </span>
        )}
      </div>

      {/* Decorative gradient flare */}
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-2xl ${style.bgGlow} pointer-events-none`} />
    </motion.div>
  );
};
