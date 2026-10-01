"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { PAIN_AREAS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  FirstAidKit,
  ArrowRight,
  CheckCircle,
  WarningCircle,
  Pulse,
  Heartbeat,
} from "@phosphor-icons/react";

export const PainAreasSection: React.FC = () => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(PAIN_AREAS[0]?.id || "back-pain");

  const selectedArea = PAIN_AREAS.find((a) => a.id === selectedAreaId) || PAIN_AREAS[0];

  return (
    <section className="py-20 bg-[#080c14] border-b border-white/[0.08] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Pain & Injury Focus"
          title="Where Are You Experiencing Pain?"
          description="Select your targeted discomfort area to explore evidence-based recovery protocols tailored by physical therapists."
        />

        {/* Anatomical Zone Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PAIN_AREAS.map((area) => {
            const isSelected = area.id === selectedAreaId;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => setSelectedAreaId(area.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 cursor-pointer ${
                  isSelected
                    ? "bg-teal-500/15 border-teal-400/60 text-white shadow-[0_0_25px_rgba(45,212,191,0.2)] scale-[1.02]"
                    : "bg-[#0e1526] border-white/10 text-slate-400 hover:bg-[#162035] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-xl text-xs font-bold ${
                      isSelected ? "bg-teal-400 text-slate-950" : "bg-slate-800 text-teal-400"
                    }`}
                  >
                    <Pulse size={16} weight="bold" />
                  </div>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />}
                </div>

                <span className={`text-sm font-bold font-display ${isSelected ? "text-teal-300" : "text-slate-200"}`}>
                  {area.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Pain Area Deep-Dive Panel */}
        <AnimatePresence mode="wait">
          {selectedArea && (
            <motion.div
              key={selectedArea.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Area Content */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono">
                    <Heartbeat size={14} className="text-teal-400" />
                    <span>Targeted Recovery Pathway</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    {selectedArea.title} Protocol
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {selectedArea.description}
                  </p>

                  {/* Common Symptoms List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      Common Symptoms Handled:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedArea.commonSymptoms.map((symptom, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-[#080c14]/60 p-2.5 rounded-xl border border-white/5">
                          <CheckCircle size={16} className="text-teal-400 flex-shrink-0" weight="fill" />
                          <span>{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Action & Outcome Box */}
                <div className="lg:col-span-5">
                  <div className="bg-[#080c14]/90 p-6 rounded-2xl border border-teal-500/30 space-y-5 text-center lg:text-left">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs font-mono text-slate-400">Clinical Recovery Target</span>
                      <span className="text-xs font-mono text-teal-400 font-bold">4 to 8 Weeks</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-2xl font-bold font-display text-white">96% Clinical Success</p>
                      <p className="text-xs text-slate-400">Achieved full functional range of motion without surgery.</p>
                    </div>

                    <Link
                      href={`/booking?area=${selectedArea.id}`}
                      className="w-full py-3.5 px-5 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-teal-500/20"
                    >
                      <span>Book {selectedArea.title} Assessment</span>
                      <ArrowRight size={16} weight="bold" />
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
