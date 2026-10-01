"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User as UserType } from "@/types/auth";
import {
  ChartLineUp,
  CalendarCheck,
  ClipboardText,
  Barbell,
  TrendUp,
  BellRinging,
  CreditCard,
  User,
  SignOut,
  FirstAid,
  X,
} from "@phosphor-icons/react";

interface PatientSidebarProps {
  user: UserType | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const PatientSidebar: React.FC<PatientSidebarProps> = ({
  user,
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    router.push("/auth/login");
  };

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: <ChartLineUp size={18} /> },
    { label: "Appointments", href: "/dashboard/appointments", icon: <CalendarCheck size={18} /> },
    { label: "Treatment Plan", href: "/dashboard/treatment-plan", icon: <ClipboardText size={18} /> },
    { label: "Daily Exercises", href: "/dashboard/exercises", icon: <Barbell size={18} /> },
    { label: "Recovery Progress", href: "/dashboard/progress", icon: <TrendUp size={18} /> },
    { label: "Notifications", href: "/dashboard/notifications", icon: <BellRinging size={18} />, badge: "2" },
    { label: "Billing & Plans", href: "/dashboard/payments", icon: <CreditCard size={18} /> },
    { label: "My Profile", href: "/dashboard/profile", icon: <User size={18} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#080c14]/80 backdrop-blur-md z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0e1526] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-white/[0.08]">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-teal-500/20">
                <FirstAid size={20} weight="bold" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold font-display text-white">
                  Physio<span className="text-teal-400">Well</span>
                </span>
                <span className="text-[10px] font-mono text-teal-400/80 uppercase">Patient Portal</span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 font-semibold shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-teal-400" : "text-slate-400"}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-full bg-teal-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Card & Sign Out */}
        <div className="p-4 border-t border-white/[0.08] bg-[#080c14]/40">
          <div className="flex items-center gap-3 mb-3 p-2.5 rounded-2xl bg-[#162035] border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs font-mono">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "PA"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate font-display">
                {user?.email?.split("@")[0] || "Patient Portal"}
              </p>
              <p className="text-[10px] text-teal-400 font-mono capitalize">
                {user?.role || "PATIENT"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <SignOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
