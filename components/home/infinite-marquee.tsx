"use client";

import React from "react";

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export function InfiniteMarquee({
  children,
  direction = "left",
  className = "",
}: InfiniteMarqueeProps) {
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className={`relative overflow-hidden w-full select-none py-2 ${className}`}>
      {/* Soft Gradient Mask Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Marquee Track (Duplicated for seamless loop) */}
      <div className={`flex gap-6 ${animClass}`}>
        <div className="flex gap-6 shrink-0">{children}</div>
        <div className="flex gap-6 shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
