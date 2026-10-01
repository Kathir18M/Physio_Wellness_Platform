"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  ShieldCheck,
  Pulse,
  VideoCamera,
  Target,
  Sparkle,
  TrendUp,
  CheckCircle,
} from "@phosphor-icons/react";

export const HeroSection: React.FC = () => {
  const [activeJoint, setActiveJoint] = useState<string>("lumbar");

  const jointMetrics = {
    lumbar: { label: "Lumbar L4-L5 Flexion", angle: "78°", status: "Optimal Range", score: 94 },
    cervical: { label: "Cervical Extension", angle: "42°", status: "Mild Tightness", score: 86 },
    knee: { label: "Patellofemoral Flexion", angle: "135°", status: "Full Mobility", score: 98 },
  };

  const currentMetric = jointMetrics[activeJoint as keyof typeof jointMetrics];

  return (
    <section className="relative overflow-hidden bg-[#060a10] py-16 lg:py-24 border-b border-white/[0.08]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-teal-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Copy Column ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-medium tracking-wider text-emerald-300 border border-emerald-500/20 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Clinical Telehealth & Motion Intelligence
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.1]">
              Reclaim Pain-Free <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-green-400 bg-clip-text text-transparent drop-shadow-sm">
                Human Movement
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Evidence-based physical therapy, biomechanical motion analysis, and targeted rehabilitation guided by licensed musculoskeletal specialists.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
              <Button href="/auth/register" variant="primary" size="lg" rightIcon={<ArrowRight size={18} weight="bold" />}>
                Start Recovery Assessment
              </Button>
              <Button href="/programs" variant="secondary" size="lg">
                Explore Care Programs
              </Button>
            </div>

            {/* Clinical Evidence Trust Strip */}
            <div className="pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-bold font-display text-white">98.4%</p>
                <p className="text-xs text-slate-400 font-mono">Pain Reduction Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-emerald-400">12,000+</p>
                <p className="text-xs text-slate-400 font-mono">Recovered Patients</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-white">4.96 ★</p>
                <p className="text-xs text-slate-400 font-mono">Clinical Rating</p>
              </div>
            </div>
          </motion.div>

          {/* ── Right Interactive Biomechanical Radar Card ──────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-5">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Pulse size={20} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">Biomechanical Motion Radar</h3>
                    <p className="text-[11px] font-mono text-slate-400">Live AI Kinematic Sensor Stream</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                  LIVE ANALYZER
                </span>
              </div>

              {/* Joint Selector Pills */}
              <div className="flex items-center gap-2 bg-[#060a10]/80 p-1.5 rounded-xl border border-white/10">
                {Object.keys(jointMetrics).map((jointKey) => (
                  <button
                    key={jointKey}
                    type="button"
                    onClick={() => setActiveJoint(jointKey)}
                    className={`flex-1 py-1.5 text-xs font-mono capitalize rounded-lg transition-all ${
                      activeJoint === jointKey
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {jointKey}
                  </button>
                ))}
              </div>

              {/* Central Biomechanical Display Box */}
              <div className="bg-[#0c1420] rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden space-y-4">
                
                {/* Node Target Simulation Graphic */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-emerald-400 animate-spin-slow" />
                    <span className="text-xs font-mono text-slate-300">{currentMetric.label}</span>
                  </div>
                  <span className="text-2xl font-bold font-mono text-emerald-300">{currentMetric.angle}</span>
                </div>

                {/* Mobility Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Range Quality Index</span>
                    <span className="text-emerald-400 font-bold">{currentMetric.score} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      key={activeJoint}
                      initial={{ width: 0 }}
                      animate={{ width: `${currentMetric.score}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Status Tag */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400 font-mono">Clinical Assessment:</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle size={14} weight="fill" />
                    {currentMetric.status}
                  </span>
                </div>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-[#131f30] border border-white/5 flex items-start gap-2.5">
                  <VideoCamera size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">HD Telehealth</h4>
                    <p className="text-[11px] text-slate-400 leading-tight">1-on-1 specialist consultation</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#131f30] border border-white/5 flex items-start gap-2.5">
                  <TrendUp size={18} className="text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Custom Roadmap</h4>
                    <p className="text-[11px] text-slate-400 leading-tight">Weekly strength progression</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
