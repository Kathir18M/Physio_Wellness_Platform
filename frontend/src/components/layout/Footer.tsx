import Link from "next/link";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Brand ───────────────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 text-sm font-bold text-white">
                PW
              </span>
              <span className="text-lg font-semibold">{APP_NAME}</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]/50">
              Your digital partner for personalized physiotherapy and wellness
              care. Evidence-based recovery, guided by licensed professionals.
            </p>
          </div>

          {/* ── Quick Links ────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]/40">
              Platform
            </h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--foreground)]/60 transition-colors hover:text-[var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ──────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]/40">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[var(--foreground)]/60 transition-colors hover:text-[var(--foreground)]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[var(--foreground)]/60 transition-colors hover:text-[var(--foreground)]"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Contact ────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--foreground)]/40">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="mailto:hello@physiowell.app"
                  className="text-sm text-[var(--foreground)]/60 transition-colors hover:text-[var(--foreground)]"
                >
                  hello@physiowell.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Copyright bar ──────────────────────────────────── */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-[var(--foreground)]/40">
          &copy; {currentYear} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
