"use client";

import React from "react";
import { Zap, SlidersHorizontal } from "lucide-react";
import { CalculatorMode } from "@/types/fire";

interface TabsProps {
  mode: CalculatorMode;
  onChangeMode: (mode: CalculatorMode) => void;
}

export function Tabs({ mode, onChangeMode }: TabsProps) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div
        role="tablist"
        aria-label="Режим расчета FIRE"
        className="flex space-x-2 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <button
          type="button"
          role="tab"
          id="tab-simple"
          aria-selected={mode === "simple"}
          aria-controls="panel-calculator"
          onClick={() => onChangeMode("simple")}
          className={`relative py-3.5 px-4 text-sm font-semibold flex items-center gap-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
            mode === "simple"
              ? "text-emerald-700 bg-emerald-50/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Zap className={`w-4 h-4 ${mode === "simple" ? "text-emerald-600" : "text-slate-400"}`} />
          <span>Простая версия</span>
          <span className="hidden sm:inline-block text-xs font-normal text-slate-400">
            (Быстрый расчет)
          </span>
          {mode === "simple" && (
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-600"
              aria-hidden="true"
            />
          )}
        </button>

        <button
          type="button"
          role="tab"
          id="tab-flexible"
          aria-selected={mode === "flexible"}
          aria-controls="panel-calculator"
          onClick={() => onChangeMode("flexible")}
          className={`relative py-3.5 px-4 text-sm font-semibold flex items-center gap-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-t-lg ${
            mode === "flexible"
              ? "text-emerald-700 bg-emerald-50/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className={`w-4 h-4 ${mode === "flexible" ? "text-emerald-600" : "text-slate-400"}`} />
          <span>Гибкая версия</span>
          <span className="hidden sm:inline-block text-xs font-normal text-slate-400">
            (С подушкой и долгами)
          </span>
          {mode === "flexible" && (
            <span
              className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-600"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </div>
  );
}
