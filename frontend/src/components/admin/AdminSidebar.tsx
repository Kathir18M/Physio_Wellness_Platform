"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: "📊" },
    { label: "Users & RBAC", href: "/admin/users", icon: "👥" },
    { label: "Patients", href: "/admin/patients", icon: "🤕" },
    { label: "Therapists", href: "/admin/therapists", icon: "👨‍⚕️" },
    { label: "Clinics", href: "/admin/clinics", icon: "🏥" },
    { label: "Programs", href: "/admin/programs", icon: "🎯" },
    { label: "Exercise Library", href: "/admin/exercises", icon: "🏋️" },
    { label: "Appointments", href: "/admin/appointments", icon: "📅" },
    { label: "Orders", href: "/admin/orders", icon: "🛒" },
    { label: "Payments", href: "/admin/payments", icon: "💳" },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: "⭐" },
    { label: "Reviews", href: "/admin/reviews", icon: "⭐" },
    { label: "Reports & Audit", href: "/admin/reports", icon: "📑" },
    { label: "CMS Content", href: "/admin/content", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
          🛡️
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">ADMIN PORTAL</h2>
          <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
            RBAC ENFORCED
          </span>
        </div>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white text-xs rounded-xl font-medium transition-colors"
        >
          <span>←</span>
          <span>Patient Portal</span>
        </Link>
      </div>
    </aside>
  );
}
