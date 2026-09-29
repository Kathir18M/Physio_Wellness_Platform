"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import { EXPERTS, CLINICS } from "@/data/platformData";
import { Button } from "@/components/ui/Button";

function BookingStep1Content() {
  const router = useRouter();
  const { state, setCareType, setTherapist, setClinic } = useBooking();

  const handleNext = () => {
    router.push("/booking/assessment");
  };

  return (
    <div className="bg-slate-950 py-12 lg:py-20 text-slate-300 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-800 pb-4">
          <span className="text-teal-400 font-bold">1. Select Care Type & Specialist</span>
          <span>2. Pain Intake</span>
          <span>3. Select Slot</span>
          <span>4. Confirmation</span>
        </div>

        <div className="text-center space-y-3">
          <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-3.5 py-1 text-xs font-bold text-teal-400">
            Step 1 of 4
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Choose Your Preferred Care Mode</h1>
          <p className="text-sm text-slate-400">Select virtual tele-rehab or visit one of our modern clinics in person.</p>
        </div>

        {/* Care Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => {
              setCareType("ONLINE");
              setClinic(null, null);
            }}
            className={`rounded-2xl p-6 text-left border transition-all ${
              state.appointmentType === "ONLINE"
                ? "bg-slate-900 border-teal-500 ring-2 ring-teal-500/20 shadow-xl"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Virtual Video Consultation</h3>
            <p className="text-xs text-slate-400">1-on-1 HD video session from home with movement & posture evaluation.</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setCareType("CLINIC");
              setClinic(CLINICS[0].id, CLINICS[0].name);
            }}
            className={`rounded-2xl p-6 text-left border transition-all ${
              state.appointmentType === "CLINIC"
                ? "bg-slate-900 border-teal-500 ring-2 ring-teal-500/20 shadow-xl"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">In-Clinic Hands-On Session</h3>
            <p className="text-xs text-slate-400">Manual therapy & advanced electrotherapy equipment at our central clinic.</p>
          </button>
        </div>

        {/* Clinic Location Picker (If CLINIC selected) */}
        {state.appointmentType === "CLINIC" && (
          <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Select Clinic Facility</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CLINICS.map((clinic) => (
                <button
                  key={clinic.id}
                  type="button"
                  onClick={() => setClinic(clinic.id, clinic.name)}
                  className={`rounded-xl p-4 text-left border transition-all ${
                    state.clinicId === clinic.id
                      ? "bg-slate-800 border-teal-500 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <p className="text-sm font-bold text-white">{clinic.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{clinic.city}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Therapist Selection */}
        <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Select Your Physical Therapy Specialist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXPERTS.map((expert) => (
              <button
                key={expert.id}
                type="button"
                onClick={() => setTherapist(expert.id, expert.name)}
                className={`rounded-xl p-4 text-left border transition-all ${
                  state.therapistId === expert.id
                    ? "bg-slate-800 border-teal-500 text-white"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <p className="text-sm font-bold text-white">{expert.name}</p>
                <p className="text-xs text-teal-400 mt-1">{expert.role}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Action */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} variant="primary" size="lg">
            Continue to Step 2: Pain Intake →
          </Button>
        </div>

      </div>
    </div>
  );
}

export default function BookingStep1Page() {
  return (
    <BookingProvider>
      <BookingStep1Content />
    </BookingProvider>
  );
}
