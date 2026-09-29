"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth";
import { ApiRequestError } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tokenFound, setTokenFound] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setTokenFound(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword({ email });
      setSuccessMessage(response.message);
      if (response.token) {
        setTokenFound(response.token);
      }
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800/80 p-8 shadow-2xl backdrop-blur-xl border border-slate-700/50">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white">Forgot Password?</h2>
          <p className="mt-2 text-sm text-slate-400">Enter your account email to receive reset instructions</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-300 space-y-2">
            <p>{successMessage}</p>
            {tokenFound && (
              <div className="mt-2 rounded bg-slate-900/80 p-2.5 font-mono text-xs text-indigo-300 break-all border border-slate-700">
                <span className="text-slate-400 block mb-1">Development Reset Token:</span>
                {tokenFound}
                <div className="mt-2">
                  <Link href={`/auth/reset-password?token=${tokenFound}`} className="text-indigo-400 underline hover:text-indigo-200">
                    Proceed to Reset Password →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300">Registered Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-1 block w-full rounded-lg bg-slate-900/60 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Sending Request..." : "Send Reset Instructions"}
          </button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Remember your password?{" "}
          <Link href="/auth/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
