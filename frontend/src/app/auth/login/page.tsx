"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import {
  FirstAid,
  LockKey,
  EnvelopeSimple,
  ArrowRight,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please verify your credentials and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#080c14] px-4 py-12 relative overflow-hidden">
      {/* Background ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-8 glass-card rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 relative z-10"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow-[0_0_24px_rgba(45,212,191,0.3)]">
            <FirstAid size={26} weight="bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your recovery portal & treatment telemetry
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300">
            <WarningCircle size={18} className="flex-shrink-0 mt-0.5" weight="fill" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <EnvelopeSimple size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl bg-[#080c14]/80 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-mono text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <LockKey size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl bg-[#080c14]/80 border border-white/10 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full"
            rightIcon={<ArrowRight size={16} weight="bold" />}
          >
            Sign In to Account
          </Button>
        </form>

        <div className="pt-4 border-t border-white/[0.06] text-center text-xs text-slate-400">
          Don&apos;t have a patient account yet?{" "}
          <Link href="/auth/register" className="font-bold text-teal-300 hover:underline">
            Register & Book Assessment
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
