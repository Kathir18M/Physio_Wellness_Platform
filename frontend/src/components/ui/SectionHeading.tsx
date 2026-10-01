"use client";

import React from "react";
import { motion } from "motion/react";

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  description,
  centered = true,
  align,
  className = "",
}) => {
  const alignment = align || (centered ? "center" : "left");

  const alignStyles = {
    left: "text-left max-w-2xl",
    center: "text-center max-w-3xl mx-auto",
    right: "text-right max-w-2xl ml-auto",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`space-y-4 ${alignStyles[alignment]} ${className}`}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3.5 py-1 text-xs font-mono font-medium tracking-wider text-teal-300 border border-teal-500/20 shadow-sm">
          <span className="flex h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
          {badge}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.15]">
        {title}
      </h2>

      {description && (
        <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-[65ch] text-balance">
          {description}
        </p>
      )}
    </motion.div>
  );
};
