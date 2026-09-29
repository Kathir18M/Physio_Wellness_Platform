import type { Metadata } from "next";
import { ServicesSection } from "@/components/services/ServicesSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export const metadata: Metadata = {
  title: "Clinical Services | PhysioWell",
  description: "Explore PhysioWell's full spectrum of physiotherapy services including tele-rehab, in-clinic manual therapy, and corporate ergonomics.",
};

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <ServicesSection />
      <FinalCtaSection />
    </div>
  );
}
