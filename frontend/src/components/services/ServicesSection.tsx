import React from "react";
import Link from "next/link";
import { SERVICES } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-900 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Our Core Services"
          title="Comprehensive Physiotherapy & Rehabilitation"
          description="Whether you need immediate virtual care, structured exercise rehabilitation, or hands-on manual therapy."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl bg-slate-800/60 p-8 border border-slate-700/60 hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-700">
                    {service.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {service.fullDescription}
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Key Benefits:</h4>
                  <ul className="space-y-1.5">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="text-teal-400">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-700/40">
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm font-semibold text-teal-400 hover:text-teal-300 group-hover:translate-x-1 transition-all"
                >
                  Learn More About Service →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
