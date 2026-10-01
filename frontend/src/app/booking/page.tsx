"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import { EXPERTS, CLINICS } from "@/data/platformData";
import { Button } from "@/components/ui/Button";
import {
  VideoCamera,
  Buildings,
  User,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkle,
} from "@phosphor-icons/react";

function BookingStep1Content() {
  const router = useRouter();
  const { state, setCareType, setTherapist, setClinic } = useBooking();

  const handleNext = () => {
    router.push("/booking/assessment");
  };

  return (
    <div className="bg-[#080c14] py-12 lg:py-20 text-slate-300 min-h-[calc(100vh-5rem)] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-4">
          <span className="text-teal-300 font-bold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
            1. Care Mode & Specialist
          </span>
          <span>2. Pain Assessment</span>
          <span>3. Schedule Slot</span>
          <span>4. Confirmation</span>
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-3.5 py-1 text-xs font-mono font-semibold text-teal-300">
            <Sparkle size={14} className="text-teal-400" />
            <span>Step 1 of 4 — Initial Clinical Setup</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Choose Your Preferred Care Modality
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Select virtual tele-rehab from home or book an in-person manual therapy session at our modern clinics.
          </p>
        </div>

        {/* Care Mode Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => {
              setCareType("ONLINE");
              setClinic(null, null);
            }}
            className={`glass-card rounded-3xl p-6 text-left border transition-all cursor-pointer ${
              state.appointmentType === "ONLINE"
                ? "bg-[#0e1526] border-teal-400 ring-2 ring-teal-400/30 shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <VideoCamera size={24} weight="bold" />
              </div>
              {state.appointmentType === "ONLINE" && (
                <CheckCircle size={20} className="text-teal-400" weight="fill" />
              )}
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-1">
              Virtual Telehealth Session
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              1-on-1 HD video consult with live motion assessment, biomechanical feedback, and digital rehab roadmap.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setCareType("CLINIC");
              setClinic(CLINICS[0].id, CLINICS[0].name);
            }}
            className={`glass-card rounded-3xl p-6 text-left border transition-all cursor-pointer ${
              state.appointmentType === "CLINIC"
                ? "bg-[#0e1526] border-teal-400 ring-2 ring-teal-400/30 shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Buildings size={24} weight="bold" />
              </div>
              {state.appointmentType === "CLINIC" && (
                <CheckCircle size={20} className="text-teal-400" weight="fill" />
              )}
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-1">
              In-Clinic Manual Therapy
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In-person spinal manipulation, electrotherapy, and joint mobilization at our state-of-the-art wellness centers.
            </p>
          </button>
        </div>

        {/* Clinic Location Picker (If CLINIC selected) */}
        {state.appointmentType === "CLINIC" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-card rounded-3xl p-6 border border-white/10 space-y-4"
          >
            <h3 className="text-sm font-bold font-display text-white">Select Clinic Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CLINICS.map((clinic) => (
                <button
                  key={clinic.id}
                  type="button"
                  onClick={() => setClinic(clinic.id, clinic.name)}
                  className={`rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                    state.clinicId === clinic.id
                      ? "bg-[#162035] border-teal-400 text-white font-semibold"
                      : "bg-[#080c14]/60 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <p className="text-sm font-bold font-display text-white">{clinic.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-1">{clinic.city}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Specialist Selection */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold font-display text-white">Select Lead Physical Therapist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXPERTS.map((expert) => (
              <button
                key={expert.id}
                type="button"
                onClick={() => setTherapist(expert.id, expert.name)}
                className={`rounded-2xl p-4 text-left border transition-all cursor-pointer ${
                  state.therapistId === expert.id
                    ? "bg-[#162035] border-teal-400 text-white font-semibold shadow-md"
                    : "bg-[#080c14]/60 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <User size={16} className={state.therapistId === expert.id ? "text-teal-400" : "text-slate-500"} />
                  <p className="text-sm font-bold font-display text-white">{expert.name}</p>
                </div>
                <p className="text-xs text-teal-300 font-mono">{expert.role}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Next Step Action */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleNext}
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={18} weight="bold" />}
          >
            Continue to Step 2: Pain Intake
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
