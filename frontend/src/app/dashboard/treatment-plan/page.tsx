"use client";

import React from "react";
import Link from "next/link";
import { TreatmentPlanCard } from "@/components/dashboard/TreatmentPlanCard";

export default function TreatmentPlanPage() {
  const phases = [
    {
      phaseNumber: 1,
      title: "Acute Pain Decompression & Inflammation Control",
      duration: "Weeks 1 - 2",
      status: "COMPLETED",
      goals: [
        "Reduce visual analog scale pain score below 4/10",
        "Eliminate acute radicular discomfort during seated posture",
        "Establish baseline pelvic tilt motor control",
      ],
    },
    {
      phaseNumber: 2,
      title: "Lumbar Core Stabilization & Hamstring Mobility",
      duration: "Weeks 3 - 5 (Current Phase)",
      status: "IN_PROGRESS",
      goals: [
        "Achieve 90° passive straight leg raise without hamstring tightness",
        "Perform 3x12 prone cobra extensions with clean form",
        "Maintain neutral spine alignment during daily ergonomics",
      ],
    },
    {
      phaseNumber: 3,
      title: "Functional Loading & Rotational Endurance",
      duration: "Weeks 6 - 8",
      status: "UPCOMING",
      goals: [
        "Introduce loaded rotational movements and resistance band deadlifts",
        "Resume light jogging and full sports-specific conditioning",
        "Independent home maintenance program transition",
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Clinical Treatment Protocol</h1>
        <p className="text-slate-400 text-sm">
          Customized rehabilitation roadmap designed by <span className="text-teal-400 font-semibold">Dr. Sarah Jenkins, MPT</span>.
        </p>
      </div>

      {/* Main Active Overview Card */}
      <TreatmentPlanCard
        planName="Lumbar Spine Recovery & Postural Protocol"
        progressPercent={65}
        currentWeek={4}
        totalWeeks={8}
        focusArea="Core Stability & Hamstring Decompression"
        nextMilestone="Full 90° Forward Flexion without Pain Trigger"
      />

      {/* Clinical Phases Timeline */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span>📋</span>
          <span>Rehabilitation Phases & Clinical Goals</span>
        </h2>

        <div className="space-y-6">
          {phases.map((phase) => (
            <div
              key={phase.phaseNumber}
              className={`p-5 rounded-2xl border transition-all ${
                phase.status === "IN_PROGRESS"
                  ? "bg-slate-800/90 border-teal-500/50 shadow-lg shadow-teal-500/5"
                  : phase.status === "COMPLETED"
                  ? "bg-slate-900/50 border-slate-800 opacity-90"
                  : "bg-slate-950/40 border-slate-900 opacity-60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-sm text-teal-400">
                    P{phase.phaseNumber}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">{phase.title}</h3>
                    <span className="text-xs text-slate-400">{phase.duration}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    phase.status === "IN_PROGRESS"
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                      : phase.status === "COMPLETED"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {phase.status === "IN_PROGRESS"
                    ? "Active Phase"
                    : phase.status === "COMPLETED"
                    ? "Completed"
                    : "Upcoming"}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <span className="text-xs font-semibold text-slate-300 block mb-2">Phase Milestones:</span>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {phase.goals.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-400">✓</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
