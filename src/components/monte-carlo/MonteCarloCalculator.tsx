"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Sparkles, Activity, ShieldCheck, Flame, BarChart3, RotateCcw } from "lucide-react";
import { MonteCarloInputs, MonteCarloResult } from "@/types/monteCarlo";
import { useCurrency } from "@/context/CurrencyContext";
import { calculateMonteCarlo } from "@/lib/monteCarloCalculator";
import { convertCurrencyValue } from "@/lib/formatters";
import { usePersistentState } from "@/lib/storage";
import { Navigation } from "@/components/Navigation";
import { MonteCarloInputPanel } from "./MonteCarloInputPanel";
import { MonteCarloMetrics } from "./MonteCarloMetrics";
import { MonteCarloFanChart } from "./MonteCarloFanChart";
import { MonteCarloHistogram } from "./MonteCarloHistogram";
import { MonteCarloInsights } from "./MonteCarloInsights";

export function MonteCarloCalculator() {
  const { currency } = useCurrency();

  const [inputs, setInputs] = usePersistentState<MonteCarloInputs>(
    "fincalc_montecarlo_inputs_v1",
    () => {
      const isRub = currency === "RUB";
      const isByn = currency === "BYN";

      return {
        initialCapital: isRub ? 5000000 : isByn ? 150000 : 50000,
        mode: "retirement",
        years: 30,
        monthlyCashflow: isRub ? 50000 : isByn ? 1500 : 500,
        inflationRate: 5.5,
        adjustCashflowForInflation: true,
        expectedReturn: 12.0,
        volatility: 12.5,
        portfolioPreset: "balanced",
        simulationCount: 2500,
        scaleType: "linear",
        showSamplePaths: true,
      };
    }
  );

  const [prevCurrency, setPrevCurrency] = useState(currency);

  useEffect(() => {
    if (currency !== prevCurrency) {
      setInputs((prev) => ({
        ...prev,
        initialCapital: convertCurrencyValue(prev.initialCapital, prevCurrency, currency),
        monthlyCashflow: convertCurrencyValue(prev.monthlyCashflow, prevCurrency, currency),
      }));
      setPrevCurrency(currency);
    }
  }, [currency, prevCurrency]);

  const result: MonteCarloResult = useMemo(() => {
    return calculateMonteCarlo(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navigation />

      <main className="flex-1 max-w-[1840px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        {/* Page Hero Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-2xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-purple-200 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Стохастическое моделирование и стресс-тест портфеля</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Калькулятор Монте-Карло: Стресс-тест инвестиций
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
              Продвинутый квантитативный инструмент, который прогоняет тысячи случайных рыночных траекторий
              с реальной волатильностью и кризисными просадками. Позволяет проверить устойчивость вашего
              инвестиционного плана к риску последовательности доходностей (Sequence of Returns Risk).
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-300 to-transparent pointer-events-none" />
        </div>

        {/* 1. Блок параметров симуляции (Шаги 1, 2, 3) */}
        <section aria-label="Параметры стресс-теста: шаги 1, 2, 3">
          <MonteCarloInputPanel
            inputs={inputs}
            onChange={setInputs}
            currency={currency}
          />
        </section>

        {/* 2. Блоки ключевых метрик стресс-теста */}
        <section aria-label="Ключевые показатели стресс-теста">
          <MonteCarloMetrics
            result={result}
            currency={currency}
            mode={inputs.mode}
          />
        </section>

        {/* 3. Затем Распределение вероятностей исходов и аналитика */}
        <section aria-label="Распределение исходов и стресс-аналитика">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <MonteCarloHistogram
              histogram={result.histogram}
              currency={currency}
            />
            <MonteCarloInsights
              result={result}
              currency={currency}
              mode={inputs.mode}
            />
          </div>
        </section>

        {/* 4. И внизу: Интерактивный вероятностный веер капитала (Fan Chart) */}
        <section aria-label="Вероятностный веер траекторий капитала">
          <MonteCarloFanChart
            result={result}
            currency={currency}
            scaleType={inputs.scaleType}
            showSamplePaths={inputs.showSamplePaths}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <p>
            Метод Монте-Карло использует стохастическое моделирование геометрического броуновского движения и
            исторический бутстрап-ресемплинг. Прошлые результаты не гарантируют будущей доходности.
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Не является индивидуальной инвестиционной рекомендацией.
          </p>
        </div>
      </footer>
    </div>
  );
}
