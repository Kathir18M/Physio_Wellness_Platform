"use client";

import React from "react";

export default function AdminPaymentsPage() {
  const payments = [
    { id: "pay-901", provider: "MOCK_GATEWAY", providerTxId: "tx_mock_881", amount: "$249.00 USD", verifiedServerSide: true, status: "SUCCESS" },
    { id: "pay-902", provider: "MOCK_GATEWAY", providerTxId: "tx_mock_882", amount: "$199.00 USD", verifiedServerSide: true, status: "SUCCESS" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Payment Verifications & Audit</h1>
        <p className="text-slate-400 text-sm">Server-verified payment transaction history, provider webhooks, and refunds.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Payment ID</th>
              <th className="p-4">Provider Tx ID</th>
              <th className="p-4">Provider</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Verification</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono font-bold text-amber-400">{p.id}</td>
                <td className="p-4 font-mono text-slate-300">{p.providerTxId}</td>
                <td className="p-4 font-mono text-slate-400">{p.provider}</td>
                <td className="p-4 font-mono font-bold text-emerald-400">{p.amount}</td>
                <td className="p-4 text-teal-400 font-semibold">✓ Server Verified</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
