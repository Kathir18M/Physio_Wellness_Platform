"use client";

import React from "react";

export default function AdminReviewsPage() {
  const reviews = [
    { id: "rev-1", author: "John D.", rating: 5, comment: "Exceptional lumbar rehabilitation program! Dr. Sarah Jenkins helped me regain pain-free mobility.", status: "APPROVED" },
    { id: "rev-2", author: "Maria G.", rating: 5, comment: "Clear video instructions and seamless online video consultations.", status: "APPROVED" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Patient Testimonials & Reviews</h1>
        <p className="text-slate-400 text-sm">Moderate public reviews, clinical ratings, and testimonial visibility.</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{r.author}</span>
              <span className="text-amber-400 font-bold">{"⭐".repeat(r.rating)} ({r.rating}.0)</span>
            </div>
            <p className="text-slate-300 italic">"{r.comment}"</p>
            <div className="pt-2 flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30 font-bold">
                {r.status}
              </span>
              <button className="text-slate-400 hover:text-rose-400 font-medium">Remove Review</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
