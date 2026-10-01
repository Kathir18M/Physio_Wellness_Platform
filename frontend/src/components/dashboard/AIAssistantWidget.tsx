"use client";

import React, { useState } from "react";
import { aiService, ExerciseAssistantResult, PostureAnalysisResult } from "@/services/ai";
import {
  Brain,
  Camera,
  PaperPlaneRight,
  ShieldCheck,
  CheckCircle,
  WarningCircle,
  Sparkle,
} from "@phosphor-icons/react";

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
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg">
            <Brain size={22} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-display text-white">
                AI Kinematic & Form Assistant
              </h2>
              <span className="text-[10px] bg-teal-500/10 border border-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full font-mono">
                NON-DIAGNOSTIC TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Form guidance, posture analysis, and routine support verified by clinical safeguards.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunPostureCheck}
          disabled={analyzingPosture}
          className="px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-mono font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Camera size={16} />
          <span>{analyzingPosture ? "Analyzing Landmarks..." : "Run AI Posture Check"}</span>
        </button>
      </div>

      {/* Posture Result Box */}
      {postureResult && (
        <div className="p-4 bg-[#05080f] border border-teal-500/30 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold font-display text-teal-300">Posture Alignment Score</span>
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
              <p key={i} className="text-slate-400 text-[11px] flex items-center gap-1.5">
                <CheckCircle size={12} className="text-teal-400" weight="fill" />
                <span>{rec}</span>
              </p>
            ))}
          </div>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-300 flex items-center gap-1.5 font-mono">
            <WarningCircle size={14} className="flex-shrink-0" />
            <span>{postureResult.disclaimer}</span>
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
            className="flex-1 px-4 py-2.5 bg-[#080c14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-sans transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold text-xs rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{loading ? "Analyzing..." : "Ask Assistant"}</span>
            <PaperPlaneRight size={14} weight="bold" />
          </button>
        </div>
      </form>

      {/* AI Response Output */}
      {response && (
        <div className="p-4 bg-[#05080f] border border-white/10 rounded-2xl space-y-3 text-xs">
          <p className="text-slate-200 leading-relaxed font-sans">{response.response_text}</p>
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[11px] text-teal-300 font-mono flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-400" />
            <span>{response.safety_guidance}</span>
          </div>
          <p className="text-[10px] text-slate-500 italic font-mono">{response.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
