"use client";

import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Control Center</span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-amber-400">System Administration</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full font-mono text-[10px] font-bold">
              SUPER_ADMIN
            </span>
            <span className="text-slate-400 font-medium">admin@physiowellness.com</span>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
