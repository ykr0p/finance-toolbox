import React from "react";

export function EuroIcon({
  className = "w-4 h-4 inline-block",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Евро (€)"
    >
      {/* Outer C curve */}
      <path d="M19 6a8 8 0 0 0-14 6 8 8 0 0 0 14 6" />
      {/* Upper crossbar */}
      <path d="M3.5 10h10.5" />
      {/* Lower crossbar */}
      <path d="M3.5 14h10.5" />
    </svg>
  );
}
