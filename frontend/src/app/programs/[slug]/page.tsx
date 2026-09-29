"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PROGRAMS, ProgramItem } from "@/data/platformData";
import { programService } from "@/services/program";
import { Program } from "@/types/program";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [program, setProgram] = useState<Program | ProgramItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!slug) return;
      try {
        const data = await programService.getProgramBySlug(slug);
        if (data) {
          setProgram(data);
        }
      } catch {
        // Fallback to matching static mock program
        const found = PROGRAMS.find((p) => p.slug === slug || p.id === slug);
        if (found) {
          setProgram(found);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-300 space-y-4">
        <h2 className="text-2xl font-bold text-white">Program Not Found</h2>
        <p className="text-sm text-slate-400">The rehabilitation program you requested does not exist.</p>
        <Button href="/programs" variant="outline">
          Back to Programs
        </Button>
      </div>
    );
  }

  const title = "title" in program ? program.title : program.name;
  const duration = "durationWeeks" in program ? `${program.durationWeeks} Weeks` : program.duration;
  const price = "price" in program ? program.price : 149;
  const keyFeatures = "keyFeatures" in program ? program.keyFeatures : [];
  const suitableFor = "suitableFor" in program ? program.suitableFor : "Individuals looking for structured physical therapy.";

  return (
    <div className="bg-slate-950 py-16 lg:py-24 text-slate-300 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        <Link href="/programs" className="inline-flex items-center text-xs font-semibold text-teal-400 hover:underline">
          ← Back to All Programs
        </Link>

        {/* Program Overview Banner */}
        <div className="rounded-3xl bg-slate-900 p-8 lg:p-12 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-xs font-bold text-teal-400">
              {program.category}
            </span>
            <span className="text-sm text-slate-400 font-medium">
              Duration: <strong className="text-white">{duration}</strong>
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
            {title}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
            {program.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-800">
            <div>
              <span className="text-xs text-slate-500 block uppercase font-bold">Total Program Investment</span>
              <span className="text-3xl font-black text-white">${price}</span>
            </div>

            <div className="flex gap-4">
              <Button href="/auth/register" variant="primary" size="lg">
                Enroll In Program Now →
              </Button>
            </div>
          </div>
        </div>

        {/* Suitable For & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-slate-900/60 p-6 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">Target Audience</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{suitableFor}</p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 p-6 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">Program Outcomes</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-teal-400">✓</span> Significant reduction in acute and chronic pain
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">✓</span> Restored joint range of motion & core stability
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-400">✓</span> Long-term re-injury prevention roadmap
              </li>
            </ul>
          </div>
        </div>

        {/* Modules Breakdown */}
        <div className="space-y-6">
          <SectionHeading
            badge="Curriculum & Milestones"
            title="Weekly Rehabilitation Modules"
            description="Step-by-step progressive exercise milestones guided by your physical therapist."
            centered={false}
          />

          <div className="space-y-4">
            {"modules" in program && program.modules && program.modules.length > 0 ? (
              program.modules.map((m, idx) => (
                <div key={m.id || idx} className="rounded-xl bg-slate-900 p-5 border border-slate-800 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{m.name}</h4>
                    {m.description && <p className="text-xs text-slate-400 mt-1">{m.description}</p>}
                  </div>
                </div>
              ))
            ) : keyFeatures.length > 0 ? (
              keyFeatures.map((feat, idx) => (
                <div key={idx} className="rounded-xl bg-slate-900 p-5 border border-slate-800 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Module {idx + 1}: {feat}</h4>
                    <p className="text-xs text-slate-400 mt-1">Guided video movements, tissue release, and load progression drills.</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">Modules will be customized upon initial clinical intake.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
