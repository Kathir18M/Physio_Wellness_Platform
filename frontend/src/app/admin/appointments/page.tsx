"use client";

import React from "react";

export default function AdminAppointmentsPage() {
  const appointments = [
    { id: "apt-101", patient: "John Doe", therapist: "Dr. Sarah Jenkins", type: "ONLINE", date: "Sep 30, 2026 - 10:00 AM", status: "CONFIRMED" },
    { id: "apt-102", patient: "Emily Smith", therapist: "Dr. Marcus Vance", type: "CLINIC", date: "Oct 02, 2026 - 02:30 PM", status: "PENDING" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Appointments & Schedule Control</h1>
        <p className="text-slate-400 text-sm">Monitor online video consultations, clinic bookings, and schedule cancellations.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Appointment ID</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Therapist</th>
              <th className="p-4">Type</th>
              <th className="p-4">Scheduled Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {appointments.map((a) => (
              <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono font-bold text-amber-400">{a.id}</td>
                <td className="p-4 font-medium text-white">{a.patient}</td>
                <td className="p-4 text-slate-300">{a.therapist}</td>
                <td className="p-4 font-mono text-slate-400">{a.type}</td>
                <td className="p-4 text-slate-300">{a.date}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {a.status}
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
