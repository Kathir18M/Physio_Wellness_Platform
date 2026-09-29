"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { therapistService, TherapistPatient } from "@/services/therapist";

export default function TherapistPatientsListPage() {
  const [patients, setPatients] = useState<TherapistPatient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    {
      id: "pt-103",
      email: "michael.brown@example.com",
      phone: "+1 (555) 456-7890",
      role: "PATIENT",
      is_active: true,
      created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
      total_appointments: 8,
      last_appointment: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ];

  const fetchPatients = async (query?: string) => {
    setLoading(true);
    try {
      const res = await therapistService.getPatients(query);
      if (res && res.length > 0) {
        setPatients(res);
      } else {
        setPatients(
          mockPatients.filter(
            (p) =>
              !query ||
              p.email.toLowerCase().includes(query.toLowerCase()) ||
              (p.phone && p.phone.includes(query))
          )
        );
      }
    } catch (err) {
      setPatients(
        mockPatients.filter(
          (p) =>
            !query ||
            p.email.toLowerCase().includes(query.toLowerCase()) ||
            (p.phone && p.phone.includes(query))
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients(searchQuery);
  }, [searchQuery]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Assigned Patient Roster</h1>
          <p className="text-slate-400 text-sm">
            Clinical caseload management for your assigned patients.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Fetching assigned patient roster...</p>
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
          No patients found matching "{searchQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => {
            const created = new Date(patient.created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            return (
              <div
                key={patient.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-sm flex items-center justify-center">
                      {patient.email.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                      Active Patient
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 truncate">{patient.email}</h3>
                  <p className="text-xs text-slate-400 font-mono mb-4">{patient.phone || "No phone registered"}</p>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1.5 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Consultations:</span>
                      <span className="font-mono text-cyan-400 font-bold">{patient.total_appointments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Patient Since:</span>
                      <span className="text-slate-200">{created}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/therapist/patients/${patient.id}`}
                  className="w-full py-2.5 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl hover:bg-slate-700 hover:text-white transition-all text-center block"
                >
                  Open Clinical Profile →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
