"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CLINICS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  Buildings,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";

export const ClinicsSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#080c14] border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Hybrid Care Model"
          title="State-of-the-Art Physical Wellness Centers"
          description="Combine digital telehealth recovery with in-person manual therapy at our modern clinical facilities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CLINICS.map((clinic, idx) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      <Buildings size={20} weight="bold" />
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
                      {clinic.city}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Clock size={14} className="text-teal-400" />
                    <span>{clinic.hours}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold font-display text-white">
                  {clinic.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-teal-400 flex-shrink-0" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <Phone size={16} className="text-cyan-400 flex-shrink-0" />
                    <span className="text-teal-300">{clinic.phone}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                    Clinical Equipment & Amenities:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {clinic.facilities.map((fac, fIdx) => (
                      <span
                        key={fIdx}
                        className="rounded-lg bg-[#162035] px-2.5 py-1 text-xs text-slate-200 border border-white/10 flex items-center gap-1"
                      >
                        <CheckCircle size={12} className="text-teal-400" weight="fill" />
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Walk-ins & Appointments Welcome</span>
                <Link
                  href="/clinics"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:text-white transition-colors"
                >
                  <span>Location & Directions</span>
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
