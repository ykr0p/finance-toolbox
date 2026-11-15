import React from "react";

export function RussianRubleIcon({
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
      aria-label="Российский рубль (₽)"
    >
      {/* Vertical spine */}
      <path d="M7 3v18" />
      {/* Upper loop of P */}
      <path d="M7 4h6.5a4.5 4.5 0 0 1 0 9H7" />
      {/* Horizontal stroke */}
      <path d="M4 14h9" />
    </svg>
  );
}
