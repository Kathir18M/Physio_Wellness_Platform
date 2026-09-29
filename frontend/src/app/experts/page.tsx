import type { Metadata } from "next";
import { ExpertsSection } from "@/components/experts/ExpertsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export const metadata: Metadata = {
  title: "Meet Our Physical Therapists | PhysioWell",
  description: "Board-certified physical therapists, orthopedic specialists, and sports injury experts dedicated to your recovery.",
};

export default function ExpertsPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <ExpertsSection />
      <FinalCtaSection />
    </div>
  );
}
