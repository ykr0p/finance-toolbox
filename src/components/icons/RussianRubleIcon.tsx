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
      {/* Upper loop of P connecting to vertical stem */}
      <path d="M6 11h8a4 4 0 0 0 0-8H9v18" />
      {/* Parallel horizontal crossbar */}
      <path d="M6 15h8" />
    </svg>
  );
}
