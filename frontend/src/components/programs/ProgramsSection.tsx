"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { PROGRAMS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  Clock,
  Sparkle,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";

export const ProgramsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#080c14] border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Structured Recovery Protocols"
          title="Specialized Clinical Rehabilitation Programs"
          description="Condition-specific multi-week recovery protocols designed by clinical physical therapy leads."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((prog, idx) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Program Header Badges */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <Clock size={14} />
                    {prog.durationWeeks} Weeks ({prog.sessionsPerWeek}x/wk)
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 text-[11px] font-mono border border-white/10">
                    {prog.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display text-white">
                  {prog.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {prog.description}
                </p>

                {/* Key Features / Milestones */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Key Rehabilitation Features:
                  </span>
                  <div className="space-y-1.5">
                    {prog.keyFeatures.map((feat, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle size={14} className="text-teal-400 flex-shrink-0" weight="fill" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">{prog.category}</span>
                  <span className="text-xs font-bold text-white font-mono">100% Specialist Verified</span>
                </div>

                <Link
                  href={`/programs/${prog.slug}`}
                  className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <span>View Roadmap</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
