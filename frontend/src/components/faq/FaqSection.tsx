"use client";

import React, { useState } from "react";
import { FAQS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 lg:py-24 bg-slate-900 border-b border-slate-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Frequently Asked Questions"
          title="Everything You Need to Know About PhysioWell"
          description="Clear answers about virtual therapy, clinic visits, safety, and recovery plans."
        />

        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl bg-slate-800/80 border border-slate-700/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-5 text-left text-base font-semibold text-white hover:text-teal-400 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <span className={`ml-4 flex h-6 w-6 transform items-center justify-center rounded-full bg-slate-700 text-sm transition-transform ${isOpen ? "rotate-180 bg-teal-500 text-white" : "text-slate-300"}`}>
                    ↓
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-700/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
