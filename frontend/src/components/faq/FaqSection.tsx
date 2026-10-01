"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FAQS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaretDown, Question, ShieldCheck } from "@phosphor-icons/react";

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-[#080c14] border-b border-white/[0.08]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Clear Clinical Answers"
          title="Frequently Asked Questions"
          description="Everything you need to know about virtual physical therapy, clinic appointments, insurance, and recovery safety."
        />

        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? "border-teal-500/40 bg-[#0e1526]" : "border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold font-display text-white focus-visible:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Question size={18} className={isOpen ? "text-teal-400" : "text-slate-400"} />
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-xl transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-teal-500/20 text-teal-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <CaretDown size={14} weight="bold" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 space-y-2">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
