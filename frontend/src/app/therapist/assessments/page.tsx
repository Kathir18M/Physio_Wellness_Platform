"use client";

import React from "react";

export default function TherapistAssessmentsPage() {
  const assessments = [
    {
      id: "asm-1",
      patientEmail: "john.doe@example.com",
      dateSubmitted: "Sep 27, 2026",
      primaryPainArea: "Lower Back / Lumbar Spine (L4-L5)",
      painSeverity: 6,
      symptomDuration: "3 - 6 Weeks",
      aggravatingFactors: "Prolonged sitting, forward bending",
      status: "REVIEWED",
    },
    {
      id: "asm-2",
      patientEmail: "emma.watson@example.com",
      dateSubmitted: "Sep 28, 2026",
      primaryPainArea: "Right Shoulder / Rotator Cuff",
      painSeverity: 5,
      symptomDuration: "1 - 2 Weeks",
      aggravatingFactors: "Overhead lifting, sleeping on shoulder",
      status: "PENDING_REVIEW",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Patient Intake Assessments</h1>
        <p className="text-slate-400 text-sm">
          Review subjective symptom questionnaires and digital intake data submitted by patients.
        </p>
      </div>

      <div className="space-y-4">
        {assessments.map((asm) => (
          <div
            key={asm.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{asm.patientEmail}</h3>
                <span className="text-xs text-slate-400">Submitted on {asm.dateSubmitted}</span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  asm.status === "PENDING_REVIEW"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                }`}
              >
                {asm.status === "PENDING_REVIEW" ? "Pending Review" : "Reviewed"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Primary Pain Region</span>
                <span className="font-semibold text-white">{asm.primaryPainArea}</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Pain Severity Index</span>
                <span className="font-semibold text-amber-400 font-mono text-sm">{asm.painSeverity} / 10</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Duration</span>
                <span className="font-semibold text-slate-200">{asm.symptomDuration}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-400">Aggravating Triggers:</span> {asm.aggravatingFactors}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
