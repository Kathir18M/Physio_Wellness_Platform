"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { therapistService, TherapistPatient } from "@/services/therapist";
import { appointmentService } from "@/services/appointment";
import { Appointment } from "@/types/appointment";

export default function TherapistDashboardPage() {
  const [patients, setPatients] = useState<TherapistPatient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const mockPatients: TherapistPatient[] = [
    {
      id: "pt-101",
      email: "john.doe@example.com",
      phone: "+1 (555) 234-5678",
      role: "PATIENT",
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
      total_appointments: 4,
      last_appointment: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "pt-102",
      email: "emma.watson@example.com",
      phone: "+1 (555) 987-6543",
      role: "PATIENT",
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      total_appointments: 2,
      last_appointment: new Date(Date.now() + 86400000).toISOString(),
    },
  ];

  const mockAppointments: Appointment[] = [
    {
      id: "apt-201",
      patient_id: "pt-101",
      therapist_id: "dr-sarah-jenkins",
      clinic_id: null,
      appointment_type: "ONLINE",
      start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      end_time: new Date(Date.now() + 3600000 + 2700000).toISOString(),
      status: "CONFIRMED",
      notes: "Post-op knee range of motion evaluation",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "apt-202",
      patient_id: "pt-102",
      therapist_id: "dr-sarah-jenkins",
      clinic_id: "clinic-1",
      appointment_type: "CLINIC",
      start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
      end_time: new Date(Date.now() + 86400000 * 2 + 2700000).toISOString(),
      status: "PENDING",
      notes: "Acute lumbar spine flexion assessment",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [pts, apts] = await Promise.all([
          therapistService.getPatients(),
          appointmentService.getMyAppointable(),
        ]);
        if (isMounted) {
          setPatients(pts && pts.length > 0 ? pts : mockPatients);
          setAppointments(apts && apts.length > 0 ? apts : mockAppointments);
        }
      } catch (err) {
        if (isMounted) {
          setPatients(mockPatients);
          setAppointments(mockAppointments);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Practitioner Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3 inline-block">
            Practitioner Clinical Overview
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Welcome back, Dr. Sarah Jenkins, MPT
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            You have <span className="text-cyan-400 font-semibold">{appointments.length} active sessions</span> scheduled for this week. 2 new intake assessments require clinical review.
          </p>
        </div>
      </div>

      {/* Practitioner Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs block mb-1">Active Patients</span>
          <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{patients.length}</span>
          <span className="text-[11px] text-cyan-400 block mt-1">Assigned Roster</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs block mb-1">Sessions Today</span>
          <span className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono">1</span>
          <span className="text-[11px] text-slate-400 block mt-1">Upcoming at 10:00 AM</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs block mb-1">Pending Intakes</span>
          <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">2</span>
          <span className="text-[11px] text-amber-400 block mt-1">Review Required</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs block mb-1">Avg Patient Compliance</span>
          <span className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono">94%</span>
          <span className="text-[11px] text-teal-400 block mt-1">Exercise Completion</span>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Today's Schedule & Patient Roster */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Consultations */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🗓️</span>
                <span>Upcoming Clinical Schedule</span>
              </h2>
              <Link
                href="/therapist/appointments"
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                Full Calendar View →
              </Link>
            </div>

            <div className="space-y-4">
              {appointments.map((apt) => {
                const start = new Date(apt.start_time);
                return (
                  <div
                    key={apt.id}
                    className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {apt.appointment_type}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{apt.status}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {apt.appointment_type === "ONLINE" ? "Virtual Video Session" : "In-Clinic Examination"}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} •{" "}
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {apt.notes && <p className="text-xs text-slate-300 mt-1 italic">"{apt.notes}"</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {apt.appointment_type === "ONLINE" ? (
                        <button
                          type="button"
                          onClick={() => alert("Launching Practitioner Telehealth Video Room...")}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold rounded-xl text-xs hover:from-cyan-400 hover:to-blue-400 transition-all"
                        >
                          🎥 Start Call
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Room 3B</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Patients Quick Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>👥</span>
                <span>Assigned Patient Roster</span>
              </h2>
              <Link
                href="/therapist/patients"
                className="text-xs text-cyan-400 hover:underline font-semibold"
              >
                View Roster ({patients.length}) →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Patient Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Total Sessions</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-semibold text-white">{p.email}</td>
                      <td className="p-3 font-mono text-slate-400">{p.phone || "N/A"}</td>
                      <td className="p-3 font-mono text-cyan-400">{p.total_appointments}</td>
                      <td className="p-3">
                        <Link
                          href={`/therapist/patients/${p.id}`}
                          className="text-xs text-cyan-400 hover:underline font-semibold"
                        >
                          View File →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Practitioner Quick Actions */}
        <div className="space-y-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span>⚡</span>
              <span>Clinical Quick Actions</span>
            </h3>

            <div className="space-y-3">
              <Link
                href="/therapist/assessments"
                className="w-full p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-left block hover:border-cyan-500/40 transition-all"
              >
                <h4 className="text-xs font-bold text-white mb-0.5">Review Clinical Intakes</h4>
                <p className="text-[11px] text-slate-400">Evaluate 2 newly submitted intake questionnaires.</p>
              </Link>

              <Link
                href="/therapist/treatment-plans"
                className="w-full p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-left block hover:border-cyan-500/40 transition-all"
              >
                <h4 className="text-xs font-bold text-white mb-0.5">Build Treatment Protocol</h4>
                <p className="text-[11px] text-slate-400">Prescribe customized rehabilitation phases.</p>
              </Link>

              <Link
                href="/therapist/exercises"
                className="w-full p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-left block hover:border-cyan-500/40 transition-all"
              >
                <h4 className="text-xs font-bold text-white mb-0.5">Assign Daily Routine</h4>
                <p className="text-[11px] text-slate-400">Update therapeutic exercise sets and reps.</p>
              </Link>

              <Link
                href="/therapist/reports"
                className="w-full p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-left block hover:border-cyan-500/40 transition-all"
              >
                <h4 className="text-xs font-bold text-white mb-0.5">Generate Progress Report</h4>
                <p className="text-[11px] text-slate-400">Export clinical discharge summaries.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
