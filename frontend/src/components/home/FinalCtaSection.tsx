import React from "react";
import { Button } from "@/components/ui/Button";

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 py-20">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-6 relative z-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Live Pain-Free and Active?
        </h2>
        <p className="text-base text-teal-100 max-w-2xl mx-auto sm:text-lg">
          Join thousands of patients who restored their mobility and posture. Start your assessment today with our licensed physiotherapy specialists.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/auth/register" variant="primary" size="lg">
            Get Started Now — Free Assessment
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Speak to a Specialist
          </Button>
        </div>
      </div>
    </section>
  );
};
