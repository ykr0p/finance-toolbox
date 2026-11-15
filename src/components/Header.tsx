"use client";

import React from "react";
import { Sparkles, TrendingUp, ShieldCheck, Flame } from "lucide-react";
import { CalculatorMode, FireInputs } from "@/types/fire";

interface HeaderProps {
  mode: CalculatorMode;
  onSelectPreset: (preset: "standard" | "aggressive" | "conservative") => void;
}

export function Header({ mode, onSelectPreset }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white shrink-0">
              <Flame className="w-7 h-7" />
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
                  Модель Бабайкина
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Калькулятор раннего выхода на пенсию по модели канала «На пенсию в 35 лет»
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Готовые пресеты:
            </span>
            <button
              type="button"
              onClick={() => onSelectPreset("standard")}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Доход 150к, расходы 60к, активы 1.5 млн"
            >
              Базовый
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset("aggressive")}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center gap-1"
              title="Высокий доход и норма сбережений 70%"
            >
              <TrendingUp className="w-3 h-3" />
              Агрессивный
            </button>
            <button
              type="button"
              onClick={() => onSelectPreset("conservative")}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition flex items-center gap-1"
              title="Умеренные доходности, большая подушка"
            >
              <ShieldCheck className="w-3 h-3" />
              Консервативный
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
