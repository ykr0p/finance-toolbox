"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Coins } from "lucide-react";
import { CurrencyCode, CURRENCY_CONFIGS } from "@/types/fire";
import { BelarusianRubleIcon } from "./icons/BelarusianRubleIcon";

interface CurrencyDropdownProps {
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
}

export function CurrencyDropdown({
  currency,
  onChangeCurrency,
}: CurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencyList: CurrencyCode[] = ["RUB", "USD", "EUR", "BYN"];
  const currentConfig = CURRENCY_CONFIGS[currency];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (c: CurrencyCode) => {
    onChangeCurrency(c);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all shadow-sm ${
          isOpen
            ? "bg-slate-50 border-emerald-500 text-slate-900 ring-2 ring-emerald-100"
            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
        }`}
      >
        <span className="text-base leading-none">{currentConfig.flag}</span>
        <span className="font-bold text-slate-900">{currentConfig.code}</span>
        <span className="text-slate-400">
          {currency === "BYN" ? (
            <BelarusianRubleIcon className="w-3.5 h-3.5 text-slate-600 inline" />
          ) : (
            `(${currentConfig.symbol})`
          )}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right focus:outline-none"
        >
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-slate-500" /> Валюта расчета
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Выбор</span>
          </div>

          <div className="py-1 space-y-0.5">
            {currencyList.map((code) => {
              const cfg = CURRENCY_CONFIGS[code];
              const isSelected = currency === code;

              return (
                <button
                  key={code}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-950 font-bold"
                      : "text-slate-700 hover:bg-slate-50 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{cfg.flag}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{code}</span>
                        {code === "BYN" ? (
                          <span className="text-slate-400 font-normal inline-flex items-center gap-0.5">
                            (<BelarusianRubleIcon className="w-3.5 h-3.5 text-slate-700 inline" />)
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">
                            ({cfg.symbol})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {cfg.name}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
