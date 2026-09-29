"use client";

import React, { useState } from "react";

export default function TherapistExercisesPage() {
  const [exerciseName, setExerciseName] = useState<string>("");
  const [sets, setSets] = useState<string>("3");
  const [reps, setReps] = useState<string>("12");
  const [category, setCategory] = useState<string>("STRENGTH");
  const [assignedMessage, setAssignedMessage] = useState<string | null>(null);

  const library = [
    { name: "Cat-Cow Spine Segmental Stretch", category: "MOBILITY", defaultReps: "10 reps" },
    { name: "Prone Cobra Lumbar Extension", category: "STRENGTH", defaultReps: "12 reps" },
    { name: "Standing Hamstring Decompression", category: "FLEXIBILITY", defaultReps: "45 sec hold" },
    { name: "Bird-Dog Core Stabilization", category: "STRENGTH", defaultReps: "10 per side" },
  ];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName) return;
    setAssignedMessage(`Prescribed "${exerciseName}" (${sets} sets x ${reps}) to active patient plan!`);
    setTimeout(() => setAssignedMessage(null), 3500);
    setExerciseName("");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Therapeutic Exercise Prescription</h1>
        <p className="text-slate-400 text-sm">
          Select or customize exercises from the clinical database to assign to patient plans.
        </p>
      </div>

      {assignedMessage && (
        <div className="p-4 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-xl text-sm">
          {assignedMessage}
        </div>
      )}

      {/* Prescription Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
        <h2 className="text-base font-bold text-white mb-4">Assign New Exercise</h2>
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Exercise Title
            </label>
            <input
              type="text"
              placeholder="e.g. Scapular Retraction with Resistance Band"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Sets
              </label>
              <input
                type="text"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Reps / Hold
              </label>
              <input
                type="text"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="MOBILITY">MOBILITY</option>
                <option value="STRENGTH">STRENGTH</option>
                <option value="FLEXIBILITY">FLEXIBILITY</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold rounded-xl text-xs hover:from-cyan-400 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/10"
          >
            Assign Exercise to Routine
          </button>
        </form>
      </div>

      {/* Clinical Library */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-base font-bold text-white mb-4">Clinical Exercise Library</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {library.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">{item.name}</span>
                <span className="text-slate-400 text-[11px]">{item.defaultReps}</span>
              </div>
              <button
                type="button"
                onClick={() => setExerciseName(item.name)}
                className="px-3 py-1 bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded-lg text-[11px] font-semibold"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
