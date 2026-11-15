import React from "react";

/**
 * Official new graphic sign of the Belarusian Ruble (BYN)
 * Approved by the National Bank of the Republic of Belarus (Resolution No. 25, Jan 27, 2026)
 * Represents capital Cyrillic letter "Б" with a central horizontal strike-through line.
 */
export function BelarusianRubleIcon({
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
      aria-label="Символ белорусского рубля (новый знак)"
    >
      {/* Top horizontal stroke of 'Б' */}
      <path d="M6.5 4h10.5" />
      {/* Vertical spine of 'Б' */}
      <path d="M7.5 4v16" />
      {/* Lower round bowl of 'Б' */}
      <path d="M7.5 11h6a4.5 4.5 0 0 1 0 9h-6" />
      {/* Central horizontal stroke-through bar (stability symbol) */}
      <path d="M3.5 11h8.5" />
    </svg>
  );
}
