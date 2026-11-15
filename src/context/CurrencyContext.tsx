"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CurrencyCode, CurrencyConfig, CURRENCY_CONFIGS } from "@/types/fire";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  config: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "RUB",
  setCurrency: () => {},
  config: CURRENCY_CONFIGS.RUB,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("RUB");

  // Load persisted currency on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fincalc_currency") as CurrencyCode | null;
      if (saved && CURRENCY_CONFIGS[saved]) {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem("fincalc_currency", c);
    } catch {
      // Ignore localStorage errors
    }
  };

  const config = CURRENCY_CONFIGS[currency] ?? CURRENCY_CONFIGS.RUB;

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, config }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
