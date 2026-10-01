"use client";

import React from "react";
import Link from "next/link";
import { motion, HTMLMotionProps } from "motion/react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a10] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white font-semibold shadow-[0_4px_20px_-4px_rgba(16,185,129,0.35)] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.5)] border border-emerald-400/30",
    secondary:
      "bg-[#131f30] hover:bg-[#1b2a40] text-slate-100 border border-white/10 shadow-lg shadow-black/20",
    outline:
      "border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400/60",
    ghost:
      "text-slate-300 hover:text-white hover:bg-white/5",
    destructive:
      "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20",
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5 font-semibold",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={combinedClasses}
        >
          {content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      disabled={disabled || isLoading}
      className={combinedClasses}
      {...(props as HTMLMotionProps<"button">)}
    >
      {content}
    </motion.button>
  );
};
