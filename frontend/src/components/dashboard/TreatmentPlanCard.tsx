"use client";

import React from "react";
import Link from "next/link";

interface TreatmentPlanCardProps {
  planName?: string;
  progressPercent?: number;
  currentWeek?: number;
  totalWeeks?: number;
  focusArea?: string;
  nextMilestone?: string;
}

export const TreatmentPlanCard: React.FC<TreatmentPlanCardProps> = ({
  planName = "Lumbar Spine Recovery & Postural Protocol",
  progressPercent = 65,
  currentWeek = 4,
  totalWeeks = 8,
  focusArea = "Core Stability & Hamstring Decompression",
  nextMilestone = "Full 90° Forward Flexion without Pain Trigger",
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-6 backdrop-blur-xl shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Active Care Plan
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Week {currentWeek} of {totalWeeks}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{planName}</h3>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
          Focus: <span className="text-slate-200 font-medium">{focusArea}</span>
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-300">Overall Protocol Completion</span>
            <span className="text-teal-400 font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Milestone Box */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/50 text-xs mb-6">
          <span className="text-teal-400 font-semibold block mb-0.5">🎯 Next Clinical Milestone:</span>
          <span className="text-slate-300">{nextMilestone}</span>
        </div>
      </div>

      <Link
        href="/dashboard/treatment-plan"
        className="w-full py-2.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all text-center block"
      >
        View Detailed Plan & Milestones →
      </Link>
    </div>
  );
};
