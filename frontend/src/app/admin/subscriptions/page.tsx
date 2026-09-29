"use client";

import React from "react";

export default function AdminSubscriptionsPage() {
  const subscriptions = [
    { id: "sub-501", patient: "John Doe", program: "Lumbar Care Package", startDate: "Sep 15, 2026", status: "ACTIVE" },
    { id: "sub-502", patient: "Emily Smith", program: "Posture Recovery Plan", startDate: "Sep 20, 2026", status: "ACTIVE" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Active Subscriptions</h1>
        <p className="text-slate-400 text-sm">Monitor recurring patient care subscriptions, renewals, and cancellations.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Subscription ID</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Program</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {subscriptions.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono font-bold text-amber-400">{s.id}</td>
                <td className="p-4 font-medium text-white">{s.patient}</td>
                <td className="p-4 text-slate-300">{s.program}</td>
                <td className="p-4 text-slate-400">{s.startDate}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
