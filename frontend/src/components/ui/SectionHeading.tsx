import React from "react";

export interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  description,
  centered = true,
}) => {
  return (
    <div className={`space-y-3 ${centered ? "text-center max-w-3xl mx-auto" : "max-w-2xl"}`}>
      {badge && (
        <span className="inline-block rounded-full bg-teal-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-400 border border-teal-500/20">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base text-slate-400 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};
