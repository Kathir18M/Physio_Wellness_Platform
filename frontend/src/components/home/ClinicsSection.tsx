import React from "react";
import Link from "next/link";
import { CLINICS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const ClinicsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-950 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Hybrid Care Model"
          title="State-of-the-Art Wellness Centers"
          description="Combine digital tele-rehab with in-person manual therapy at our modern clinical facilities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CLINICS.map((clinic) => (
            <div
              key={clinic.id}
              className="rounded-2xl bg-slate-900 p-8 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                    {clinic.city}
                  </span>
                  <span className="text-xs text-slate-400">
                    {clinic.hours}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{clinic.name}</h3>
                <p className="text-sm text-slate-300">{clinic.address}</p>
                <p className="text-xs text-teal-400 font-semibold">{clinic.phone}</p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Clinic Facilities:</span>
                  <div className="flex flex-wrap gap-2">
                    {clinic.facilities.map((fac, idx) => (
                      <span key={idx} className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300 border border-slate-700">
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <Link
                  href="/clinics"
                  className="inline-flex items-center text-sm font-semibold text-teal-400 hover:text-teal-300"
                >
                  View Clinic Location & Directions →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
