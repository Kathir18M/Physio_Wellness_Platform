"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ─────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition-shadow group-hover:shadow-teal-500/40">
            PW
          </span>
          <span className="text-lg font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────── */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)]/70 transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── CTA / Auth buttons ───────────────────────────── */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--foreground)]/70 transition-colors hover:text-[var(--foreground)]"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-teal-500/40 hover:brightness-110"
          >
            Get Started
          </Link>
        </div>

        {/* ── Mobile hamburger ─────────────────────────────── */}
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-[var(--foreground)]/70 transition-colors hover:bg-white/5 md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[var(--background)] px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--foreground)]/70 transition-colors hover:bg-white/5 hover:text-[var(--foreground)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2.5 text-center text-sm font-medium text-[var(--foreground)]/70 transition-colors hover:text-[var(--foreground)]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-teal-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
