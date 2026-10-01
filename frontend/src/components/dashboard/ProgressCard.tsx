"use client";

import React from "react";
import { TrendDown, TrendUp, CheckCircle, Flame } from "@phosphor-icons/react";

interface ProgressCardProps {
  painScore?: number;
  romImprovement?: string;
  complianceRate?: number;
  streakDays?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  painScore = 2,
  romImprovement = "+28%",
  complianceRate = 92,
  streakDays = 14,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Metric 1: Pain Score */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 relative overflow-hidden">
        <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-1">Pain Index</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{painScore}</span>
          <span className="text-xs text-slate-400 font-mono">/ 10</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-1">
          <TrendDown size={14} weight="bold" />
          <span>-4.0 vs Baseline</span>
        </div>
      </div>

      {/* Metric 2: ROM */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 relative overflow-hidden">
        <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-1">Flexibility / ROM</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold text-teal-300 font-mono">{romImprovement}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-teal-400 font-mono mt-1">
          <TrendUp size={14} weight="bold" />
          <span>Mobility Gain</span>
        </div>
      </div>

      {/* Metric 3: Compliance */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 relative overflow-hidden">
        <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-1">Weekly Compliance</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold text-cyan-300 font-mono">{complianceRate}%</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono mt-1">
          <CheckCircle size={14} weight="fill" />
          <span>Target Met</span>
        </div>
      </div>

      {/* Metric 4: Streak */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 relative overflow-hidden">
        <span className="text-slate-400 text-xs font-mono uppercase tracking-wider block mb-1">Active Streak</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">{streakDays}</span>
          <span className="text-xs text-slate-400 font-mono">Days</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono mt-1">
          <Flame size={14} weight="fill" />
          <span>Personal Record</span>
        </div>
      </div>
    </div>
  );
};
