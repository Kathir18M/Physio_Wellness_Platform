"use client";

import React from "react";
import Link from "next/link";
import { User } from "@/types/auth";

interface DashboardHeaderProps {
  title: string;
  user: User | null;
  onOpenMobileSidebar?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  user,
  onOpenMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
          aria-label="Toggle Navigation"
        >
          ☰
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Book CTA */}
        <Link
          href="/booking"
          className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold hover:bg-teal-500/20 transition-all items-center gap-1.5"
        >
          <span>+</span>
          <span>Book Session</span>
        </Link>

        {/* Notifications Icon */}
        <Link
          href="/dashboard/notifications"
          className="relative p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 border border-slate-700 transition-colors"
          aria-label="Notifications"
        >
          <span>🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
        </Link>

        {/* User Pill */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
            {user?.email ? user.email.slice(0, 2).toUpperCase() : "PA"}
          </div>
          <span className="hidden md:inline text-xs font-medium text-slate-200 pr-1">
            {user?.email?.split("@")[0] || "Account"}
          </span>
        </Link>
      </div>
    </header>
  );
};
