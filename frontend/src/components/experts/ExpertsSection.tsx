import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EXPERTS } from "@/data/platformData";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const ExpertsSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-900 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Clinical Excellence"
          title="Meet Our Licensed Physical Therapists"
          description="Experienced, board-certified physical therapists dedicated to your personalized recovery."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EXPERTS.map((expert) => (
            <div
              key={expert.id}
              className="rounded-2xl bg-slate-800/80 p-6 border border-slate-700/60 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-teal-500/40">
                    <Image
                      src={expert.avatarUrl}
                      alt={expert.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{expert.name}</h3>
                    <p className="text-xs text-teal-400 font-medium">{expert.role}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                      <span>★</span>
                      <span className="font-bold text-white">{expert.rating}</span>
                      <span className="text-slate-400">({expert.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;{expert.bio}&rdquo;
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-700/40">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Specialties:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {expert.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-900/60 px-2.5 py-1 text-[10px] font-medium text-slate-300 border border-slate-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-700/40">
                <Link
                  href="/experts"
                  className="block w-full rounded-xl bg-slate-700/50 py-2.5 text-center text-xs font-semibold text-white hover:bg-teal-600 transition-colors"
                >
                  Book Consult with Specialist
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
