"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User as UserType } from "@/types/auth";
import {
  ChartLineUp,
  Users,
  CalendarCheck,
  ClipboardText,
  Notebook,
  Barbell,
  FileText,
  SignOut,
  FirstAid,
  X,
} from "@phosphor-icons/react";

interface TherapistSidebarProps {
  user: UserType | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const TherapistSidebar: React.FC<TherapistSidebarProps> = ({
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
    { label: "Dashboard", href: "/therapist/dashboard", icon: <ChartLineUp size={18} /> },
    { label: "My Patients", href: "/therapist/patients", icon: <Users size={18} /> },
    { label: "Schedule", href: "/therapist/appointments", icon: <CalendarCheck size={18} /> },
    { label: "Intake Assessments", href: "/therapist/assessments", icon: <Notebook size={18} /> },
    { label: "Treatment Plans", href: "/therapist/treatment-plans", icon: <ClipboardText size={18} /> },
    { label: "Exercise Library", href: "/therapist/exercises", icon: <Barbell size={18} /> },
    { label: "Clinical Reports", href: "/therapist/reports", icon: <FileText size={18} /> },
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-cyan-500/20">
                <FirstAid size={20} weight="bold" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold font-display text-white">
                  Practitioner<span className="text-cyan-400">Portal</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400/80 uppercase">Clinical Suite</span>
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
                item.href === "/therapist/dashboard"
                  ? pathname === "/therapist/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-semibold shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? "text-cyan-400" : "text-slate-400"}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Practitioner User Profile Card & Sign Out */}
        <div className="p-4 border-t border-white/[0.08] bg-[#080c14]/40">
          <div className="flex items-center gap-3 mb-3 p-2.5 rounded-2xl bg-[#162035] border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-slate-950 font-bold text-xs font-mono">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "DR"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate font-display">
                {user?.email?.split("@")[0] || "Dr. Sarah Jenkins"}
              </p>
              <p className="text-[10px] text-cyan-400 font-mono capitalize">
                {user?.role || "THERAPIST"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <SignOut size={16} />
            <span>Sign Out Practitioner</span>
          </button>
        </div>
      </aside>
    </>
  );
};
