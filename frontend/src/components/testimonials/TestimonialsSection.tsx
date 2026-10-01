"use client";

import React from "react";
import { motion } from "motion/react";
import { TESTIMONIALS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star, Quotes, SealCheck } from "@phosphor-icons/react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#080c14] border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Verified Patient Outcomes"
          title="Transformative Recovery & Pain Relief Stories"
          description="Read how individuals reclaimed their mobility and returned to full activity through PhysioWell protocols."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} weight="fill" />
                    ))}
                  </div>

                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-mono font-bold text-emerald-400">
                    Recovered in {t.recoveredInWeeks} Wks
                  </span>
                </div>

                <div className="relative">
                  <Quotes size={32} className="text-teal-500/20 absolute -top-2 -left-2 pointer-events-none" />
                  <p className="text-sm text-slate-200 leading-relaxed relative z-10 pl-4 italic">
                    &ldquo;{t.story}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="text-sm font-bold font-display text-white">{t.patientName}, {t.age}</h4>
                    <SealCheck size={14} className="text-teal-400" weight="fill" />
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{t.condition}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Lead Therapist</span>
                  <span className="text-xs font-semibold text-teal-300 font-mono">{t.physioAssigned}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
