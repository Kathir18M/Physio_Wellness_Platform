"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PROGRAMS, ProgramItem } from "@/data/platformData";
import { programService } from "@/services/program";
import { Program } from "@/types/program";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const CATEGORIES = ["All", "Spine & Posture", "Rehabilitation", "Chronic Pain", "Athletic Performance"];

type DisplayProgram = ProgramItem | Program;

function getProgramSlug(item: DisplayProgram): string {
  return "slug" in item && item.slug ? item.slug : item.id;
}

function getProgramTitle(item: DisplayProgram): string {
  return "title" in item ? item.title : item.name;
}

function getProgramDuration(item: DisplayProgram): string {
  return "durationWeeks" in item ? `${item.durationWeeks} Weeks` : item.duration;
}

function getProgramPrice(item: DisplayProgram): number {
  return "price" in item ? item.price : 149;
}

function getProgramFeatures(item: DisplayProgram): string[] {
  return "keyFeatures" in item ? item.keyFeatures : [];
}

export default function ProgramsListingPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [apiPrograms, setApiPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await programService.getPrograms();
        if (data && data.length > 0) {
          setApiPrograms(data);
        }
      } catch {
        // Fallback to static mock data
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const itemsToFilter: DisplayProgram[] = apiPrograms.length > 0 ? apiPrograms : PROGRAMS;

  const filteredPrograms = itemsToFilter.filter((p) => {
    const title = getProgramTitle(p);
    const matchesCategory =
      activeCategory === "All" || p.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-950 py-16 lg:py-24 text-slate-300 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Recovery Protocols"
          title="Specialized Rehabilitation & Wellness Programs"
          description="Condition-specific recovery pathways designed to help you regain full strength and live active."
        />

        {/* Filters & Search Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl bg-slate-900 p-4 border border-slate-800">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/25"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search programs..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Programs Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800">
            <p className="text-lg text-slate-400">No rehabilitation programs found matching your criteria.</p>
            <Button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} variant="outline" className="mt-4">
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => {
              const slug = getProgramSlug(program);
              const title = getProgramTitle(program);
              const duration = getProgramDuration(program);
              const price = getProgramPrice(program);
              const keyFeatures = getProgramFeatures(program);

              return (
                <div
                  key={program.id}
                  className="flex flex-col justify-between rounded-2xl bg-slate-900 p-6 border border-slate-800 hover:border-teal-500/50 transition-all duration-300 shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-[11px] font-bold text-teal-400">
                        {program.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{duration}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {program.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Program Fee</span>
                        <span className="text-lg font-black text-white">
                          {price > 0 ? `$${price}` : "Included"}
                        </span>
                      </div>
                      {keyFeatures.length > 0 && (
                        <span className="text-xs text-slate-400">
                          {keyFeatures.length} Core Modules
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800 flex gap-3">
                    <Link
                      href={`/programs/${slug}`}
                      className="flex-1 rounded-xl bg-slate-800 py-2.5 text-center text-xs font-semibold text-white hover:bg-slate-700 transition-colors border border-slate-700"
                    >
                      View Details
                    </Link>
                    <Button href="/auth/register" variant="primary" size="sm">
                      Enroll Now →
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
