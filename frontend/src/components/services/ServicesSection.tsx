"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SERVICES } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  VideoCamera,
  Buildings,
  Brain,
  Crosshair,
  ArrowUpRight,
  Check,
} from "@phosphor-icons/react";

export const ServicesSection: React.FC = () => {
  const iconMap = [
    <VideoCamera key="1" size={24} className="text-teal-400" />,
    <Buildings key="2" size={24} className="text-cyan-400" />,
    <Brain key="3" size={24} className="text-emerald-400" />,
    <Crosshair key="4" size={24} className="text-indigo-400" />,
  ];

  return (
    <section className="py-20 bg-[#080c14] border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Clinical Care Modalities"
          title="Complete Digital & Hybrid Rehabilitation Services"
          description="Combining licensed specialist expertise with real-time motion telemetry to guide your full recovery journey."
        />

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {SERVICES.map((service, idx) => {
            const colSpans = [
              "md:col-span-7",
              "md:col-span-5",
              "md:col-span-5",
              "md:col-span-7",
            ];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`glass-card glass-card-hover rounded-3xl p-6 sm:p-8 flex flex-col justify-between ${colSpans[idx % 4]}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#121b2d] border border-white/10">
                      {iconMap[idx % iconMap.length]}
                    </div>
                    <span className="text-xs font-mono text-teal-400/80 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                      {service.duration} Session
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Feature Checkpoints */}
                  {service.benefits && (
                    <ul className="space-y-2 pt-2 border-t border-white/10">
                      {service.benefits.map((benefit, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check size={14} className="text-teal-400 flex-shrink-0" weight="bold" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-6 mt-4 flex items-center justify-between border-t border-white/[0.06]">
                  <span className="text-xs font-mono text-slate-400">Licensed Practitioner Guided</span>
                  <Link
                    href={`/services#${service.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-300 hover:text-white transition-colors"
                  >
                    <span>Service Details</span>
                    <ArrowUpRight size={14} weight="bold" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
