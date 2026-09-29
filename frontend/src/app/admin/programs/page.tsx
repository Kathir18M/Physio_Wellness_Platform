"use client";

import React from "react";

export default function AdminProgramsPage() {
  const programs = [
    { id: "prog-1", name: "Comprehensive 8-Week Lumbar Rehabilitation", duration: "8 Weeks", price: "$249.00", category: "LOWER_BACK", enrollments: 64 },
    { id: "prog-2", name: "Advanced Posture & Spinal Alignment", duration: "6 Weeks", price: "$199.00", category: "POSTURE", enrollments: 32 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Care Programs Management</h1>
        <p className="text-slate-400 text-sm">Configure wellness programs, pricing, modules, and enrollment tiers.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Program Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Price</th>
              <th className="p-4">Active Enrollments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {programs.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-semibold text-white">{p.name}</td>
                <td className="p-4 text-amber-400 font-mono font-bold">{p.category}</td>
                <td className="p-4 text-slate-300">{p.duration}</td>
                <td className="p-4 font-mono font-bold text-emerald-400">{p.price}</td>
                <td className="p-4 font-mono font-bold text-slate-200">{p.enrollments} Patients</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
