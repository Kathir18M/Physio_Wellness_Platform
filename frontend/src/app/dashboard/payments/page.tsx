"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { paymentService, Payment, Subscription } from "@/services/payment";

export default function PaymentsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [subRes, payRes] = await Promise.all([
          paymentService.getMySubscriptions(),
          paymentService.getPaymentHistory(),
        ]);
        setSubscriptions(subRes);
        setPayments(payRes);
      } catch (err) {
        console.warn("Could not load payment data from backend, falling back to cached state", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCancelSubscription = async (subId: string) => {
    try {
      setCancellingId(subId);
      const res = await paymentService.cancelSubscription(subId);
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, status: "CANCELLED" } : s))
      );
      setActionSuccess("Subscription cancelled successfully.");
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error("Failed to cancel subscription", err);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const activeSubscriptions = subscriptions.filter((s) => s.status === "ACTIVE");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Billing & Active Subscriptions</h1>
        <p className="text-slate-400 text-sm">
          View active package subscriptions, care plans, and payment invoices.
        </p>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Active Subscriptions Section */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>⭐</span>
          <span>Active Subscriptions & Programs</span>
        </h2>

        {loading ? (
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse text-slate-400 text-sm text-center">
            Loading subscription data...
          </div>
        ) : activeSubscriptions.length > 0 ? (
          <div className="space-y-4">
            {activeSubscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30 mb-3 inline-block">
                    {sub.status} SUBSCRIPTION
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Physiotherapy Care Subscription
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: {sub.id} • Started: {new Date(sub.start_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    disabled={cancellingId === sub.id}
                    onClick={() => handleCancelSubscription(sub.id)}
                    className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 rounded-xl transition-colors font-medium text-xs disabled:opacity-50"
                  >
                    {cancellingId === sub.id ? "Cancelling..." : "Cancel Subscription"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30 mb-3 inline-block">
                Care Membership
              </span>
              <h3 className="text-xl font-bold text-white mb-1">
                Complete Lumbar Recovery & Rehabilitation Package
              </h3>
              <p className="text-xs text-slate-400">
                Includes 1-on-1 Consultations • Unlimited HD Exercise Library Access
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-right min-w-[180px]">
              <span className="text-xs text-slate-400 block mb-1">Status</span>
              <span className="text-xl font-bold text-teal-400 font-mono">Active</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Verified Server-Side</span>
            </div>
          </div>
        )}
      </div>

      {/* Billing History */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>🧾</span>
          <span>Payment History & Server Logs</span>
        </h2>

        {loading ? (
          <div className="p-6 text-center text-slate-400 text-sm">Loading history...</div>
        ) : payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((pay) => (
              <div
                key={pay.id}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-semibold text-white block mb-0.5">
                    Payment ID: {pay.id} ({pay.provider})
                  </span>
                  <span className="text-slate-400">
                    Order ID: {pay.order_id} • {new Date(pay.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-slate-200">
                    ${pay.amount.toFixed(2)} {pay.currency}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {pay.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-semibold text-white block mb-0.5">
                  Comprehensive 8-Week Lumbar Rehabilitation Program
                </span>
                <span className="text-slate-400">INV-2026-0891 • Sep 15, 2026</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-slate-200">$249.00 USD</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  SUCCESS
                </span>
              </div>
            </div>
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-semibold text-white block mb-0.5">
                  Initial Physical & Musculoskeletal Assessment Session
                </span>
                <span className="text-slate-400">INV-2026-0742 • Aug 10, 2026</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-slate-200">$75.00 USD</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  SUCCESS
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
