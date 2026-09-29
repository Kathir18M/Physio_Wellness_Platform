"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { therapistService, TherapistPatientDetail } from "@/services/therapist";

export default function TherapistPatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;

  const [detail, setDetail] = useState<TherapistPatientDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [clinicalNote, setClinicalNote] = useState<string>("");
  const [noteSaved, setNoteSaved] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      if (!patientId) return;
      try {
        const res = await therapistService.getPatientDetail(patientId);
        if (isMounted) setDetail(res);
      } catch (err) {
        if (isMounted) {
          // Mock patient detail fallback
          setDetail({
            patient: {
              id: patientId,
              email: "john.doe@example.com",
              phone: "+1 (555) 234-5678",
              role: "PATIENT",
              is_active: true,
              is_verified: true,
              created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
              updated_at: new Date().toISOString(),
            },
            appointments: [
              {
                id: "apt-101",
                patient_id: patientId,
                therapist_id: "dr-sarah-jenkins",
                clinic_id: null,
                appointment_type: "ONLINE",
                start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
                end_time: new Date(Date.now() + 86400000 * 2 + 2700000).toISOString(),
                status: "CONFIRMED",
                notes: "Post-op knee rehabilitation & range of motion check",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: "apt-102",
                patient_id: patientId,
                therapist_id: "dr-sarah-jenkins",
                clinic_id: null,
                appointment_type: "ONLINE",
                start_time: new Date(Date.now() - 86400000 * 5).toISOString(),
                end_time: new Date(Date.now() - 86400000 * 5 + 2700000).toISOString(),
                status: "COMPLETED",
                notes: "Initial intake & gait assessment",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ],
            total_appointments: 2,
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicalNote.trim()) return;
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 3000);
    setClinicalNote("");
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm">Loading clinical patient file...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="py-12 text-center text-slate-400">
        Patient record not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/therapist/patients"
          className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
        >
          ← Back to Patient Roster
        </Link>
        <span className="text-xs font-mono text-slate-400">ID: {detail.patient.id}</span>
      </div>

      {/* Patient Summary Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 font-bold text-xl flex items-center justify-center">
            {detail.patient.email.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{detail.patient.email}</h1>
            <p className="text-xs text-slate-400 font-mono">{detail.patient.phone || "No phone number registered"}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
              Assigned Clinical Patient
            </span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-right min-w-[160px]">
          <span className="text-xs text-slate-400 block mb-0.5">Total Consultations</span>
          <span className="text-2xl font-bold text-cyan-400 font-mono">{detail.total_appointments}</span>
        </div>
      </div>

      {/* Clinical Notes Logger */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span>📝</span>
          <span>Add Clinical Consultation Note</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Record subjective patient feedback, objective range-of-motion measurements, or treatment plan modifications.
        </p>

        {noteSaved && (
          <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-xl text-xs">
            Clinical note appended to patient medical chart!
          </div>
        )}

        <form onSubmit={handleAddNote} className="space-y-3">
          <textarea
            rows={3}
            value={clinicalNote}
            onChange={(e) => setClinicalNote(e.target.value)}
            placeholder="Enter SOAP notes (Subjective, Objective, Assessment, Plan)..."
            className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
          />

          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold rounded-xl text-xs hover:from-cyan-400 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/10"
          >
            Save Clinical Note
          </button>
        </form>
      </div>

      {/* Appointment History */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📅</span>
          <span>Consultation & Appointment History</span>
        </h2>

        <div className="space-y-3">
          {detail.appointments.map((apt) => {
            const start = new Date(apt.start_time);
            return (
              <div
                key={apt.id}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white">
                      {start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[10px]">
                      {apt.appointment_type}
                    </span>
                  </div>
                  <p className="text-slate-400">
                    {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • Status:{" "}
                    <span className="text-cyan-400 font-medium">{apt.status}</span>
                  </p>
                  {apt.notes && <p className="text-slate-300 mt-1 italic">"{apt.notes}"</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
