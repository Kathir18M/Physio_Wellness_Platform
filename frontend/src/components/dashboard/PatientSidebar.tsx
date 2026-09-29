"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/types/auth";

interface PatientSidebarProps {
  user: User | null;
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
    { label: "Overview", href: "/dashboard", icon: "📊" },
    { label: "Appointments", href: "/dashboard/appointments", icon: "📅" },
    { label: "Treatment Plan", href: "/dashboard/treatment-plan", icon: "📋" },
    { label: "Daily Exercises", href: "/dashboard/exercises", icon: "🧘‍♂️" },
    { label: "Recovery Progress", href: "/dashboard/progress", icon: "📈" },
    { label: "Notifications", href: "/dashboard/notifications", icon: "🔔", badge: "3" },
    { label: "Billing & Plans", href: "/dashboard/payments", icon: "💳" },
    { label: "My Profile", href: "/dashboard/profile", icon: "👤" },
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
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-teal-500/20">
                P
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Physio<span className="text-teal-400">Wellness</span>
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
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 font-semibold"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-slate-950 font-bold text-xs">
              {user?.email ? user.email.slice(0, 2).toUpperCase() : "PA"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.email?.split("@")[0] || "Patient Account"}
              </p>
              <p className="text-[10px] text-teal-400 font-mono capitalize">
                Role: {user?.role || "PATIENT"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
