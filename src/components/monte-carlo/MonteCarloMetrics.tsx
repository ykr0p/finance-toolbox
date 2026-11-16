"use client";

import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  PieChart,
  HelpCircle,
  Timer,
  Wallet,
} from "lucide-react";
import { MonteCarloResult } from "@/types/monteCarlo";
import { CurrencyCode } from "@/types/fire";
import { formatCurrency, formatCompactCurrency } from "@/lib/formatters";

interface MonteCarloMetricsProps {
  result: MonteCarloResult;
  currency: CurrencyCode;
  mode: "retirement" | "accumulation" | "full_cycle";
}

export function MonteCarloMetrics({ result, currency, mode }: MonteCarloMetricsProps) {
  const {
    successRate,
    medianFinalCapital,
    worst10PercentileFinalCapital,
    best10PercentileFinalCapital,
    safeWithdrawalRate95,
    medianDepletionYear,
    simulationCount,
    computationTimeMs,
  } = result;

  const isHighlySafe = successRate >= 90;
  const isModerateRisk = successRate >= 75 && successRate < 90;
  const isHighRisk = successRate < 75;

  return (
    <div className="space-y-4">
      {/* Top 4 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Success Rate */}
        <div
          className={`rounded-2xl border p-4 transition-all relative overflow-hidden ${
            isHighlySafe
              ? "bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/10 border-emerald-300 shadow-sm ring-1 ring-emerald-200"
              : isModerateRisk
              ? "bg-gradient-to-br from-amber-500/10 via-white to-orange-500/10 border-amber-300 shadow-sm"
              : "bg-gradient-to-br from-rose-500/10 via-white to-red-500/10 border-rose-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              {isHighlySafe ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              {mode === "retirement" ? "Вероятность успеха" : "Вероятность выживания"}
            </span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isHighlySafe
                  ? "bg-emerald-100 text-emerald-800"
                  : isModerateRisk
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {isHighlySafe ? "Надежно" : isModerateRisk ? "Умеренный риск" : "Опасно"}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              suppressHydrationWarning
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isHighlySafe
                  ? "text-emerald-700"
                  : isModerateRisk
                  ? "text-amber-700"
                  : "text-rose-700"
              }`}
            >
              {successRate}%
            </span>
            <span
              suppressHydrationWarning
              className="text-xs text-slate-500 font-semibold"
            >
              из {simulationCount.toLocaleString("ru-RU")} сценариев
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            {mode === "retirement"
              ? isHighlySafe
                ? "Капитал не исчерпан ни в одном из кризисных прогонов"
                : `В ${Math.round((100 - successRate) * 10) / 10}% случаев деньги закончились раньше срока`
              : "В 100% сценариев капитал успешно приумножен"}
          </p>
        </div>

        {/* Card 2: Median Final Capital */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Медианный капитал (50%)
            </span>
            <span className="text-[10px] text-slate-400">Базовый сценарий</span>
          </div>

          <div suppressHydrationWarning className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatCurrency(medianFinalCapital, currency)}
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Ровно половина всех рыночных симуляций показала результат выше этой суммы
          </p>
        </div>

        {/* Card 3: Pessimistic Scenario (10th percentile) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              Худший сценарий (10%)
            </span>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
              Стресс-тест
            </span>
          </div>

          <div
            suppressHydrationWarning
            className={`text-xl sm:text-2xl font-black tracking-tight ${
              worst10PercentileFinalCapital <= 0 ? "text-rose-600" : "text-slate-900"
            }`}
          >
            {worst10PercentileFinalCapital <= 0
              ? "0 (Банкротство)"
              : formatCurrency(worst10PercentileFinalCapital, currency)}
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            {worst10PercentileFinalCapital <= 0 && medianDepletionYear
              ? `При серии кризисов на старте капитал тает на ${medianDepletionYear}-й год`
              : "Остаток капитала при затяжном медвежьем рынке и череде кризисов"}
          </p>
        </div>

        {/* Card 4: Safe Withdrawal Rate or Optimistic */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span className="flex items-center gap-1 text-slate-700 font-bold">
              {mode === "retirement" ? (
                <>
                  <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                  Безопасный SWR (95%)
                </>
              ) : (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Оптимистичный (95%)
                </>
              )}
            </span>
            <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.2 rounded">
              {mode === "retirement" ? "Рекомендация" : "Бычий рынок"}
            </span>
          </div>

          <div suppressHydrationWarning className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {mode === "retirement"
              ? `${safeWithdrawalRate95}%/год`
              : formatCurrency(best10PercentileFinalCapital, currency)}
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            {mode === "retirement"
              ? "Максимальная ставка изъятия, гарантирующая 95% выживаемость портфеля"
              : "Итоговый капитал при сильном восходящем тренде и буме на рынках"}
          </p>
        </div>
      </div>
    </div>
  );
}
