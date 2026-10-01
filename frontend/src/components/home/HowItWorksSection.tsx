"use client";

import React from "react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ClipboardText,
  VideoCamera,
  Compass,
  ChartLineUp,
  ArrowRight,
} from "@phosphor-icons/react";

const STEPS = [
  {
    step: "01",
    icon: <ClipboardText size={24} className="text-teal-400" />,
    title: "Digital Intake & Motion Assessment",
    description: "Complete a 5-minute health assessment detailing your pain symptoms, movement limitations, and joint history.",
  },
  {
    step: "02",
    icon: <VideoCamera size={24} className="text-cyan-400" />,
    title: "1-on-1 Specialist Video Consult",
    description: "Connect via live HD video with a licensed physical therapist for a comprehensive movement & posture evaluation.",
  },
  {
    step: "03",
    icon: <Compass size={24} className="text-emerald-400" />,
    title: "Personalized Digital Rehab Plan",
    description: "Receive your weekly recovery roadmap with high-definition video exercises and posture form feedback.",
  },
  {
    step: "04",
    icon: <ChartLineUp size={24} className="text-indigo-400" />,
    title: "Progress Telemetry & Hybrid Care",
    description: "Track pain reduction and strength gains weekly. Opt for in-clinic hands-on therapy whenever required.",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#080c14] border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="4-Step Care Continuum"
          title="How Your Recovery Journey Works"
          description="From initial digital intake to full functional restoration, we guide every single phase of your care."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="glass-card rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#121b2d] border border-white/10">
                    {s.icon}
                  </div>
                  <span className="text-2xl font-bold font-mono text-teal-400/40">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-white leading-snug">
                  {s.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.description}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                  <ArrowRight size={20} weight="bold" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
