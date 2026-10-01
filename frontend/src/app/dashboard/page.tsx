"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { appointmentService } from "@/services/appointment";
import { Appointment } from "@/types/appointment";
import { AppointmentCard } from "@/components/dashboard/AppointmentCard";
import { TreatmentPlanCard } from "@/components/dashboard/TreatmentPlanCard";
import { ExerciseCard, ExerciseItem } from "@/components/dashboard/ExerciseCard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { NotificationCard, NotificationItem } from "@/components/dashboard/NotificationCard";
import { AIAssistantWidget } from "@/components/dashboard/AIAssistantWidget";
import {
  Sparkle,
  CalendarCheck,
  Barbell,
  BellRinging,
  ArrowRight,
  User,
  SealCheck,
} from "@phosphor-icons/react";

export default function DashboardOverviewPage() {
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock exercise routine
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
  ]);

  // Mock notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Upcoming Video Consultation",
      message: "Session with Dr. Sarah Jenkins starts tomorrow at 10:00 AM.",
      timestamp: "10 mins ago",
      read: false,
      type: "APPOINTMENT",
    },
    {
      id: "notif-2",
      title: "New Exercise Module Assigned",
      message: "Week 4 Lumbar Core Stability exercises have been added to your plan.",
      timestamp: "2 hours ago",
      read: false,
      type: "EXERCISE",
    },
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      try {
        const apts = await appointmentService.getMyAppointable();
        if (isMounted && apts && apts.length > 0) {
          const upcoming = apts.find(
            (a) => a.status === "CONFIRMED" || a.status === "PENDING"
          );
          setUpcomingAppointment(upcoming || apts[0]);
        }
      } catch (err) {
        if (isMounted) {
          setUpcomingAppointment({
            id: "apt-101",
            patient_id: "patient-1",
            therapist_id: "dr-sarah-jenkins",
            clinic_id: null,
            appointment_type: "ONLINE",
            start_time: new Date(Date.now() + 86400000).toISOString(),
            end_time: new Date(Date.now() + 86400000 + 2700000).toISOString(),
            status: "CONFIRMED",
            notes: "Week 4 Lumbar Spine Assessment & Range of Motion Evaluation",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAppointments();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleExercise = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, completed: !ex.completed } : ex))
    );
  };

  const handleMarkNotifRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono">
            <Sparkle size={14} className="text-teal-400" />
            <span>Welcome Back to Care</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Your Recovery Progress is on Track!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            You&apos;ve completed <span className="text-teal-300 font-mono font-bold">14 consecutive days</span> of your lumbar rehabilitation routine. Keep up the great momentum today!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/dashboard/exercises"
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold rounded-xl text-xs hover:brightness-110 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <span>Start Today&apos;s Exercises (17 mins)</span>
              <ArrowRight size={14} weight="bold" />
            </Link>
            <Link
              href="/booking"
              className="px-5 py-2.5 bg-[#162035] border border-white/10 text-slate-200 font-semibold rounded-xl text-xs hover:bg-[#1f2b45] transition-all"
            >
              Book Follow-up Session
            </Link>
          </div>
        </div>
      </div>

      {/* 2. AI Motion & Posture Assistant */}
      <AIAssistantWidget />

      {/* 3. Recovery Metrics */}
      <ProgressCard
        painScore={2}
        romImprovement="+28%"
        complianceRate={92}
        streakDays={14}
      />

      {/* 4. Two-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Upcoming Session & Daily Exercises */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointment */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                <CalendarCheck size={18} className="text-teal-400" />
                <span>Next Scheduled Session</span>
              </h2>
              <Link
                href="/dashboard/appointments"
                className="text-xs text-teal-400 hover:underline font-mono"
              >
                View All Appointments →
              </Link>
            </div>

            <AppointmentCard appointment={upcomingAppointment} />
          </div>

          {/* Today's Exercise Routine */}
          <div className="glass-card rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                  <Barbell size={18} className="text-teal-400" />
                  <span>Today&apos;s Exercise Plan</span>
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Target: 3 exercises • 17 minutes total
                </p>
              </div>

              <Link
                href="/dashboard/exercises"
                className="text-xs text-teal-400 hover:underline font-mono"
              >
                Full Library →
              </Link>
            </div>

            <div className="space-y-3">
              {exercises.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  onToggleComplete={handleToggleExercise}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Treatment Plan Summary & Assigned Therapist */}
        <div className="space-y-8">
          {/* Treatment Plan Summary */}
          <TreatmentPlanCard
            planName="Lumbar Spine Recovery Protocol"
            progressPercent={65}
            currentWeek={4}
            totalWeeks={8}
            focusArea="Core Stability & Decompression"
            nextMilestone="90° Flexion without Pain"
          />

          {/* Assigned Lead Specialist */}
          <div className="glass-card rounded-3xl p-6 border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-4">
              Assigned Lead Specialist
            </span>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 text-slate-950 font-bold text-lg flex items-center justify-center font-display shadow-lg shadow-teal-500/10 flex-shrink-0">
                SJ
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-bold font-display text-white">Dr. Sarah Jenkins, MPT</h4>
                  <SealCheck size={16} className="text-teal-400" weight="fill" />
                </div>
                <p className="text-xs text-teal-300 font-medium">Senior Musculoskeletal Specialist</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">12+ Yrs Exp • Sports Rehab Lead</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed italic bg-[#080c14]/60 p-3 rounded-xl border border-white/5">
              &ldquo;Your spinal extension angles have improved by 14 degrees over the past two weeks. Maintain your core bracing during daily sitting.&rdquo;
            </p>

            <Link
              href="/booking"
              className="w-full py-2.5 bg-[#162035] border border-white/10 text-slate-200 text-xs font-semibold rounded-xl hover:bg-[#1f2b45] transition-all text-center block"
            >
              Message Specialist
            </Link>
          </div>

          {/* Recent Updates */}
          <div className="glass-card rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <BellRinging size={16} className="text-teal-400" />
                <span>Recent Updates</span>
              </h3>
              <Link
                href="/dashboard/notifications"
                className="text-xs text-teal-400 hover:underline font-mono"
              >
                See All
              </Link>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  onMarkAsRead={handleMarkNotifRead}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
