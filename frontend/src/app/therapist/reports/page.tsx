"use client";

import React, { useState } from "react";

export default function TherapistReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    {
      id: "rep-001",
      patientEmail: "john.doe@example.com",
      reportType: "Clinical Progress & Range of Motion Summary",
      dateGenerated: "Sep 25, 2026",
      status: "READY",
    },
    {
      id: "rep-002",
      patientEmail: "emma.watson@example.com",
      reportType: "8-Week Functional Capacity Evaluation",
      dateGenerated: "Sep 20, 2026",
      status: "READY",
    },
  ];

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      alert(`Exporting clinical PDF report ${id}...`);
      setDownloading(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Clinical Progress Reports</h1>
        <p className="text-slate-400 text-sm">
          Generate, export, and download comprehensive patient progress documentation.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📈</span>
          <span>Generated Patient Reports</span>
        </h2>

        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
            >
              <div>
                <h3 className="font-bold text-white mb-0.5">{r.reportType}</h3>
                <p className="text-slate-400">
                  Patient: <span className="text-slate-200 font-medium">{r.patientEmail}</span> • Generated: {r.dateGenerated}
                </p>
              </div>

              <button
                type="button"
                disabled={downloading === r.id}
                onClick={() => handleDownload(r.id)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold rounded-xl text-xs hover:from-cyan-400 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/10 disabled:opacity-50"
              >
                {downloading === r.id ? "Preparing PDF..." : "Download Report (PDF)"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
