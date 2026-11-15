"use client";

import React from "react";
import { Sparkles, TrendingUp, ShieldCheck, Flame, Coins } from "lucide-react";
import { CalculatorMode, CurrencyCode, CURRENCY_CONFIGS } from "@/types/fire";

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
  const currencyList: CurrencyCode[] = ["RUB", "USD", "EUR", "BYN"];

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Калькулятор FIRE
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Версия 2.0
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                  Финансовая независимость
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Интерактивный расчет и симуляция достижения ранней пенсии
              </p>
            </div>
          </div>

          {/* Right Toolbar: Currency Selector + Quick Presets */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Валюта:</span>
              </span>
              <div className="flex items-center gap-0.5">
                {currencyList.map((c) => {
                  const cfg = CURRENCY_CONFIGS[c];
                  const isActive = currency === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChangeCurrency(c)}
                      title={cfg.name}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                        isActive
                          ? "bg-white text-emerald-800 shadow-sm border border-slate-200/60"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                      }`}
                    >
                      <span className="text-sm leading-none">{cfg.flag}</span>
                      <span>{cfg.symbol}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-400 hidden xl:inline-flex items-center gap-1">
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
                title="Агрессивный: норма сбережений 70%"
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
          </div>
        </div>
      </div>
    </header>
  );
}
