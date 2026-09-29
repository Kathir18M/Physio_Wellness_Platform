"use client";

import React from "react";
import Link from "next/link";
import { Appointment } from "@/types/appointment";

interface AppointmentCardProps {
  appointment: Appointment | null;
  onCancel?: (id: string) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
}) => {
  if (!appointment) {
    return (
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-3 text-slate-400">
          📅
        </div>
        <h3 className="text-base font-semibold text-white mb-1">No Upcoming Appointments</h3>
        <p className="text-slate-400 text-xs mb-4">
          You don't have any scheduled sessions at the moment.
        </p>
        <Link
          href="/booking"
          className="inline-block px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-semibold rounded-xl text-xs hover:from-teal-400 hover:to-cyan-400 transition-all shadow-md shadow-teal-500/10"
        >
          Book Consultation Now
        </Link>
      </div>
    );
  }

  const startDate = new Date(appointment.start_time);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = `${startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${new Date(appointment.end_time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-800/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
            {appointment.status}
          </span>
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-900 text-slate-300 border border-slate-700">
            {appointment.appointment_type === "ONLINE" ? "💻 Online Telehealth" : "🏥 In-Clinic Visit"}
          </span>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Ref: {appointment.id.slice(0, 8)}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">
          {appointment.appointment_type === "ONLINE"
            ? "Virtual Physiotherapy Session"
            : "Physical Rehabilitation Assessment"}
        </h3>
        <p className="text-xs text-slate-400">
          Assigned Therapist: <span className="text-teal-400 font-medium">Dr. Sarah Jenkins, MPT</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/50 text-xs">
        <div>
          <span className="text-slate-400 block mb-0.5">Date & Day</span>
          <span className="font-semibold text-slate-200">🗓️ {formattedDate}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Scheduled Time</span>
          <span className="font-semibold text-slate-200">⏰ {formattedTime}</span>
        </div>
      </div>

      {appointment.notes && (
        <p className="text-xs text-slate-400 mb-6 italic bg-slate-900/30 p-2.5 rounded-lg border border-slate-800">
          "{appointment.notes}"
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        {appointment.appointment_type === "ONLINE" ? (
          <a
            href="#telehealth-room"
            onClick={(e) => {
              e.preventDefault();
              alert("Connecting to secure HD telehealth video room...");
            }}
            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:from-teal-400 hover:to-cyan-400 transition-all text-center shadow-lg shadow-teal-500/20"
          >
            🎥 Join HD Video Call
          </a>
        ) : (
          <Link
            href="/dashboard/appointments"
            className="flex-1 py-2.5 px-4 bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold text-xs rounded-xl hover:bg-teal-500/30 transition-all text-center"
          >
            📍 Clinic Directions
          </Link>
        )}

        <Link
          href="/booking/slots"
          className="px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 font-medium text-xs rounded-xl hover:bg-slate-700 hover:text-white transition-all"
        >
          Reschedule
        </Link>
      </div>
    </div>
  );
};
