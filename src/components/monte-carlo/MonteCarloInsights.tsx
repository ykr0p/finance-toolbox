"use client";

import React from "react";
import { Lightbulb, ShieldAlert, Sparkles, Scale, AlertCircle } from "lucide-react";
import { MonteCarloResult } from "@/types/monteCarlo";
import { CurrencyCode } from "@/types/fire";
import { formatCurrency } from "@/lib/formatters";

interface MonteCarloInsightsProps {
  result: MonteCarloResult;
  currency: CurrencyCode;
  mode: "retirement" | "accumulation" | "full_cycle";
}

export function MonteCarloInsights({ result, currency, mode }: MonteCarloInsightsProps) {
  const { successRate, safeWithdrawalRate95, medianFinalCapital, worst10PercentileFinalCapital, years } = result;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Ключевые аналитические инсайты симуляции
          </h3>
          <p className="text-xs text-slate-500">
            Оценка рисков последовательности доходностей (Sequence of Returns Risk)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Insight 1: Sequence of Returns Risk */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Риск последовательности (SRR)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Даже при отличной средней доходности (10–12%) падение рынка в первые 3–5 лет после выхода на пенсию
            наносит капиталу непоправимый урон из-за вынужденной фиксации убытков при изъятиях.
          </p>
        </div>

        {/* Insight 2: Safe Withdrawal Rate Recommendation */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Безопасная норма изъятия</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {mode === "retirement" ? (
              <>
                Для достижения 95% надежности на горизонте {years} лет оптимальная начальная ставка
                изъятия составляет <strong className="text-indigo-700 font-extrabold">{safeWithdrawalRate95}%</strong>{" "}
                от стартового капитала.
              </>
            ) : (
              <>
                Регулярное ежемесячное инвестирование (DCA) превращает рыночные кризисы в преимущество,
                позволяя скупать активы по минимальным ценам.
              </>
            )}
          </p>
        </div>

        {/* Insight 3: Risk Management Advice */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Стратегия защиты</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {successRate < 85 ? (
              <span className="text-rose-700 font-medium">
                План уязвим. Рекомендуется снизить изъятия на 10–15% или добавить в портфель 20–30% облигаций
                для демпфирования просадок.
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                Высокая надежность портфеля. Вероятность сохранить или преумножить капитал на финише составляет{" "}
                <strong>{successRate}%</strong>.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
