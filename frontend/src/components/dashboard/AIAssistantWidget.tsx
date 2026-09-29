"use client";

import React, { useState } from "react";
import { aiService, ExerciseAssistantResult, PostureAnalysisResult } from "@/services/ai";

export function AIAssistantWidget() {
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ExerciseAssistantResult | null>(null);

  const [analyzingPosture, setAnalyzingPosture] = useState<boolean>(false);
  const [postureResult, setPostureResult] = useState<PostureAnalysisResult | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      setLoading(true);
      const res = await aiService.askExerciseAssistant(question);
      setResponse(res);
    } catch (err) {
      console.error("AI Assistant error:", err);
      alert("AI Assistant temporarily unavailable. Please consult your physical therapist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunPostureCheck = async () => {
    try {
      setAnalyzingPosture(true);
      const mockLandmarks = {
        shoulder_left: { x: 0.5, y: 0.2 },
        shoulder_right: { x: 0.52, y: 0.21 },
        hip_left: { x: 0.49, y: 0.5 },
        hip_right: { x: 0.51, y: 0.5 },
      };
      const mockMetrics = { shoulder_asymmetry_deg: 1.2, head_tilt_angle_deg: 4.5 };
      const res = await aiService.analyzePosture(mockLandmarks, mockMetrics);
      setPostureResult(res);
    } catch (err) {
      console.error("Posture analysis error:", err);
    } finally {
      setAnalyzingPosture(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
            🤖
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>AI Exercise & Movement Assistant</span>
              <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                NON-DIAGNOSTIC ASSISTANT
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Form guidance, posture analysis, and routine support verified by clinical safeguards.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunPostureCheck}
          disabled={analyzingPosture}
          className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          {analyzingPosture ? "Analyzing Landmarks..." : "📷 AI Posture Check"}
        </button>
      </div>

      {/* Posture Result Box */}
      {postureResult && (
        <div className="p-4 bg-slate-950/80 border border-indigo-500/30 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-indigo-300">Posture Alignment Score</span>
            <span className="font-mono text-lg font-bold text-teal-400">
              {postureResult.alignment_score} / 100
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px] font-mono">
            <div>Head Tilt: {postureResult.head_tilt_angle_deg}°</div>
            <div>Shoulder Delta: {postureResult.shoulder_asymmetry_deg}°</div>
          </div>
          <div className="space-y-1">
            <span className="font-semibold text-slate-300 block">Form Recommendations:</span>
            {postureResult.recommendations.map((rec, i) => (
              <p key={i} className="text-slate-400 text-[11px]">
                • {rec}
              </p>
            ))}
          </div>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[10px] text-amber-300 italic">
            ⚠️ {postureResult.disclaimer}
          </div>
        </div>
      )}

      {/* Question Form */}
      <form onSubmit={handleAsk} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask AI assistant about exercise form, rep pacing, or posture..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Asking AI..." : "Ask Assistant"}
          </button>
        </div>
      </form>

      {/* AI Response Output */}
      {response && (
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 text-xs">
          <p className="text-slate-200 leading-relaxed">{response.response_text}</p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-teal-400 font-medium">
            💡 {response.safety_guidance}
          </div>
          <p className="text-[10px] text-slate-500 italic">{response.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
