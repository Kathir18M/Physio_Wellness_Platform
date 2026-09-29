"use client";

import React, { useState } from "react";

export default function AdminPatientsPage() {
  const [search, setSearch] = useState("");

  const patients = [
    { id: "pat-1", name: "John Doe", email: "john.doe@example.com", condition: "Lumbar Disc Herniation", status: "ACTIVE", therapist: "Dr. Sarah Jenkins" },
    { id: "pat-2", name: "Emily Smith", email: "emily.s@example.com", condition: "ACL Post-Op Recovery", status: "ACTIVE", therapist: "Dr. Marcus Vance" },
    { id: "pat-3", name: "Robert Chen", email: "r.chen@example.com", condition: "Cervical Spondylosis", status: "COMPLETED", therapist: "Dr. Sarah Jenkins" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Patient Management</h1>
          <p className="text-slate-400 text-sm">Monitor active patients, assigned therapists, and clinical care states.</p>
        </div>
        <input
          type="text"
          placeholder="Search patient name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Patient</th>
              <th className="p-4">Primary Condition</th>
              <th className="p-4">Assigned Therapist</th>
              <th className="p-4">Care Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-medium text-white">
                  {p.name}
                  <span className="block text-[11px] text-slate-400 font-mono">{p.email}</span>
                </td>
                <td className="p-4 text-slate-300">{p.condition}</td>
                <td className="p-4 text-amber-400 font-medium">{p.therapist}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {p.status}
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
