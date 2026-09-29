"use client";

import React from "react";

export default function AdminExercisesPage() {
  const exercises = [
    { id: "ex-1", name: "Pelvic Tilt & Core Activation", bodyPart: "Lower Back", difficulty: "BEGINNER", duration: "10 mins" },
    { id: "ex-2", name: "Cat-Cow Spine Mobilization", bodyPart: "Spine", difficulty: "BEGINNER", duration: "8 mins" },
    { id: "ex-3", name: "Prone Extension Press-Up", bodyPart: "Lumbar", difficulty: "INTERMEDIATE", duration: "12 mins" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Exercise Library Management</h1>
        <p className="text-slate-400 text-sm">Curate therapeutic exercise routines, video instruction assets, and precautions.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Exercise Name</th>
              <th className="p-4">Body Part</th>
              <th className="p-4">Difficulty</th>
              <th className="p-4">Recommended Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {exercises.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-semibold text-white">{e.name}</td>
                <td className="p-4 text-slate-300">{e.bodyPart}</td>
                <td className="p-4 font-mono font-bold text-teal-400">{e.difficulty}</td>
                <td className="p-4 text-slate-400">{e.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
