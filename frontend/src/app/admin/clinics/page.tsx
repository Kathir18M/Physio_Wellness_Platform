"use client";

import React from "react";

export default function AdminClinicsPage() {
  const clinics = [
    { id: "c-101", name: "Central Spine & Sports Clinic", city: "New York, NY", status: "OPERATIONAL", therapistsCount: 8 },
    { id: "c-102", name: "Metro Musculoskeletal Center", city: "Los Angeles, CA", status: "OPERATIONAL", therapistsCount: 6 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Clinic Locations & Facilities</h1>
        <p className="text-slate-400 text-sm">Manage physical clinic branches, working hours, and facility capacity.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Clinic Name</th>
              <th className="p-4">City / Location</th>
              <th className="p-4">Staff Count</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {clinics.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-semibold text-white">{c.name}</td>
                <td className="p-4 text-slate-300">{c.city}</td>
                <td className="p-4 font-mono font-bold text-slate-200">{c.therapistsCount} Staff</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {c.status}
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
