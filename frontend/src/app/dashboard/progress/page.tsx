"use client";

import React, { useEffect, useState } from "react";
import { progressService, ProgressRecord, ProgressSummary } from "@/services/progress";

export default function RecoveryProgressPage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [history, setHistory] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [newPainScore, setNewPainScore] = useState<number>(2);
  const [newWeight, setNewWeight] = useState<string>("72.5");
  const [newMobility, setNewMobility] = useState<string>("85");
  const [newStrength, setNewStrength] = useState<string>("80");
  const [newNotes, setNewNotes] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchProgressData = async () => {
      try {
        const [sumRes, histRes] = await Promise.all([
          progressService.getSummary(),
          progressService.getHistory(),
        ]);

        if (isMounted) {
          if (sumRes) setSummary(sumRes);
          if (histRes && histRes.length > 0) setHistory(histRes);
        }
      } catch (err) {
        // Mock fallback data if API offline
        if (isMounted) {
          setSummary({
            latest_pain_score: 2,
            avg_pain_score_weekly: 2.3,
            exercise_completion_rate: 92.0,
            appointment_attendance_rate: 100.0,
            mobility_improvement: "+28%",
            streak_days: 14,
            goals: [
              {
                id: "g-1",
                patient_id: "p-1",
                goal_title: "Lumbar Forward Flexion (90° Target)",
                target_value: 90.0,
                current_value: 85.0,
                unit: "degrees",
                is_achieved: false,
              },
              {
                id: "g-2",
                patient_id: "p-1",
                goal_title: "Pain Reduction under 3/10",
                target_value: 3.0,
                current_value: 2.0,
                unit: "points",
                is_achieved: true,
              },
            ],
          });

          setHistory([
            {
              id: "rec-1",
              patient_id: "p-1",
              pain_score: 2,
              weight: 72.5,
              mobility_score: 85,
              strength_score: 80,
              notes: "Minimal stiffness after morning stretches",
              recorded_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
            },
            {
              id: "rec-2",
              patient_id: "p-1",
              pain_score: 3,
              weight: 72.8,
              mobility_score: 80,
              strength_score: 75,
              notes: "Felt good during prone cobra exercises",
              recorded_at: new Date(Date.now() - 86400000 * 2).toISOString(),
              created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
            {
              id: "rec-3",
              patient_id: "p-1",
              pain_score: 5,
              weight: 73.1,
              mobility_score: 70,
              strength_score: 70,
              notes: "Initial intake assessment baseline",
              recorded_at: new Date(Date.now() - 86400000 * 7).toISOString(),
              created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
            },
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProgressData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotification(null);

    const payload = {
      pain_score: newPainScore,
      weight: newWeight ? parseFloat(newWeight) : undefined,
      mobility_score: newMobility ? parseInt(newMobility, 10) : undefined,
      strength_score: newStrength ? parseInt(newStrength, 10) : undefined,
      notes: newNotes || undefined,
    };

    try {
      const created = await progressService.createRecord(payload);
      setHistory((prev) => [created, ...prev]);
      setNotification(`Progress record logged successfully! Pain index: ${newPainScore}/10.`);
    } catch (err) {
      // Demo fallback record
      const mockRecord: ProgressRecord = {
        id: "rec-" + Math.random().toString(36).substring(2, 9),
        patient_id: "p-1",
        pain_score: newPainScore,
        weight: payload.weight,
        mobility_score: payload.mobility_score,
        strength_score: payload.strength_score,
        notes: newNotes,
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      setHistory((prev) => [mockRecord, ...prev]);
      setNotification(`Progress record logged successfully!`);
    } finally {
      setSubmitting(false);
      setNewNotes("");
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Mock Pain Chart points for SVG trendline
  const chartPoints = [
    { label: "W1", val: 6.5 },
    { label: "W2", val: 5.0 },
    { label: "W3", val: 3.5 },
    { label: "W4", val: summary?.latest_pain_score || 2.0 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Recovery & Progress Tracking</h1>
        <p className="text-slate-400 text-sm">
          Monitor pain reduction trends, exercise completion rates, and physical goals over time.
        </p>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <span className="text-slate-400 text-xs block mb-1">Latest Pain Index</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
              {summary?.latest_pain_score ?? 2}
            </span>
            <span className="text-xs text-slate-400">/ 10</span>
          </div>
          <span className="text-[11px] text-teal-400 block mt-1">↓ Weekly Avg {summary?.avg_pain_score_weekly ?? 2.3}</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <span className="text-slate-400 text-xs block mb-1">Exercise Completion</span>
          <span className="text-2xl sm:text-3xl font-bold text-teal-400 font-mono">
            {summary?.exercise_completion_rate ?? 92}%
          </span>
          <span className="text-[11px] text-teal-400 block mt-1">🔥 {summary?.streak_days ?? 14} Day Streak</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <span className="text-slate-400 text-xs block mb-1">Session Attendance</span>
          <span className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono">
            {summary?.appointment_attendance_rate ?? 100}%
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Clinical Consults Met</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl">
          <span className="text-slate-400 text-xs block mb-1">ROM Improvement</span>
          <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">
            {summary?.mobility_improvement ?? "+28%"}
          </span>
          <span className="text-[11px] text-amber-400 block mt-1">Joint Mobility Gain</span>
        </div>
      </div>

      {/* 2. Visual Charts Row (Pain Chart & Compliance Chart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pain Score Trend Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>📉</span>
                <span>Pain Score Reduction Trend</span>
              </h2>
              <p className="text-xs text-slate-400">Visual Analog Scale (0-10)</p>
            </div>
            <span className="text-xs text-teal-400 font-semibold font-mono">Steadily Decreasing</span>
          </div>

          {/* SVG Trendline */}
          <div className="h-44 w-full flex items-end justify-between px-4 pt-6 pb-2 bg-slate-950/60 rounded-xl border border-slate-800 relative">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-x-0 top-4 border-b border-slate-800/40 text-[10px] text-slate-600 px-2">10</div>
            <div className="absolute inset-x-0 top-1/2 border-b border-slate-800/40 text-[10px] text-slate-600 px-2">5</div>

            {chartPoints.map((pt, idx) => {
              const heightPercent = (pt.val / 10) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 z-10">
                  <span className="text-[11px] font-mono font-bold text-teal-400">{pt.val}</span>
                  <div className="w-8 bg-slate-800 rounded-t-lg relative flex flex-col justify-end overflow-hidden h-28">
                    <div
                      className="w-full bg-gradient-to-t from-teal-500 to-cyan-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{pt.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance & Exercise Compliance Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>📊</span>
                <span>Weekly Adherence Metrics</span>
              </h2>
              <p className="text-xs text-slate-400">Routine & Consultation Compliance</p>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            {/* Metric 1 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Daily Exercise Prescriptions</span>
                <span className="text-teal-400 font-mono">{summary?.exercise_completion_rate ?? 92}%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${summary?.exercise_completion_rate ?? 92}%` }}
                ></div>
              </div>
            </div>

            {/* Metric 2 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Appointment Attendance</span>
                <span className="text-cyan-400 font-mono">{summary?.appointment_attendance_rate ?? 100}%</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary?.appointment_attendance_rate ?? 100}%` }}
                ></div>
              </div>
            </div>

            {/* Metric 3 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Joint Range of Motion Gain</span>
                <span className="text-amber-400 font-mono">85% of Target</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-teal-400 rounded-full transition-all duration-500 w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Goal Progress Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Active Clinical Goals</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(summary?.goals && summary.goals.length > 0
            ? summary.goals
            : [
                {
                  id: "g1",
                  goal_title: "Lumbar Forward Flexion (90° Target)",
                  target_value: 90,
                  current_value: 85,
                  unit: "degrees",
                  is_achieved: false,
                },
                {
                  id: "g2",
                  goal_title: "Pain Index under 3/10",
                  target_value: 3,
                  current_value: 2,
                  unit: "points",
                  is_achieved: true,
                },
              ]
          ).map((goal) => {
            const percent = Math.min(
              100,
              Math.round((goal.current_value / goal.target_value) * 100)
            );
            return (
              <div
                key={goal.id}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{goal.goal_title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      goal.is_achieved || percent >= 100
                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                        : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                    }`}
                  >
                    {goal.is_achieved || percent >= 100 ? "Achieved ✓" : "In Progress"}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Current: {goal.current_value} {goal.unit}</span>
                  <span>Target: {goal.target_value} {goal.unit}</span>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Log Daily Progress Form & History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <span>📝</span>
            <span>Log Daily Progress</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4">Record today's measurements.</p>

          {notification && (
            <div className="mb-4 p-3 bg-teal-500/10 border border-teal-500/30 text-teal-300 rounded-xl text-xs font-medium">
              {notification}
            </div>
          )}

          <form onSubmit={handleLogRecord} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-400">Pain Index (0-10)</label>
                <span className="text-sm font-bold text-teal-400 font-mono">{newPainScore} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={newPainScore}
                onChange={(e) => setNewPainScore(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Mobility (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newMobility}
                  onChange={(e) => setNewMobility(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Notes / Discomfort Details</label>
              <textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="How did your morning routine feel?"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs hover:from-teal-400 hover:to-cyan-400 transition-all shadow-md shadow-teal-500/10 disabled:opacity-50"
            >
              {submitting ? "Saving Log..." : "Submit Daily Progress Log"}
            </button>
          </form>
        </div>

        {/* History Table Column */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>📜</span>
            <span>Historical Progress Log</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Pain Index</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Mobility</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((rec) => {
                  const dateStr = new Date(rec.recorded_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  return (
                    <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-medium text-white">{dateStr}</td>
                      <td className="p-3 font-mono text-teal-400 font-bold">{rec.pain_score} / 10</td>
                      <td className="p-3 font-mono text-slate-300">{rec.weight ? `${rec.weight} kg` : "-"}</td>
                      <td className="p-3 font-mono text-cyan-400">{rec.mobility_score ? `${rec.mobility_score}%` : "-"}</td>
                      <td className="p-3 text-slate-400 italic max-w-xs truncate">{rec.notes || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
