import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    step: "01",
    title: "Digital Intake & Biomechanical Assessment",
    description: "Complete a 5-minute health assessment detailing your pain symptoms, movement limitations, and medical history.",
  },
  {
    step: "02",
    title: "1-on-1 Specialist Consultation",
    description: "Connect via live HD video with a licensed physical therapist for a comprehensive movement and posture assessment.",
  },
  {
    step: "03",
    title: "Personalized Digital Rehab Plan",
    description: "Receive your tailored weekly recovery roadmap with high-definition video exercises and real-time posture feedback.",
  },
  {
    step: "04",
    title: "Progress Tracking & Hybrid Care",
    description: "Track pain reduction and strength gains weekly. Opt for in-clinic hands-on therapy whenever required.",
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-slate-900 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge="Simple 4-Step Process"
          title="How Your Recovery Journey Works"
          description="From initial assessment to full functional restoration, we guide every step of your care."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl bg-slate-800/60 p-6 border border-slate-700/60 shadow-xl space-y-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white font-black text-lg shadow-md shadow-teal-500/20">
                {s.step}
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">{s.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
