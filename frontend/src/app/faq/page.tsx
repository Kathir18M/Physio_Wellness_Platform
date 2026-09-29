import type { Metadata } from "next";
import { FaqSection } from "@/components/faq/FaqSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | PhysioWell",
  description: "Find clear answers about PhysioWell virtual consultations, in-clinic visits, insurance coverage, and recovery timelines.",
};

export default function FaqPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
