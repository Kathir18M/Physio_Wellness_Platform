"use client";

import React from "react";

export default function AdminContentPage() {
  const cmsSections = [
    { name: "Homepage Hero & Banners", type: "MARKETING", status: "PUBLISHED" },
    { name: "FAQ & Knowledge Base", type: "CONTENT", status: "PUBLISHED" },
    { name: "Clinical Disclaimer & Terms", type: "LEGAL", status: "PUBLISHED" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">CMS & Content Management</h1>
        <p className="text-slate-400 text-sm">Manage public banner announcements, landing page sections, and legal disclaimers.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="p-4">Content Section</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {cmsSections.map((sec, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-semibold text-white">{sec.name}</td>
                <td className="p-4 font-mono font-bold text-amber-400">{sec.type}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                    {sec.status}
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
