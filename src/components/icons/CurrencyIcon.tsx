import React from "react";
import { CurrencyCode } from "@/types/fire";
import { RussianRubleIcon } from "./RussianRubleIcon";
import { DollarIcon } from "./DollarIcon";
import { EuroIcon } from "./EuroIcon";
import { BelarusianRubleIcon } from "./BelarusianRubleIcon";

interface CurrencyIconProps {
  currency: CurrencyCode;
  className?: string;
}

export function CurrencyIcon({
  currency,
  className = "w-4 h-4 inline-block",
}: CurrencyIconProps) {
  switch (currency) {
    case "RUB":
      return <RussianRubleIcon className={className} />;
    case "USD":
      return <DollarIcon className={className} />;
    case "EUR":
      return <EuroIcon className={className} />;
    case "BYN":
      return <BelarusianRubleIcon className={className} />;
  }
}
