"use client";

import React from "react";

export default function AdminOrdersPage() {
  const orders = [
    { id: "ord-8801", patient: "John Doe", amount: "$249.00 USD", program: "Comprehensive 8-Week Lumbar Program", status: "PAID", date: "Sep 15, 2026" },
    { id: "ord-8802", patient: "Emily Smith", amount: "$199.00 USD", program: "Postural Realignment Care Plan", status: "PAID", date: "Sep 20, 2026" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Orders Management</h1>
        <p className="text-slate-400 text-sm">Review customer checkout orders, program purchases, and fulfillment states.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Order ID</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Program</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono font-bold text-amber-400">{o.id}</td>
                <td className="p-4 font-medium text-white">{o.patient}</td>
                <td className="p-4 text-slate-300">{o.program}</td>
                <td className="p-4 font-mono font-bold text-emerald-400">{o.amount}</td>
                <td className="p-4 text-slate-400">{o.date}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {o.status}
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
