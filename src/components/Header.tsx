"use client";

import React from "react";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { CalculatorMode, CurrencyCode } from "@/types/fire";
import { Navigation } from "./Navigation";

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
  const presetsSlot = (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <span className="text-xs font-medium text-slate-400 hidden xl:inline-flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Пресеты:
      </span>
      <button
        type="button"
        onClick={() => onSelectPreset("standard")}
        className="text-[11px] sm:text-xs font-medium px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        title="Базовый инвестиционный профиль"
      >
        Базовый
      </button>
      <button
        type="button"
        onClick={() => onSelectPreset("aggressive")}
        className="text-[11px] sm:text-xs font-medium px-2 sm:px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1"
        title="Агрессивный: высокая норма сбережений"
      >
        <TrendingUp className="w-3 h-3" />
        <span className="hidden sm:inline">Агрессивный</span>
      </button>
      <button
        type="button"
        onClick={() => onSelectPreset("conservative")}
        className="text-[11px] sm:text-xs font-medium px-2 sm:px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition flex items-center gap-1"
        title="Консервативный: большая подушка безопасности"
      >
        <ShieldCheck className="w-3 h-3" />
        <span className="hidden sm:inline">Консервативный</span>
      </button>
    </div>
  );

  return <Navigation rightSlot={presetsSlot} />;
}
