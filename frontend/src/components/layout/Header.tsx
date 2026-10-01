"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";
import {
  List,
  X,
  User,
  SignIn,
  CalendarCheck,
  FirstAid,
  Gear,
  SignOut,
  Sparkle,
} from "@phosphor-icons/react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine dashboard link based on role
  const getDashboardHref = () => {
    if (!user) return "/dashboard";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "THERAPIST") return "/therapist/dashboard";
    return "/dashboard";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#080c14]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2"
          : "bg-[#080c14]/50 backdrop-blur-md border-b border-white/[0.04] py-3.5"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Brand Logo ────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-transform group-hover:scale-105">
            <FirstAid size={22} weight="bold" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight font-display text-white group-hover:text-teal-300 transition-colors">
              {APP_NAME}
            </span>
            <span className="text-[10px] font-mono tracking-widest text-teal-400/80 uppercase">
              Clinical Rehab
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ──────────────────────────────── */}
        <nav className="hidden items-center gap-1 md:flex bg-[#0e1526]/80 p-1.5 rounded-full border border-white/[0.08] backdrop-blur-lg">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 text-xs font-medium transition-colors rounded-full ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-teal-500/20 border border-teal-400/30 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Desktop Actions & User Controls ────────────────── */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardHref()}
                className="flex items-center gap-2 rounded-xl bg-[#162035] px-3.5 py-2 text-xs font-semibold text-slate-200 border border-white/10 hover:bg-[#1f2b45] hover:border-teal-400/40 transition-all"
              >
                <Gear size={16} className="text-teal-400" />
                <span>Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-xl bg-[#162035] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 transition-colors"
              >
                <SignOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                <SignIn size={16} className="text-teal-400" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/auth/register"
                className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="flex items-center gap-1.5 relative z-10">
                  <CalendarCheck size={16} weight="bold" />
                  <span>Book Assessment</span>
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile Hamburger Button ─────────────────────────── */}
        <button
          type="button"
          aria-label="Toggle Navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-xl p-2.5 text-slate-300 bg-[#0e1526] border border-white/10 hover:bg-[#162035] md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <List size={20} />}
        </button>
      </div>

      {/* ── Mobile Navigation Drawer ─────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-white/[0.08] bg-[#080c14]/95 backdrop-blur-2xl px-4 pb-6 pt-3 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2.5">
              {user ? (
                <>
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 py-3 text-sm font-semibold"
                  >
                    <Gear size={18} />
                    <span>Go to Dashboard</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 py-3 text-sm font-medium"
                  >
                    <SignOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-[#162035] border border-white/10 py-3 text-center text-sm font-medium text-slate-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 py-3 text-center text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/20"
                  >
                    Book Clinical Assessment
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
