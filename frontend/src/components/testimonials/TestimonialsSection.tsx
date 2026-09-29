import React from "react";
import { TESTIMONIALS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-950 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Real Patient Stories"
          title="Transformative Pain Relief & Recovery Outcomes"
          description="Read how thousands of patients restored their active lifestyle through PhysioWell."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col justify-between rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                    Recovered in {testimonial.recoveredInWeeks} Wks
                  </span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{testimonial.story}&rdquo;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{testimonial.patientName}, {testimonial.age}</h4>
                  <p className="text-xs text-slate-400">{testimonial.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Physio</p>
                  <p className="text-xs font-semibold text-teal-400">{testimonial.physioAssigned}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
