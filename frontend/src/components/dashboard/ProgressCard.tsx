"use client";

import React from "react";

interface ProgressCardProps {
  painScore?: number; // 0 to 10
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
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 backdrop-blur-xl">
        <span className="text-slate-400 text-xs block mb-1">Pain Index</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{painScore}</span>
          <span className="text-xs text-slate-400">/ 10</span>
        </div>
        <span className="text-[11px] text-teal-400 mt-1 block font-medium">↓ -4.0 vs Baseline</span>
      </div>

      {/* Metric 2: ROM */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 backdrop-blur-xl">
        <span className="text-slate-400 text-xs block mb-1">Flexibility / ROM</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono">{romImprovement}</span>
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block font-medium">Joint Mobility Gain</span>
      </div>

      {/* Metric 3: Compliance */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 backdrop-blur-xl">
        <span className="text-slate-400 text-xs block mb-1">Weekly Compliance</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono">{complianceRate}%</span>
        </div>
        <span className="text-[11px] text-teal-400 mt-1 block font-medium">Target Met</span>
      </div>

      {/* Metric 4: Streak */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-4 backdrop-blur-xl">
        <span className="text-slate-400 text-xs block mb-1">Active Streak</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">{streakDays}</span>
          <span className="text-xs text-slate-400">Days</span>
        </div>
        <span className="text-[11px] text-amber-400/90 mt-1 block font-medium">🔥 Personal Record</span>
      </div>
    </div>
  );
};
