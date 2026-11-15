"use client";

import React from "react";
import { Sparkles, TrendingUp, ShieldCheck, Flame } from "lucide-react";
import { CalculatorMode, CurrencyCode } from "@/types/fire";
import { CurrencyDropdown } from "./CurrencyDropdown";

interface HeaderProps {
  mode: CalculatorMode;
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onSelectPreset: (preset: "standard" | "aggressive" | "conservative") => void;
}

export function Header({
  mode,
  currency,
  onChangeCurrency,
  onSelectPreset,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Калькулятор FIRE
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Интерактивный расчет и симуляция достижения ранней пенсии
              </p>
            </div>
          </div>

          {/* Right Toolbar: Presets + Dropdown Currency Menu */}
          <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap sm:flex-nowrap">
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-400 hidden md:inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Пресеты:
              </span>
              <button
                type="button"
                onClick={() => onSelectPreset("standard")}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Базовый инвестиционный профиль"
              >
                Базовый
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset("aggressive")}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1"
                title="Агрессивный: высокая норма сбережений"
              >
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">Агрессивный</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectPreset("conservative")}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition flex items-center gap-1"
                title="Консервативный: большая подушка безопасности"
              >
                <ShieldCheck className="w-3 h-3" />
                <span className="hidden sm:inline">Консервативный</span>
              </button>
            </div>

            {/* Currency Dropdown Menu */}
            <CurrencyDropdown
              currency={currency}
              onChangeCurrency={onChangeCurrency}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
