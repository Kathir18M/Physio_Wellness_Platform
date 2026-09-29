import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us | PhysioWell",
  description: "Learn about PhysioWell's mission to make world-class physical rehabilitation accessible, personalized, and convenient for everyone.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-950 py-16 lg:py-24 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        <SectionHeading
          badge="Our Mission & Values"
          title="Transforming Rehabilitation Through Science & Compassion"
          description="We combine clinical expertise with modern digital tools to help individuals overcome pain and move without limits."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Why PhysioWell Was Founded</h3>
            <p className="text-slate-300 leading-relaxed">
              Traditional physical therapy often involves long commute times, inconvenient clinic hours, and generic paper exercise sheets. PhysioWell was founded to bridge the gap between hospital-grade clinical therapy and accessible daily recovery.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Our hybrid care framework empowers licensed physical therapists with high-definition digital movement analysis, allowing patients to complete guided recovery sessions at home while maintaining continuous clinical oversight.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-xl bg-slate-900 p-4 border border-slate-800">
                <p className="text-2xl font-black text-teal-400">100%</p>
                <p className="text-xs text-slate-400">Licensed Therapists</p>
              </div>
              <div className="rounded-xl bg-slate-900 p-4 border border-slate-800">
                <p className="text-2xl font-black text-teal-400">15,000+</p>
                <p className="text-xs text-slate-400">Completed Sessions</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-8 border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white">Our Core Clinical Principles</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs">1</span>
                <div>
                  <strong className="text-white block">Evidence-Based Protocols</strong>
                  Every treatment track follows peer-reviewed physical therapy guidelines tailored to specific anatomical conditions.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs">2</span>
                <div>
                  <strong className="text-white block">Biomechanical Precision</strong>
                  We analyze kinetic chain alignment, joint mobility, and muscle activation to treat root causes rather than just masking symptoms.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs">3</span>
                <div>
                  <strong className="text-white block">Hybrid Flexibility</strong>
                  Seamless transition between virtual video consultations and hands-on manual therapy at our modern clinical centers.
                </div>
              </li>
            </ul>

            <div className="pt-4">
              <Button href="/auth/register" variant="primary" className="w-full justify-center">
                Start Your Journey With Us →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
