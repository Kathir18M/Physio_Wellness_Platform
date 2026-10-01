"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { EXPERTS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Star, CalendarCheck, SealCheck } from "@phosphor-icons/react";

export const ExpertsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#080c14] border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Board-Certified Practitioners"
          title="Meet Our Lead Musculoskeletal Specialists"
          description="Doctor of Physical Therapy (DPT) professionals with sub-specialties in orthopedic rehab and sports medicine."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXPERTS.map((expert, idx) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-teal-500/30 flex-shrink-0 bg-slate-800">
                    <Image
                      src={expert.avatarUrl}
                      alt={expert.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-base font-bold font-display text-white">{expert.name}</h3>
                      <SealCheck size={16} className="text-teal-400" weight="fill" />
                    </div>
                    <p className="text-xs text-teal-300 font-medium">{expert.role}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs">
                      <Star size={14} className="text-amber-400" weight="fill" />
                      <span className="font-bold text-white font-mono">{expert.rating}</span>
                      <span className="text-slate-400 font-mono">({expert.reviewCount} patient reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic bg-[#080c14]/60 p-3 rounded-xl border border-white/5">
                  &ldquo;{expert.bio}&rdquo;
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Clinical Specialties:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {expert.specialties.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-lg bg-[#162035] px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-white/10"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-white/[0.06]">
                <Link
                  href={`/booking?therapist=${expert.id}`}
                  className="w-full py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold text-center flex items-center justify-center gap-2 transition-all"
                >
                  <CalendarCheck size={16} />
                  <span>Book Consultation</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
