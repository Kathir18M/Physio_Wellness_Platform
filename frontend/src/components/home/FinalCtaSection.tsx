"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, CalendarCheck, Sparkle } from "@phosphor-icons/react";

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#080c14] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/[0.1] rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 text-center space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          {/* Subtle accent border top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400" />

          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-mono font-medium text-teal-300 border border-teal-500/20">
            <Sparkle size={14} className="text-teal-400" />
            <span>Begin Your Personal Rehabilitation Journey</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.15]">
            Ready to Reclaim <br />
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Pain-Free Mobility?
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Join thousands of patients who restored their active lifestyle. Take your 5-minute digital motion assessment today and connect with licensed physical therapy leads.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              href="/auth/register"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} weight="bold" />}
            >
              Start Free Assessment Now
            </Button>

            <Button href="/booking" variant="secondary" size="lg">
              Book Specialist Consult
            </Button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-teal-400" />
              <span>HIPAA Compliant Data</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarCheck size={16} className="text-teal-400" />
              <span>No Referral Required</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
