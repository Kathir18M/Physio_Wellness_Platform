"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/api-client";
import { UserRole } from "@/types/auth";
import { Button } from "@/components/ui/Button";
import {
  FirstAid,
  User,
  EnvelopeSimple,
  Phone,
  LockKey,
  ArrowRight,
  WarningCircle,
  UserGear,
} from "@phosphor-icons/react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("PATIENT");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        role,
      });

      if (role === "THERAPIST") {
        router.push("/therapist/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please verify details and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#080c14] px-4 py-12 relative overflow-hidden">
      {/* Background ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg space-y-7 glass-card rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow-[0_0_24px_rgba(45,212,191,0.3)]">
            <FirstAid size={26} weight="bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-400">
            Join PhysioWell for evidence-based digital & hybrid rehabilitation
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300">
            <WarningCircle size={18} className="flex-shrink-0 mt-0.5" weight="fill" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Account Role Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3 bg-[#080c14]/80 p-1.5 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setRole("PATIENT")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-mono font-semibold transition-all ${
                  role === "PATIENT"
                    ? "bg-teal-500/20 border border-teal-400/40 text-teal-300 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User size={16} />
                <span>Patient Account</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("THERAPIST")}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-mono font-semibold transition-all ${
                  role === "THERAPIST"
                    ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UserGear size={16} />
                <span>Practitioner Account</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1 uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sarah"
                className="block w-full rounded-xl bg-[#080c14]/80 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1 uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Jenkins"
                className="block w-full rounded-xl bg-[#080c14]/80 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@example.com"
              className="block w-full rounded-xl bg-[#080c14]/80 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-300 mb-1 uppercase tracking-wider">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 234-5678"
              className="block w-full rounded-xl bg-[#080c14]/80 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 chars"
                className="block w-full rounded-xl bg-[#080c14]/80 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="block w-full rounded-xl bg-[#080c14]/80 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full"
              rightIcon={<ArrowRight size={16} weight="bold" />}
            >
              Complete Account Registration
            </Button>
          </div>
        </form>

        <div className="pt-3 border-t border-white/[0.06] text-center text-xs text-slate-400">
          Already registered?{" "}
          <Link href="/auth/login" className="font-bold text-teal-300 hover:underline">
            Sign In Here
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
