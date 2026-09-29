import React from "react";
import { Button } from "@/components/ui/Button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 py-16 lg:py-24 border-b border-slate-800">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5 text-xs font-semibold text-teal-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Next-Gen Digital & Hybrid Physiotherapy
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl xl:text-6xl leading-[1.1]">
              Reclaim Your <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Freedom of Movement</span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Evidence-based physical therapy, chronic pain relief, and personalized rehabilitation. Designed by licensed specialists to help you live active and pain-free.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Button href="/auth/register" variant="primary" size="lg">
                Start Recovery Assessment →
              </Button>
              <Button href="/programs" variant="outline" size="lg">
                View Rehab Programs
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-white">98%</p>
                <p className="text-xs text-slate-400">Pain Relief Rate</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">5,000+</p>
                <p className="text-xs text-slate-400">Recovered Patients</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4.9 ★</p>
                <p className="text-xs text-slate-400">Clinical Rating</p>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-slate-800/60 p-6 backdrop-blur-xl border border-slate-700/60 shadow-2xl space-y-6">
              
              {/* Feature card item 1 */}
              <div className="flex items-center gap-4 rounded-2xl bg-slate-900/80 p-4 border border-slate-700/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">1-on-1 Video Consults</h3>
                  <p className="text-xs text-slate-400">Live visual movement analysis & real-time feedback</p>
                </div>
              </div>

              {/* Feature card item 2 */}
              <div className="flex items-center gap-4 rounded-2xl bg-slate-900/80 p-4 border border-slate-700/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Custom Exercise Roadmaps</h3>
                  <p className="text-xs text-slate-400">Targeted weekly progressions for your condition</p>
                </div>
              </div>

              {/* Feature card item 3 */}
              <div className="flex items-center gap-4 rounded-2xl bg-slate-900/80 p-4 border border-slate-700/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Hybrid Clinic Access</h3>
                  <p className="text-xs text-slate-400">Hands-on therapy options at central wellness centers</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
