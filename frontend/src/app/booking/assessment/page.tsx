"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingProvider, useBooking } from "@/context/BookingContext";
import { Button } from "@/components/ui/Button";

function BookingStep2Content() {
  const router = useRouter();
  const { state, setAssessmentNotes } = useBooking();

  const [painArea, setPainArea] = useState("Lower Back / Spine");
  const [painLevel, setPainLevel] = useState(5);
  const [notesText, setNotesText] = useState(state.notes || "");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedNotes = `Primary Focus: ${painArea} (Severity: ${painLevel}/10). Notes: ${notesText}`;
    setAssessmentNotes(combinedNotes);
    router.push("/booking/slots");
  };

  return (
    <div className="bg-slate-950 py-12 lg:py-20 text-slate-300 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 border-b border-slate-800 pb-4">
          <span className="text-emerald-400">✓ 1. Care Type</span>
          <span className="text-teal-400 font-bold">2. Pain Intake</span>
          <span>3. Select Slot</span>
          <span>4. Confirmation</span>
        </div>

        <div className="text-center space-y-3">
          <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-3.5 py-1 text-xs font-bold text-teal-400">
            Step 2 of 4
          </span>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Brief Pain & Symptoms Intake</h1>
          <p className="text-sm text-slate-400">This helps {state.therapistName} prepare your tailored consultation.</p>
        </div>

        <form onSubmit={handleNext} className="rounded-2xl bg-slate-900 p-8 border border-slate-800 space-y-6 shadow-xl">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Primary Pain or Condition Area</label>
            <select
              value={painArea}
              onChange={(e) => setPainArea(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:border-teal-500 focus:outline-none text-sm"
            >
              <option value="Lower Back / Spine">Lower Back & Spine Stiffness</option>
              <option value="Neck & Shoulder Tension">Neck & Shoulder Tension / Tech-Neck</option>
              <option value="Knee & Joint Rehab">Knee Joint / Post-ACL Stiffness</option>
              <option value="Post-Surgical Recovery">Post-Surgical Joint Recovery</option>
              <option value="Sports & Athletic Injury">Sports & Athletic Strain</option>
              <option value="General Posture Reset">Ergonomics & Posture Alignment</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-white">Current Pain Severity Level (1 - 10)</label>
              <span className="text-sm font-black text-teal-400 bg-teal-500/10 px-3 py-0.5 rounded-full border border-teal-500/20">
                {painLevel} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Mild Discomfort</span>
              <span>Moderate Pain</span>
              <span>Severe Distress</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">Describe Your Symptoms (Optional)</label>
            <textarea
              rows={4}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="e.g., Pain gets worse after 3 hours of sitting at work, or hurts when climbing stairs..."
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none text-sm"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button onClick={() => router.push("/booking")} variant="ghost">
              ← Back to Step 1
            </Button>
            <Button type="submit" variant="primary" size="lg">
              Continue to Step 3: Pick Date & Time →
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function BookingStep2Page() {
  return (
    <BookingProvider>
      <BookingStep2Content />
    </BookingProvider>
  );
}
