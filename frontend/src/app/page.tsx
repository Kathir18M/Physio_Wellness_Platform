import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { PainAreasSection } from "@/components/home/PainAreasSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { ProgramsSection } from "@/components/programs/ProgramsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ExpertsSection } from "@/components/experts/ExpertsSection";
import { ClinicsSection } from "@/components/home/ClinicsSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { FaqSection } from "@/components/faq/FaqSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export const metadata: Metadata = {
  title: "PhysioWell — Evidence-Based Digital & Hybrid Physiotherapy",
  description:
    "Reclaim your freedom of movement. Virtual 1-on-1 physical therapy, posture correction, and specialized rehabilitation guided by licensed specialists.",
  keywords: [
    "physiotherapy",
    "physical therapy",
    "back pain relief",
    "knee rehab",
    "posture correction",
    "tele-rehab",
  ],
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <HeroSection />
      <PainAreasSection />
      <ServicesSection />
      <ProgramsSection />
      <HowItWorksSection />
      <ExpertsSection />
      <ClinicsSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
