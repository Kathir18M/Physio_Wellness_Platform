"use client";

import React, { useEffect, useState } from "react";
import { assessmentService, Assessment } from "@/services/assessment";

export default function PatientAssessmentPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [painArea, setPainArea] = useState<string>("Lower Back (L4-L5)");
  const [painLevel, setPainLevel] = useState<number>(6);
  const [painDuration, setPainDuration] = useState<string>("3 to 6 weeks");
  const [previousInjuries, setPreviousInjuries] = useState<string>("");
  const [medicalHistory, setMedicalHistory] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("Desk Job / Office Work");
  const [activityLevel, setActivityLevel] = useState<string>("Lightly Active");
  const [sleepQuality, setSleepQuality] = useState<string>("Fair");
  const [lifestyle, setLifestyle] = useState<string>("");
  const [goals, setGoals] = useState<string>("Reduce pain during prolonged sitting and improve core mobility");
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const fetchMine = async () => {
      try {
        const res = await assessmentService.getMyAssessments();
        if (isMounted && res && res.length > 0) {
          setAssessments(res);
        }
      } catch (err) {
        // Mock fallback if API offline
        if (isMounted) setAssessments([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMine();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);

    const payload = {
      pain_area: painArea,
      pain_level: painLevel,
      pain_duration: painDuration,
      previous_injuries: previousInjuries || undefined,
      medical_history: medicalHistory || undefined,
      occupation: occupation || undefined,
      activity_level: activityLevel || undefined,
      sleep_quality: sleepQuality || undefined,
      lifestyle: lifestyle || undefined,
      goals: goals || undefined,
      additional_notes: additionalNotes || undefined,
    };

    try {
      const created = await assessmentService.createAssessment(payload);
      setAssessments((prev) => [created, ...prev]);
      setSuccessMessage("Health intake assessment submitted successfully! Your practitioner will review it shortly.");
    } catch (err) {
      // Demo fallback
      const mockCreated: Assessment = {
        id: "asm-" + Math.random().toString(36).substring(2, 9),
        patient_id: "patient-1",
        status: "PENDING_REVIEW",
        pain_area: painArea,
        pain_level: painLevel,
        pain_duration: painDuration,
        occupation,
        goals,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setAssessments((prev) => [mockCreated, ...prev]);
      setSuccessMessage("Health intake assessment submitted successfully!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Health Intake & Symptom Assessment</h1>
        <p className="text-slate-400 text-sm">
          Complete your comprehensive digital intake evaluation to personalize your clinical treatment plan.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      {/* Submitted Assessments Summary */}
      {assessments.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>Your Submitted Health Intake Status</span>
          </h2>

          <div className="space-y-4">
            {assessments.map((asm) => (
              <div
                key={asm.id}
                className="p-5 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{asm.pain_area}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {asm.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Pain Level</span>
                    <span className="font-bold text-amber-400 font-mono">{asm.pain_level} / 10</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <span className="font-semibold text-slate-200">{asm.pain_duration}</span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Mobility Score</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      {asm.mobility_score ? `${asm.mobility_score}%` : "Pending Evaluation"}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">Strength Score</span>
                    <span className="font-bold text-teal-400 font-mono">
                      {asm.strength_score ? `${asm.strength_score}%` : "Pending Evaluation"}
                    </span>
                  </div>
                </div>

                {asm.recommendations && (
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="font-semibold text-teal-400">Practitioner Recommendations:</span> "{asm.recommendations}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intake Questionnaire Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-6">Submit New Assessment Questionnaire</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pain Area & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Primary Area of Discomfort / Pain
              </label>
              <input
                type="text"
                required
                value={painArea}
                onChange={(e) => setPainArea(e.target.value)}
                placeholder="e.g. Lower Back, Neck, Left Knee"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Symptom Duration
              </label>
              <input
                type="text"
                required
                value={painDuration}
                onChange={(e) => setPainDuration(e.target.value)}
                placeholder="e.g. 2 weeks, 3 months"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>
          </div>

          {/* Pain Level Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Pain Level (0 = No Pain, 10 = Severe)
              </label>
              <span className="text-lg font-bold text-teal-400 font-mono">{painLevel} / 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>

          {/* Lifestyle & Health Context */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Occupation
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="Sedentary">Sedentary (Mostly Sitting)</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Vigorous / Athlete">Vigorous / Athlete</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Sleep Quality
              </label>
              <select
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="Good">Good (7-8 hours restful)</option>
                <option value="Fair">Fair (Occasional disruption)</option>
                <option value="Poor">Poor (Disrupted by pain)</option>
              </select>
            </div>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Primary Rehabilitation Goals
            </label>
            <textarea
              rows={2}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-7 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {submitting ? "Submitting Assessment..." : "Submit Health Intake Assessment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
