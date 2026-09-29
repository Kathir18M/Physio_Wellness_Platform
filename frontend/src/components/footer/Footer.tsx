import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-white">Physio<span className="text-teal-400">Well</span></span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              PhysioWell is a leading digital physiotherapy and holistic wellness platform providing evidence-based rehabilitation and personalized recovery care.
            </p>
            <div className="flex gap-4 text-xs text-slate-500">
              <span>© 2026 PhysioWell Inc. All rights reserved.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-teal-400 transition-colors">Services</Link></li>
              <li><Link href="/programs" className="hover:text-teal-400 transition-colors">Rehab Programs</Link></li>
              <li><Link href="/physiotherapy" className="hover:text-teal-400 transition-colors">Physiotherapy</Link></li>
              <li><Link href="/experts" className="hover:text-teal-400 transition-colors">Our Specialists</Link></li>
            </ul>
          </div>

          {/* Care Locations */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Locations</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/clinics" className="hover:text-teal-400 transition-colors">Central Clinic</Link></li>
              <li><Link href="/clinics" className="hover:text-teal-400 transition-colors">Sports Rehab Hub</Link></li>
              <li><Link href="/services" className="hover:text-teal-400 transition-colors">Tele-Rehab Nationwide</Link></li>
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Support & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-teal-400 transition-colors">Help & FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Care Team</Link></li>
              <li><Link href="/testimonials" className="hover:text-teal-400 transition-colors">Patient Stories</Link></li>
              <li><span className="text-slate-600">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
