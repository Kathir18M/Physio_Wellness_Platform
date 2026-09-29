"use client";

import React, { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointment";
import { Appointment, AppointmentStatus } from "@/types/appointment";

export default function TherapistAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const mockAppointments: Appointment[] = [
    {
      id: "apt-201",
      patient_id: "pt-101",
      therapist_id: "dr-sarah-jenkins",
      clinic_id: null,
      appointment_type: "ONLINE",
      start_time: new Date(Date.now() + 3600000).toISOString(),
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
    {
      id: "apt-203",
      patient_id: "pt-103",
      therapist_id: "dr-sarah-jenkins",
      clinic_id: null,
      appointment_type: "ONLINE",
      start_time: new Date(Date.now() - 86400000 * 3).toISOString(),
      end_time: new Date(Date.now() - 86400000 * 3 + 2700000).toISOString(),
      status: "COMPLETED",
      notes: "Initial intake consultation",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchApts = async () => {
      try {
        const res = await appointmentService.getMyAppointable();
        if (isMounted && res && res.length > 0) {
          setAppointments(res);
        } else {
          setAppointments(mockAppointments);
        }
      } catch (err) {
        if (isMounted) setAppointments(mockAppointments);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeFilter === "ALL") return true;
    return apt.status === activeFilter;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Clinical Schedule & Bookings</h1>
        <p className="text-slate-400 text-sm">
          Manage upcoming patient appointments and update consultation statuses.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {["ALL", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === filter
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {filter === "ALL" ? "All Sessions" : filter.charAt(0) + filter.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading clinical appointment schedule...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
          No appointments found matching "{activeFilter}".
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const start = new Date(apt.start_time);
            return (
              <div
                key={apt.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {apt.appointment_type}
                    </span>
                    <span className="text-xs font-semibold text-teal-400">{apt.status}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {apt.appointment_type === "ONLINE"
                      ? "Virtual Telehealth Consultation"
                      : "In-Clinic Examination"}
                  </h3>

                  <p className="text-xs text-slate-300">
                    🗓️ {start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} •{" "}
                    ⏰ {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>

                  {apt.notes && <p className="text-xs text-slate-400 italic">"{apt.notes}"</p>}
                </div>

                <div className="flex items-center gap-2">
                  {apt.status === "CONFIRMED" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(apt.id, "COMPLETED")}
                      className="px-3.5 py-2 bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold rounded-xl hover:bg-teal-500/30 transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}

                  {apt.appointment_type === "ONLINE" && (
                    <button
                      type="button"
                      onClick={() => alert("Launching Practitioner Telehealth Video Room...")}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold rounded-xl text-xs hover:from-cyan-400 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/10"
                    >
                      🎥 Start HD Call
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
