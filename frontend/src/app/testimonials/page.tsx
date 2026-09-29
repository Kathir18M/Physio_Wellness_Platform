import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export const metadata: Metadata = {
  title: "Patient Stories & Reviews | PhysioWell",
  description: "Read verified patient reviews and recovery stories from individuals who overcame chronic back pain, ACL surgery, and posture strain.",
};

export default function TestimonialsPage() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
}
