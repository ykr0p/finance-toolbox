import React from "react";

/**
 * Official new graphic sign of the Belarusian Ruble (BYN)
 * Approved by the National Bank of the Republic of Belarus (Resolution No. 25, Jan 27, 2026).
 * Stylized capital Cyrillic letter "Б" with central horizontal stability crossbar.
 */
export function BelarusianRubleIcon({
  className = "w-4 h-4 inline-block",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
      aria-label="Символ белорусского рубля"
    >
      {/* Outer body of letter Б with inner bowl cutout */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 24.5 10
           H 76.5
           V 19.5
           H 35
           V 44.5
           H 63
           C 75.5 44.5, 84.5 54.5, 84.5 67.2
           C 84.5 80, 75.5 90, 63 90
           H 24.5
           V 10
           Z
           M 35 53.5
           H 63
           C 70.5 53.5, 74.5 59.5, 74.5 67.2
           C 74.5 75, 70.5 81, 63 81
           H 35
           V 53.5
           Z"
      />
      {/* Central horizontal stability crossbar */}
      <rect x="15.5" y="62.5" width="39.2" height="9" rx="0.5" />
    </svg>
  );
}
