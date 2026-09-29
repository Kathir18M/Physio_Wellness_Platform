"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/auth";

interface TherapistSidebarProps {
  user: User | null;
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
    { label: "Dashboard", href: "/therapist/dashboard", icon: "📊" },
    { label: "My Patients", href: "/therapist/patients", icon: "👥" },
    { label: "Appointments Schedule", href: "/therapist/appointments", icon: "📅" },
    { label: "Clinical Intake Assessments", href: "/therapist/assessments", icon: "📝" },
    { label: "Treatment Protocols", href: "/therapist/treatment-plans", icon: "📋" },
    { label: "Exercise Assignments", href: "/therapist/exercises", icon: "🧘‍♂️" },
    { label: "Clinical Reports", href: "/therapist/reports", icon: "📈" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800">
            <Link href="/therapist/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                Rx
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Practitioner<span className="text-cyan-400">Portal</span>
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Practitioner User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold text-xs">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "DR"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.email?.split("@")[0] || "Dr. Sarah Jenkins"}
              </p>
              <p className="text-[10px] text-cyan-400 font-mono capitalize">
                Role: {user?.role || "THERAPIST"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
          >
            <span>🚪</span>
            <span>Sign Out Practitioner</span>
          </button>
        </div>
      </aside>
    </>
  );
};
