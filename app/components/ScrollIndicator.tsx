"use client";

import React from "react";

interface ScrollIndicatorProps {
  visible: boolean;
}

export default function ScrollIndicator({ visible }: ScrollIndicatorProps) {
  // Array of 3 items for sequential animation
  const pointers = [0, 1, 2];

  return (
    <div
      className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-40 transition-all duration-1000 flex flex-col items-center gap-1.5 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
    >
      {/* Decorative vertical line */}
      <div className="w-px h-12 bg-gradient-to-b from-transparent via-neon-blue/40 to-neon-blue rounded-full mb-1 opacity-50"></div>

      {/* 3 Sequential glowing pointers */}
      <div className="flex flex-col items-center -space-y-3">
        {pointers.map((i) => (
          <svg
            key={i}
            className="w-8 h-8 text-neon-blue animate-arrow-flow"
            style={{
              animationDelay: `${i * 0.4}s`,
              marginTop: i === 0 ? "0" : "-12px"
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ))}
      </div>
    </div>
  );
}
