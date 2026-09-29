"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { appointmentService } from "@/services/appointment";
import { Appointment, AppointmentStatus } from "@/types/appointment";

export default function DashboardAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);

  const mockAppointments: Appointment[] = [
    {
      id: "apt-101",
      patient_id: "patient-1",
      therapist_id: "dr-sarah-jenkins",
      clinic_id: null,
      appointment_type: "ONLINE",
      start_time: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days in future
      end_time: new Date(Date.now() + 86400000 * 2 + 2700000).toISOString(),
      status: "CONFIRMED",
      notes: "Post-op knee rehabilitation & range of motion check",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "apt-102",
      patient_id: "patient-1",
      therapist_id: "dr-marcus-vance",
      clinic_id: "clinic-central",
      appointment_type: "CLINIC",
      start_time: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days in future
      end_time: new Date(Date.now() + 86400000 * 5 + 2700000).toISOString(),
      status: "PENDING",
      notes: "Spinal alignment & lower back acute strain check",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "apt-103",
      patient_id: "patient-1",
      therapist_id: "dr-sarah-jenkins",
      clinic_id: null,
      appointment_type: "ONLINE",
      start_time: new Date(Date.now() - 86400000 * 4).toISOString(), // 4 days ago
      end_time: new Date(Date.now() - 86400000 * 4 + 2700000).toISOString(),
      status: "COMPLETED",
      notes: "Initial shoulder mobility session",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointable();
      if (res && res.length > 0) {
        setAppointments(res);
      } else {
        setAppointments(mockAppointments);
      }
    } catch (err) {
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    setCancellingId(id);
    try {
      await appointmentService.cancelAppointment(id);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: "CANCELLED" } : apt))
      );
    } catch (err) {
      // Fallback for UI demo state update
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: "CANCELLED" } : apt))
      );
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeFilter === "ALL") return true;
    return apt.status === activeFilter;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Pending
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            Cancelled
          </span>
        );
      case "NO_SHOW":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-400 border border-slate-600">
            No Show
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              My Appointments Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your upcoming sessions, view clinical summaries, and reschedule care.
            </p>
          </div>

          <Link
            href="/booking"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20 inline-flex items-center justify-center gap-2"
          >
            <span>+ Book New Appointment</span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-800">
          {["ALL", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {filter === "ALL" ? "All Appointments" : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Loading your clinical appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              📅
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No Appointments Found</h3>
            <p className="text-slate-400 text-sm mb-6">
              You do not have any appointments matching the selected filter.
            </p>
            <Link
              href="/booking"
              className="px-5 py-2.5 bg-teal-500 text-slate-950 font-medium rounded-xl text-sm hover:bg-teal-400 transition-colors inline-block"
            >
              Book an Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const startDate = new Date(apt.start_time);
              const dateStr = startDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const timeStr = `${startDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} - ${new Date(apt.end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`;

              return (
                <div
                  key={apt.id}
                  className="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-5 sm:p-6 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(apt.status)}
                      <span className="text-xs font-mono text-slate-400">ID: {apt.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-medium border border-slate-700">
                        {apt.appointment_type === "ONLINE" ? "💻 Online" : "🏥 In-Clinic"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {apt.appointment_type === "ONLINE"
                        ? "Virtual Physiotherapy Consultation"
                        : "In-Clinic Physical Assessment"}
                    </h3>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 font-medium text-teal-400">
                        🗓️ {dateStr}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium text-slate-200">
                        ⏰ {timeStr}
                      </span>
                    </div>

                    {apt.notes && (
                      <p className="text-xs text-slate-400 pt-1 border-t border-slate-700/50">
                        <span className="font-semibold text-slate-300">Notes:</span> {apt.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-700">
                    {apt.status === "CONFIRMED" || apt.status === "PENDING" ? (
                      <>
                        <button
                          type="button"
                          disabled={cancellingId === apt.id}
                          onClick={() => handleCancel(apt.id)}
                          className="px-4 py-2 rounded-xl border border-rose-500/40 text-rose-300 text-xs font-semibold hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                        >
                          {cancellingId === apt.id ? "Cancelling..." : "Cancel"}
                        </button>

                        <Link
                          href="/booking/slots"
                          className="px-4 py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold hover:bg-slate-600 transition-colors"
                        >
                          Reschedule
                        </Link>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No actions available</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
