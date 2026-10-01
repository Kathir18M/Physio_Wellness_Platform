import Link from "next/link";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import {
  FirstAid,
  ShieldCheck,
  EnvelopeSimple,
  PhoneCall,
  MapPin,
  LockKey,
} from "@phosphor-icons/react/dist/ssr";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.08] bg-[#05080e] relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* ── Brand Summary ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(45,212,191,0.25)]">
                <FirstAid size={22} weight="bold" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight font-display text-white">
                  {APP_NAME}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-teal-400/80 uppercase">
                  Digital Physiotherapy
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Clinical-grade digital physical therapy, biomechanical motion assessment, and personalized recovery roadmaps guided by licensed specialists.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 text-teal-400 font-mono">
                <ShieldCheck size={16} />
                <span>HIPAA Compliant Care</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                <LockKey size={16} />
                <span>256-Bit Encrypted Telehealth</span>
              </div>
            </div>
          </div>

          {/* ── Platform Links ───────────────────────────────── */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-4">
              Platform Pathways
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Rehabilitation Programs ─────────────────────── */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-4">
              Care Programs
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/programs/spinal-lumbar-rehab" className="hover:text-teal-300 transition-colors">
                  Lumbar Spine Decompression
                </Link>
              </li>
              <li>
                <Link href="/programs/knee-acl-rehabilitation" className="hover:text-teal-300 transition-colors">
                  Knee & ACL Reconstruction
                </Link>
              </li>
              <li>
                <Link href="/programs/cervical-posture-correction" className="hover:text-teal-300 transition-colors">
                  Cervical Posture Protocol
                </Link>
              </li>
              <li>
                <Link href="/programs/shoulder-rotator-cuff" className="hover:text-teal-300 transition-colors">
                  Rotator Cuff Mobility
                </Link>
              </li>
              <li>
                <Link href="/programs/sports-injury-recovery" className="hover:text-teal-300 transition-colors">
                  Sports Performance Rehab
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Clinical Support & Contact ──────────────────── */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold mb-4">
              Clinical Support
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <EnvelopeSimple size={16} className="text-teal-400 flex-shrink-0" />
                <a href="mailto:care@physiowell.app" className="hover:text-white transition-colors">
                  care@physiowell.app
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall size={16} className="text-teal-400 flex-shrink-0" />
                <span>+1 (800) 555-REHAB</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-400 flex-shrink-0 mt-0.5" />
                <span>Medical Arts Center, Suite 400, Boston, MA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Copyright & Legal Bar ──────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {currentYear} {APP_NAME} Health Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-200 transition-colors">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-slate-200 transition-colors">
              Clinical Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
