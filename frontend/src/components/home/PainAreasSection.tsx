import React from "react";
import { PAIN_AREAS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const PainAreasSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-950 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Pain & Injury Focus"
          title="Where Are You Experiencing Pain?"
          description="Select your primary area of distress to explore evidence-based recovery pathways."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAIN_AREAS.map((area) => (
            <div
              key={area.id}
              className="group rounded-2xl bg-slate-900 p-6 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors mb-2">
                {area.title}
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {area.description}
              </p>

              <div className="space-y-1 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Common Symptoms:</span>
                <ul className="space-y-1">
                  {area.commonSymptoms.map((symptom, idx) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="text-teal-400">•</span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
