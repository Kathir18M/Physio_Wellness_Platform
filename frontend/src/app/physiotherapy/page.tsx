import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PainAreasSection } from "@/components/home/PainAreasSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export const metadata: Metadata = {
  title: "Physiotherapy Specialties | PhysioWell",
  description: "Specialized physical therapy pathways for spine decompresion, joint rehabilitation, post-op recovery, and sports biomechanics.",
};

const SPECIALTIES = [
  {
    title: "Musculoskeletal & Orthopedics",
    desc: "Treatment of bone, joint, ligament, tendon, and muscle disorders including lumbar disc herniation, osteoarthritis, and tendonitis.",
  },
  {
    title: "Post-Surgical Orthopedic Rehab",
    desc: "Structured rehabilitation following joint replacements (hip/knee), ACL reconstruction, meniscus repairs, and spinal fusion.",
  },
  {
    title: "Sports Injury & Kinetic Conditioning",
    desc: "High-performance recovery for athletes focusing on gait analysis, explosive power restoration, and injury prevention.",
  },
  {
    title: "Spine & Cervical Posture Correction",
    desc: "Targeted decompression, deep core strengthening, and ergonomic retraining to reverse chronic desk-posture strain.",
  },
];

export default function PhysiotherapyPage() {
  return (
    <div className="bg-slate-950 py-16 lg:py-24 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeading
          badge="Clinical Specialties"
          title="Evidence-Based Physical Therapy Specializations"
          description="Our clinical team holds advanced board certifications across major orthopedic and sports therapy disciplines."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SPECIALTIES.map((spec, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 p-8 border border-slate-800 space-y-4 hover:border-teal-500/50 transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 font-bold">
                0{idx + 1}
              </div>
              <h3 className="text-xl font-bold text-white">{spec.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{spec.desc}</p>
            </div>
          ))}
        </div>

        <PainAreasSection />
        <FinalCtaSection />
      </div>
    </div>
  );
}
