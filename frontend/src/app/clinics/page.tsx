import type { Metadata } from "next";
import { ClinicsSection } from "@/components/home/ClinicsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export const metadata: Metadata = {
  title: "Clinic Locations | PhysioWell",
  description: "Find a PhysioWell modern physical therapy center near you for hands-on manual therapy and advanced rehab equipment.",
};

export default function ClinicsPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <ClinicsSection />
      <FinalCtaSection />
    </div>
  );
}
