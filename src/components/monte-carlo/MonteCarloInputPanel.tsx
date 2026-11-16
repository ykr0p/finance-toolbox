"use client";

import React from "react";
import {
  SlidersHorizontal,
  Wallet,
  Calendar,
  PiggyBank,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import {
  MonteCarloInputs,
  PortfolioPreset,
  SimulationMode,
} from "@/types/monteCarlo";
import { CurrencyCode, CURRENCY_CONFIGS } from "@/types/fire";
import { PORTFOLIO_PRESETS_CONFIG } from "@/lib/monteCarloCalculator";
import { HelpButton } from "@/components/common/HelpDialog";
import { MONTE_CARLO_HELP } from "@/data/parametersHelp";

interface MonteCarloInputPanelProps {
  inputs: MonteCarloInputs;
  onChange: (inputs: MonteCarloInputs) => void;
  currency: CurrencyCode;
}

export function MonteCarloInputPanel({
  inputs,
  onChange,
  currency,
}: MonteCarloInputPanelProps) {
  const currencyConfig = CURRENCY_CONFIGS[currency] ?? CURRENCY_CONFIGS.RUB;
  const symbol = currencyConfig.symbol;

  const handlePresetSelect = (presetId: PortfolioPreset) => {
    const conf = PORTFOLIO_PRESETS_CONFIG[presetId];
    onChange({
      ...inputs,
      portfolioPreset: presetId,
      expectedReturn: conf.expectedReturn,
      volatility: conf.volatility,
    });
  };

  // Quick preset amounts based on currency
  const initialPresets =
    currency === "RUB"
      ? [1000000, 5000000, 10000000]
      : currency === "BYN"
      ? [30000, 150000, 300000]
      : [10000, 50000, 100000];

  const monthlyPresets =
    currency === "RUB"
      ? [30000, 60000, 100000]
      : currency === "BYN"
      ? [1000, 2000, 3500]
      : [300, 600, 1000];

  const presetsList: PortfolioPreset[] = [
    "balanced",
    "all_weather",
    "sp500",
    "mcftr",
    "conservative",
    "bootstrap",
    "custom",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Параметры стресс-теста
            </h2>
            <p className="text-xs text-slate-500">
              Настройте капитал, волатильность и сценарии рынка
            </p>
          </div>
        </div>
      </div>

      {/* 1. Режим симуляции */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          Режим моделирования:
          <HelpButton {...MONTE_CARLO_HELP.simulationMode} />
        </label>
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onChange({ ...inputs, mode: "retirement" })}
            className={`text-xs py-2 px-1 rounded-lg font-bold transition text-center leading-tight ${
              inputs.mode === "retirement"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Жизнь с капитала
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...inputs, mode: "accumulation" })}
            className={`text-xs py-2 px-1 rounded-lg font-bold transition text-center leading-tight ${
              inputs.mode === "accumulation"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Накопление
          </button>
          <button
            type="button"
            onClick={() => onChange({ ...inputs, mode: "full_cycle" })}
            className={`text-xs py-2 px-1 rounded-lg font-bold transition text-center leading-tight ${
              inputs.mode === "full_cycle"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Полный цикл
          </button>
        </div>
      </div>

      {/* 2. Капитал и Денежный поток */}
      <div className="space-y-4 pt-1">
        {/* Стартовый капитал */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-blue-600" />
              Стартовый капитал
              <HelpButton {...MONTE_CARLO_HELP.initialCapital} />
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              step={currencyConfig.incomeStep}
              value={inputs.initialCapital}
              onChange={(e) =>
                onChange({
                  ...inputs,
                  initialCapital: Math.max(1, Number(e.target.value) || 0),
                })
              }
              className="w-full px-3 py-2 pr-12 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              {symbol}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            {initialPresets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onChange({ ...inputs, initialCapital: amt })}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                  inputs.initialCapital === amt
                    ? "bg-blue-50 border-blue-300 text-blue-700 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                }`}
              >
                {amt.toLocaleString("ru-RU")} {symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Ежемесячное изъятие / пополнение */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <PiggyBank className="w-3.5 h-3.5 text-indigo-600" />
              {inputs.mode === "retirement"
                ? "Ежемесячный расход (изъятие)"
                : inputs.mode === "accumulation"
                ? "Ежемесячное пополнение"
                : "Ежемесячный поток"}
              <HelpButton
                {...(inputs.mode === "accumulation"
                  ? MONTE_CARLO_HELP.monthlyContribution
                  : MONTE_CARLO_HELP.monthlyExpense)}
              />
            </span>
            {inputs.mode === "retirement" && inputs.initialCapital > 0 && (
              <span className="text-[11px] text-slate-500 font-medium">
                SWR: {((inputs.monthlyCashflow * 12 / inputs.initialCapital) * 100).toFixed(1)}%/год
              </span>
            )}
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              step={currencyConfig.incomeStep}
              value={inputs.monthlyCashflow}
              onChange={(e) =>
                onChange({
                  ...inputs,
                  monthlyCashflow: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="w-full px-3 py-2 pr-16 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              {symbol}/мес
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            {monthlyPresets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onChange({ ...inputs, monthlyCashflow: amt })}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                  inputs.monthlyCashflow === amt
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                }`}
              >
                +{amt.toLocaleString("ru-RU")} {symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Горизонт планирования (лет) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Горизонт симуляции:
              <HelpButton {...MONTE_CARLO_HELP.timeHorizon} />
            </span>
            <span className="font-bold text-blue-700 text-sm">{inputs.years} лет</span>
          </div>
          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={inputs.years}
            onChange={(e) => onChange({ ...inputs, years: Number(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>5 лет</span>
            <span>15 лет</span>
            <span>25 лет</span>
            <span>40 лет</span>
          </div>
        </div>
      </div>

      {/* 3. Выбор инвестиционного портфеля */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          Инвестиционный портфель (доходность и риск):
          <HelpButton {...MONTE_CARLO_HELP.presets} />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetsList.map((presetId) => {
            const conf = PORTFOLIO_PRESETS_CONFIG[presetId];
            const isSelected = inputs.portfolioPreset === presetId;

            return (
              <button
                key={presetId}
                type="button"
                onClick={() => handlePresetSelect(presetId)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-indigo-50/70 border-indigo-300 shadow-xs ring-1 ring-indigo-200"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {conf.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                      isSelected ? "bg-indigo-200 text-indigo-900" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {conf.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                  <span>Доход: <strong>{conf.expectedReturn}%</strong></span>
                  <span>•</span>
                  <span>Волатильность: <strong>{conf.volatility}%</strong></span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sliders for fine-tuning expected return & volatility */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mt-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                Доходность:
                <HelpButton {...MONTE_CARLO_HELP.expectedReturn} />
              </span>
              <span className="font-bold text-emerald-700">{inputs.expectedReturn}%</span>
            </div>
            <input
              type="range"
              min={3}
              max={30}
              step={0.5}
              value={inputs.expectedReturn}
              onChange={(e) =>
                onChange({
                  ...inputs,
                  expectedReturn: Number(e.target.value),
                  portfolioPreset: "custom",
                })
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                Волатильность (σ):
                <HelpButton {...MONTE_CARLO_HELP.volatility} />
              </span>
              <span className="font-bold text-amber-700">{inputs.volatility}%</span>
            </div>
            <input
              type="range"
              min={2}
              max={35}
              step={0.5}
              value={inputs.volatility}
              onChange={(e) =>
                onChange({
                  ...inputs,
                  volatility: Number(e.target.value),
                  portfolioPreset: "custom",
                })
              }
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Инфляция и Настройки симуляции */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        {/* Инфляция */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            Инфляция расходов:
            <HelpButton {...MONTE_CARLO_HELP.inflationRate} />
          </span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={30}
              step={0.5}
              value={inputs.inflationRate}
              onChange={(e) =>
                onChange({
                  ...inputs,
                  inflationRate: Math.max(0, Number(e.target.value) || 0),
                })
              }
              className="w-16 px-2 py-1 rounded-md border border-slate-300 text-center font-bold text-slate-800 text-xs bg-white"
            />
            <span className="text-slate-500 font-semibold">%</span>
          </div>
        </div>

        {/* Число симуляций Монте-Карло */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            Число симуляций:
            <HelpButton {...MONTE_CARLO_HELP.simulationCount} />
          </span>
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200">
            {([1000, 2500, 5000, 10000] as const).map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => onChange({ ...inputs, simulationCount: cnt })}
                className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition ${
                  inputs.simulationCount === cnt
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cnt === 10000 ? "10k" : cnt}
              </button>
            ))}
          </div>
        </div>

        {/* Переключатели графика: Случайные пути и Шкала */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={inputs.showSamplePaths}
              onChange={(e) => onChange({ ...inputs, showSamplePaths: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
            />
            <span className="text-[11px] font-semibold text-slate-700">Случайные пути</span>
          </label>

          <div className="flex items-center justify-between p-1.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-[11px] font-semibold text-slate-600 pl-1 flex items-center gap-1">
              Шкала:
              <HelpButton {...MONTE_CARLO_HELP.scale} />
            </span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => onChange({ ...inputs, scaleType: "linear" })}
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition ${
                  inputs.scaleType === "linear" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                }`}
              >
                Линейная
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...inputs, scaleType: "log" })}
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition ${
                  inputs.scaleType === "log" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                }`}
              >
                Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
