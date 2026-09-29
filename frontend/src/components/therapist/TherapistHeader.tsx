"use client";

import React from "react";
import Link from "next/link";
import { User } from "@/types/auth";

interface TherapistHeaderProps {
  title: string;
  user: User | null;
  onOpenMobileSidebar?: () => void;
}

export const TherapistHeader: React.FC<TherapistHeaderProps> = ({
  title,
  user,
  onOpenMobileSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
          aria-label="Toggle Practitioner Navigation"
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
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          Practitioner Status: Active
        </span>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800 border border-slate-700/80">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
            {user?.email ? user.email.slice(0, 2).toUpperCase() : "DR"}
          </div>
          <span className="hidden md:inline text-xs font-medium text-slate-200 pr-1">
            {user?.email?.split("@")[0] || "Dr. Sarah Jenkins"}
          </span>
        </div>
      </div>
    </header>
  );
};
