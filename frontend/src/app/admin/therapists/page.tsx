"use client";

import React from "react";

export default function AdminTherapistsPage() {
  const therapists = [
    { id: "th-1", name: "Dr. Sarah Jenkins", title: "Lead Physical Therapist", specialization: "Spinal Rehabilitation", patients: 18, rating: "4.9 / 5.0" },
    { id: "th-2", name: "Dr. Marcus Vance", title: "Senior Musculoskeletal Specialist", specialization: "Orthopedic & Joint Recovery", patients: 14, rating: "4.8 / 5.0" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Therapist Directory & Staff Management</h1>
        <p className="text-slate-400 text-sm">Manage practitioner profiles, clinical credentials, and patient load distribution.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Therapist</th>
              <th className="p-4">Specialization</th>
              <th className="p-4">Active Patients</th>
              <th className="p-4">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {therapists.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-medium text-white">
                  {t.name}
                  <span className="block text-[11px] text-slate-400 font-mono">{t.title}</span>
                </td>
                <td className="p-4 text-slate-300">{t.specialization}</td>
                <td className="p-4 font-mono font-bold text-amber-400">{t.patients} Patients</td>
                <td className="p-4 text-emerald-400 font-bold">{t.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
