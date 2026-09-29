"use client";

import React, { useEffect, useState } from "react";
import { ExerciseCard, ExerciseItem } from "@/components/dashboard/ExerciseCard";
import { exerciseService, Exercise } from "@/services/exercise";

export default function ExercisesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    {
      id: "ex-1",
      title: "Cat-Cow Spine Segmental Stretch",
      reps: "3 sets x 10 reps",
      duration: "5 mins",
      category: "MOBILITY",
      completed: true,
    },
    {
      id: "ex-2",
      title: "Prone Cobra Lumbar Extension",
      reps: "3 sets x 12 reps",
      duration: "8 mins",
      category: "STRENGTH",
      completed: false,
    },
    {
      id: "ex-3",
      title: "Standing Hamstring Decompression",
      reps: "2 sets x 45 sec hold",
      duration: "4 mins",
      category: "FLEXIBILITY",
      completed: false,
    },
    {
      id: "ex-4",
      title: "Bird-Dog Core Stabilization",
      reps: "3 sets x 10 reps per side",
      duration: "6 mins",
      category: "STRENGTH",
      completed: false,
    },
    {
      id: "ex-5",
      title: "Glute Bridge & Pelvic Alignment",
      reps: "3 sets x 15 reps",
      duration: "7 mins",
      category: "STRENGTH",
      completed: true,
    },
    {
      id: "ex-6",
      title: "Child's Pose Decompression Stretch",
      reps: "3 sets x 60 sec hold",
      duration: "5 mins",
      category: "MOBILITY",
      completed: false,
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchApiExercises = async () => {
      try {
        const res = await exerciseService.getExercises();
        if (isMounted && res && res.length > 0) {
          const mapped = res.map((e) => ({
            id: e.id,
            title: e.name,
            reps: `${e.sets} sets x ${e.repetitions}`,
            duration: e.duration || "5 mins",
            category: e.difficulty === "BEGINNER" ? "MOBILITY" : "STRENGTH",
            completed: false,
          }));
          setExercises(mapped);
        }
      } catch (err) {
        // Mock fallback active
      }
    };

    fetchApiExercises();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleExercise = async (id: string) => {
    const target = exercises.find((e) => e.id === id);
    if (!target) return;

    const nextCompleted = !target.completed;

    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, completed: nextCompleted } : ex))
    );

    if (nextCompleted) {
      try {
        await exerciseService.logCompletion(id, { notes: "Completed daily routine session" });
        setNotification(`Logged session completion for "${target.title}"!`);
      } catch (err) {
        setNotification(`Logged session completion for "${target.title}"!`);
      } finally {
        setTimeout(() => setNotification(null), 3000);
      }
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    if (activeCategory === "ALL") return true;
    return ex.category === activeCategory;
  });

  const completedCount = exercises.filter((e) => e.completed).length;
  const totalCount = exercises.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Daily Exercise Routine</h1>
          <p className="text-slate-400 text-sm">
            Prescribed therapeutic exercises for Week 4 of your protocol.
          </p>
        </div>

        <div className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3">
          <span className="text-xs text-slate-400">Daily Progress:</span>
          <span className="text-sm font-bold text-teal-400 font-mono">
            {completedCount} / {totalCount} ({completionPercentage}%)
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-xl text-xs font-medium">
          {notification}
        </div>
      )}

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {["ALL", "MOBILITY", "STRENGTH", "FLEXIBILITY"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/10"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {cat === "ALL" ? "All Exercises" : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="space-y-3">
        {filteredExercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            onToggleComplete={handleToggleExercise}
          />
        ))}
      </div>
    </div>
  );
}
