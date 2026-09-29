import React from "react";
import Link from "next/link";
import { PROGRAMS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const ProgramsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-950 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Structured Recovery Tracks"
          title="Targeted Physical Rehabilitation Programs"
          description="Condition-specific recovery pathways designed to help you regain full strength and prevent re-injury."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMS.map((program) => (
            <div
              key={program.id}
              className="flex flex-col justify-between rounded-2xl bg-slate-900 p-6 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-[11px] font-bold text-indigo-400">
                    {program.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {program.durationWeeks} Weeks
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {program.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {program.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Program Highlights:</span>
                  <ul className="space-y-1">
                    {program.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className="text-indigo-400 font-bold">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <Button href="/auth/register" variant="secondary" size="sm" className="w-full justify-center">
                  Enroll In Program →
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link href="/programs" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 underline">
            Explore All Specialized Rehabilitation Programs →
          </Link>
        </div>
      </div>
    </section>
  );
};
