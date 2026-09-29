"use client";

import React, { useState } from "react";

export interface ExerciseItem {
  id: string;
  title: string;
  reps: string;
  duration: string;
  category: string;
  completed: boolean;
  videoUrl?: string;
}

interface ExerciseCardProps {
  exercise: ExerciseItem;
  onToggleComplete?: (id: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onToggleComplete,
}) => {
  const [isCompleted, setIsCompleted] = useState(exercise.completed);

  const handleCheck = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (onToggleComplete) {
      onToggleComplete(exercise.id);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
        isCompleted
          ? "bg-slate-900/40 border-slate-800 text-slate-500 opacity-75"
          : "bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-teal-500/50"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={handleCheck}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
            isCompleted
              ? "bg-teal-500 border-teal-400 text-slate-950 font-bold"
              : "border-slate-600 hover:border-teal-400 bg-slate-900"
          }`}
        >
          {isCompleted ? "✓" : ""}
        </button>

        <div className="min-w-0">
          <h4
            className={`text-sm font-semibold truncate ${
              isCompleted ? "line-through text-slate-400" : "text-white"
            }`}
          >
            {exercise.title}
          </h4>
          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <span>{exercise.reps}</span>
            <span>•</span>
            <span>{exercise.duration}</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-900 text-[10px] border border-slate-800 font-mono text-teal-400">
              {exercise.category}
            </span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => alert(`Launching video tutorial for ${exercise.title}`)}
        className="p-2 text-slate-400 hover:text-teal-400 hover:bg-slate-700/60 rounded-lg transition-colors text-xs flex items-center gap-1 font-medium"
      >
        <span>▶</span>
        <span className="hidden sm:inline">Guide</span>
      </button>
    </div>
  );
};
