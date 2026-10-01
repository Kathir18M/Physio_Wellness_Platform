"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Users,
  UserCheck,
  Buildings,
  Target,
  Barbell,
  CalendarCheck,
  ShoppingCart,
  CreditCard,
  Star,
  FileText,
  Gear,
  ArrowLeft,
} from "@phosphor-icons/react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: <ShieldCheck size={18} /> },
    { label: "Users & RBAC", href: "/admin/users", icon: <Users size={18} /> },
    { label: "Patients", href: "/admin/patients", icon: <UserCheck size={18} /> },
    { label: "Therapists", href: "/admin/therapists", icon: <Users size={18} /> },
    { label: "Clinics", href: "/admin/clinics", icon: <Buildings size={18} /> },
    { label: "Programs", href: "/admin/programs", icon: <Target size={18} /> },
    { label: "Exercise Library", href: "/admin/exercises", icon: <Barbell size={18} /> },
    { label: "Appointments", href: "/admin/appointments", icon: <CalendarCheck size={18} /> },
    { label: "Orders", href: "/admin/orders", icon: <ShoppingCart size={18} /> },
    { label: "Payments", href: "/admin/payments", icon: <CreditCard size={18} /> },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: <Star size={18} /> },
    { label: "Reviews", href: "/admin/reviews", icon: <Star size={18} /> },
    { label: "Reports & Audit", href: "/admin/reports", icon: <FileText size={18} /> },
    { label: "CMS Content", href: "/admin/content", icon: <Gear size={18} /> },
  ];

  return (
    <aside className="w-64 bg-[#0e1526] border-r border-white/[0.08] min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-white/[0.08]">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
          <ShieldCheck size={20} weight="fill" />
        </div>
        <div>
          <h2 className="text-xs font-bold font-display text-white tracking-widest uppercase">ADMIN PORTAL</h2>
          <span className="text-[10px] text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
            RBAC ENFORCED
          </span>
        </div>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto font-mono text-xs">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={isActive ? "text-amber-400" : "text-slate-400"}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-white/[0.08]">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-2 bg-[#162035] border border-white/10 hover:bg-[#1f2b45] text-slate-300 hover:text-white text-xs font-mono rounded-xl transition-all"
        >
          <ArrowLeft size={14} />
          <span>Patient Portal</span>
        </Link>
      </div>
    </aside>
  );
}
