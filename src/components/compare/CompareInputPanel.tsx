"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Globe,
  Coins,
  Building2,
  Landmark,
  Scroll,
  Cpu,
  PieChart,
  Calendar,
  Wallet,
  PiggyBank,
  Sparkles,
  SlidersHorizontal,
  Check,
  RefreshCw,
  Radio,
  Layers,
  ChevronDown,
  Info,
} from "lucide-react";
import { AssetId, CompareInputs } from "@/types/compare";
import { CurrencyCode, CURRENCY_CONFIGS } from "@/types/fire";
import { ASSET_DEFINITIONS, MIN_HISTORICAL_YEAR, MAX_HISTORICAL_YEAR } from "@/data/historicalReturns";
import { CalculationTemplatesModal } from "@/components/common/CalculationTemplatesModal";
import { HelpButton } from "@/components/common/HelpDialog";
import { COMPARE_HELP } from "@/data/parametersHelp";
import { formatCurrency } from "@/lib/formatters";

interface CompareInputPanelProps {
  inputs: CompareInputs;
  onChange: (inputs: CompareInputs) => void;
  currency: CurrencyCode;
  isOnline?: boolean;
  lastOnlineUpdate?: string;
  onRefreshOnline?: () => void;
  isRefreshing?: boolean;
}

const ASSET_ICONS: Record<AssetId, React.ElementType> = {
  mcftr: TrendingUp,
  sp500: Globe,
  vwce: Globe,
  schd: TrendingUp,
  vym: PiggyBank,
  agg: Scroll,
  vnq: Building2,
  gold: Coins,
  silver: Sparkles,
  real_estate: Building2,
  real_estate_minsk: Building2,
  deposits: Landmark,
  deposits_by: Landmark,
  bonds: Scroll,
  bonds_by: Scroll,
  btc: Cpu,
  portfolio: PieChart,
};

const COUNTRY_BADGES: Record<string, { label: string; flag: string; bg: string; text: string }> = {
  ru: { label: "РФ", flag: "🇷🇺", bg: "bg-red-50", text: "text-red-700" },
  by: { label: "РБ", flag: "🇧🇾", bg: "bg-emerald-50", text: "text-emerald-700" },
  us: { label: "США", flag: "🇺🇸", bg: "bg-blue-50", text: "text-blue-700" },
  global: { label: "Глобал", flag: "🌐", bg: "bg-purple-50", text: "text-purple-700" },
};

type AssetFilter = "all" | "ru" | "by" | "global";

export function CompareInputPanel({
  inputs,
  onChange,
  currency,
  isOnline = true,
  lastOnlineUpdate,
  onRefreshOnline,
  isRefreshing = false,
}: CompareInputPanelProps) {
  const currencyConfig = CURRENCY_CONFIGS[currency] ?? CURRENCY_CONFIGS.RUB;
  const symbol = currencyConfig.symbol;

  const [activeFilter, setActiveFilter] = useState<AssetFilter>("all");
  const [showSourcesTooltip, setShowSourcesTooltip] = useState(false);

  const handleAssetToggle = (assetId: AssetId) => {
    const isSelected = inputs.selectedAssets.includes(assetId);
    let next: AssetId[];
    if (isSelected) {
      if (inputs.selectedAssets.length === 1) return; // Prevent unchecking all
      next = inputs.selectedAssets.filter((id) => id !== assetId);
    } else {
      next = [...inputs.selectedAssets, assetId];
    }
    onChange({ ...inputs, selectedAssets: next });
  };

  const selectAllAssets = () => {
    onChange({
      ...inputs,
      selectedAssets: [
        "mcftr",
        "sp500",
        "vwce",
        "schd",
        "vym",
        "agg",
        "vnq",
        "gold",
        "silver",
        "real_estate",
        "real_estate_minsk",
        "deposits",
        "deposits_by",
        "bonds",
        "bonds_by",
        "btc",
      ],
    });
  };

  const selectRuBasket = () => {
    onChange({
      ...inputs,
      selectedAssets: ["mcftr", "gold", "real_estate", "deposits", "bonds"],
    });
  };

  const selectByBasket = () => {
    onChange({
      ...inputs,
      selectedAssets: ["real_estate_minsk", "deposits_by", "gold", "sp500", "bonds_by"],
    });
  };

  const selectTop3 = () => {
    if (currency === "BYN") {
      onChange({
        ...inputs,
        selectedAssets: ["real_estate_minsk", "gold", "deposits_by"],
      });
    } else {
      onChange({
        ...inputs,
        selectedAssets: ["mcftr", "gold", "real_estate"],
      });
    }
  };

  const selectPresetPeriod = (start: number, end: number) => {
    onChange({ ...inputs, startYear: start, endYear: end });
  };

  const handleResetDefaults = () => {
    const isRub = currency === "RUB";
    const isByn = currency === "BYN";
    onChange({
      initialAmount: isRub ? 100000 : isByn ? 3000 : 1000,
      monthlyContribution: 0,
      startYear: 2003,
      endYear: MAX_HISTORICAL_YEAR,
      selectedAssets: isByn
        ? ["real_estate_minsk", "deposits_by", "gold", "sp500", "mcftr", "bonds_by"]
        : ["mcftr", "sp500", "gold", "real_estate", "deposits", "bonds"],
      currency,
      adjustForInflation: false,
      scaleType: "linear",
      includeBalancedPortfolio: true,
    });
  };

  // Quick preset amounts based on currency
  const initialPresets =
    currency === "RUB"
      ? [100000, 500000, 1000000]
      : currency === "BYN"
      ? [3000, 15000, 30000]
      : [1000, 5000, 10000];

  const monthlyPresets =
    currency === "RUB"
      ? [0, 10000, 30000, 50000]
      : currency === "BYN"
      ? [0, 300, 1000, 2000]
      : [0, 100, 300, 500];

  const allAvailableAssets: AssetId[] = [
    "mcftr",
    "sp500",
    "vwce",
    "schd",
    "vym",
    "agg",
    "vnq",
    "gold",
    "silver",
    "real_estate",
    "real_estate_minsk",
    "deposits",
    "deposits_by",
    "bonds",
    "bonds_by",
    "btc",
  ];

  const filteredAssets = allAvailableAssets.filter((assetId) => {
    if (activeFilter === "all") return true;
    const def = ASSET_DEFINITIONS[assetId];
    if (activeFilter === "ru") return def.country === "ru";
    if (activeFilter === "by") return def.country === "by";
    if (activeFilter === "global") return def.country === "us" || def.country === "global";
    return true;
  });

  const simulationYears = Math.max(1, inputs.endYear - inputs.startYear + 1);
  const totalInvestedMonths = simulationYears * 12;
  const totalInvested = inputs.initialAmount + inputs.monthlyContribution * totalInvestedMonths;

  return (
    <div className="space-y-4">
      {/* Top Header / Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Параметры симуляции доходности
            </h2>
            <p className="text-xs text-slate-500">
              Настройте сумму капитала, регулярные довнесения, период и сравниваемые активы
            </p>
          </div>
        </div>

        {/* Live Auto-update Status Badge & Template Scenarios */}
        <div className="relative flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowSourcesTooltip((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/70 transition cursor-pointer"
            title="Нажмите, чтобы посмотреть статус источников котировок"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Онлайн (2026 YTD)</span>
            <ChevronDown className="w-3 h-3 text-emerald-600" />
          </button>

          {showSourcesTooltip && (
            <div className="absolute right-0 top-8 z-30 w-72 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between border-b pb-1.5">
                <span>Источники в реальном времени</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Все онлайн</span>
              </div>
              <ul className="space-y-1.5 text-[11px]">
                <li className="flex items-center justify-between">
                  <span>🇷🇺 Мосбиржа (MOEX ISS): MCFTR, RGBITR</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </li>
                <li className="flex items-center justify-between">
                  <span>🇷🇺 Банк России (ЦБ РФ): USD/RUB, Золото</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </li>
                <li className="flex items-center justify-between">
                  <span>🇧🇾 Нацбанк РБ (НБРБ): USD/BYN, Золото BYN</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </li>
                <li className="flex items-center justify-between">
                  <span>🏢 Недвижимость: Москва (IRN), Минск (Realt)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </li>
                <li className="flex items-center justify-between">
                  <span>🪙 Криптобиржи (Binance): BTC/USDT</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </li>
              </ul>
              {lastOnlineUpdate && (
                <p className="text-[10px] text-slate-400 pt-1 border-t">
                  Последнее обновление: {new Date(lastOnlineUpdate).toLocaleTimeString()}
                </p>
              )}
            </div>
          )}

          {onRefreshOnline && (
            <button
              type="button"
              onClick={onRefreshOnline}
              disabled={isRefreshing}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Обновить котировки в реальном времени"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
            </button>
          )}

          <HelpButton {...COMPARE_HELP.liveMarketData} variant="question" />

          <CalculationTemplatesModal
            calculatorId="compare"
            calculatorTitle="Сравнение классов активов"
            currentData={inputs}
            onLoadData={onChange}
            currency={currency}
            onResetDefaults={handleResetDefaults}
          />
        </div>
      </div>

      {/* 3-Card Sequential Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Карточка 1: 1. Капитал и довнесения */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    1. Капитал и довнесения
                  </h2>
                  <p className="text-[11px] text-slate-400">Стартовая сумма и регулярный DCA</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Шаг 1
              </span>
            </div>

            <div className="space-y-4">
              {/* Начальная сумма */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-blue-600" />
                    Начальная сумма инвестиций
                    <HelpButton {...COMPARE_HELP.initialAmount} variant="question" className="ml-0.5" />
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    step={currencyConfig.incomeStep}
                    value={inputs.initialAmount}
                    onChange={(e) =>
                      onChange({
                        ...inputs,
                        initialAmount: Math.max(1, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3 py-2 pr-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-semibold text-slate-900 transition"
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
                      onClick={() => onChange({ ...inputs, initialAmount: amt })}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                        inputs.initialAmount === amt
                          ? "bg-blue-50 border-blue-300 text-blue-700 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      {amt.toLocaleString("ru-RU")} {symbol}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ежемесячные довнесения */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
                    Ежемесячное пополнение (DCA)
                    <HelpButton {...COMPARE_HELP.monthlyContribution} variant="question" className="ml-0.5" />
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={currencyConfig.incomeStep}
                    value={inputs.monthlyContribution}
                    onChange={(e) =>
                      onChange({
                        ...inputs,
                        monthlyContribution: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3 py-2 pr-12 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-semibold text-slate-900 transition"
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
                      onClick={() => onChange({ ...inputs, monthlyContribution: amt })}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition ${
                        inputs.monthlyContribution === amt
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                      }`}
                    >
                      {amt === 0 ? "Разово" : `+${amt.toLocaleString("ru-RU")} ${symbol}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Cash Summary */}
          <div className="mt-5 pt-3 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <span>Всего будет инвестировано</span>
                <span className="text-xs font-semibold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {inputs.monthlyContribution > 0 ? "С довнесениями" : "Разовый вклад"}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                  {formatCurrency(totalInvested, currency)}
                </span>
                <span className="text-[11px] text-slate-400">
                  за {totalInvestedMonths} мес.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Карточка 2: 2. Период и режим расчёта */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      2. Период и режим расчёта
                    </h2>
                    <HelpButton {...COMPARE_HELP.period} variant="question" />
                  </div>
                  <p className="text-[11px] text-slate-400">Временной интервал, инфляция и шкала</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Шаг 2
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Quick Horizon Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => selectPresetPeriod(2003, MAX_HISTORICAL_YEAR)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                    inputs.startYear === 2003 && inputs.endYear === MAX_HISTORICAL_YEAR
                      ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  🌟 Все {MAX_HISTORICAL_YEAR - 2003 + 1} года
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetPeriod(2011, MAX_HISTORICAL_YEAR)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                    inputs.startYear === 2011 && inputs.endYear === MAX_HISTORICAL_YEAR
                      ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  15 лет
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetPeriod(2016, MAX_HISTORICAL_YEAR)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                    inputs.startYear === 2016 && inputs.endYear === MAX_HISTORICAL_YEAR
                      ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  10 лет
                </button>
                <button
                  type="button"
                  onClick={() => selectPresetPeriod(2021, MAX_HISTORICAL_YEAR)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                    inputs.startYear === 2021 && inputs.endYear === MAX_HISTORICAL_YEAR
                      ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  5 лет
                </button>
              </div>

              {/* Dual Year Selectors */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    Начальный год:
                  </span>
                  <select
                    value={inputs.startYear}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      onChange({
                        ...inputs,
                        startYear: s,
                        endYear: Math.max(s, inputs.endYear),
                      });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-900 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {Array.from(
                      { length: MAX_HISTORICAL_YEAR - MIN_HISTORICAL_YEAR + 1 },
                      (_, i) => MIN_HISTORICAL_YEAR + i
                    ).map((y) => (
                      <option key={y} value={y}>
                        {y === MAX_HISTORICAL_YEAR ? `${y} г. (YTD)` : `${y} г.`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 font-medium block mb-1">
                    Конечный год:
                  </span>
                  <select
                    value={inputs.endYear}
                    onChange={(e) => {
                      const en = Number(e.target.value);
                      onChange({
                        ...inputs,
                        endYear: en,
                        startYear: Math.min(inputs.startYear, en),
                      });
                    }}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-900 rounded-lg border border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {Array.from(
                      { length: MAX_HISTORICAL_YEAR - MIN_HISTORICAL_YEAR + 1 },
                      (_, i) => MIN_HISTORICAL_YEAR + i
                    ).map((y) => (
                      <option key={y} value={y} disabled={y < inputs.startYear}>
                        {y === MAX_HISTORICAL_YEAR ? `${y} г. (YTD онлайн)` : `${y} г.`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Switches: Inflation and Scale */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {/* Inflation switch */}
                <div className="flex flex-col justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-600">Инфляция:</span>
                    <HelpButton {...COMPARE_HELP.inflation} variant="question" />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...inputs,
                        adjustForInflation: !inputs.adjustForInflation,
                      })
                    }
                    className={`mt-1 text-xs py-1 px-2 rounded-lg font-semibold border transition ${
                      inputs.adjustForInflation
                        ? "bg-amber-500 border-amber-600 text-white shadow-xs"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {inputs.adjustForInflation ? "Реальная доходность" : "Номинальная"}
                  </button>
                </div>

                {/* Scale Switch */}
                <div className="flex flex-col justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-600">Шкала графика:</span>
                    <HelpButton {...COMPARE_HELP.scaleType} variant="question" />
                  </div>
                  <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 mt-1">
                    <button
                      type="button"
                      onClick={() => onChange({ ...inputs, scaleType: "linear" })}
                      className={`flex-1 text-[11px] py-1 rounded-md font-semibold transition ${
                        inputs.scaleType === "linear"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Линейная
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ ...inputs, scaleType: "log" })}
                      className={`flex-1 text-[11px] py-1 rounded-md font-semibold transition ${
                        inputs.scaleType === "log"
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Period Summary */}
          <div className="mt-5 pt-3 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <span>Интервал исследования</span>
                <span className="text-xs font-semibold text-purple-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {simulationYears} {simulationYears === 1 ? "год" : simulationYears < 5 ? "года" : "лет"}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-sm font-extrabold text-slate-900">
                  {inputs.startYear} — {inputs.endYear} (YTD)
                </span>
                <span className="text-[11px] text-slate-400">
                  {inputs.adjustForInflation ? "с инфляционной очисткой" : "номинальные цены"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Карточка 3: 3. Классы активов и портфель */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      3. Классы активов
                    </h2>
                    <HelpButton {...COMPARE_HELP.assetClasses} variant="question" />
                  </div>
                  <p className="text-[11px] text-slate-400">Выбор рыночных инструментов</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Шаг 3
              </span>
            </div>

            <div className="space-y-3">
              {/* Filter Tabs and Quick buttons */}
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    className={`text-[10px] py-0.5 px-2 rounded-md font-bold transition ${
                      activeFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Все
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("ru")}
                    className={`text-[10px] py-0.5 px-1.5 rounded-md font-bold transition ${
                      activeFilter === "ru" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🇷🇺 РФ
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("by")}
                    className={`text-[10px] py-0.5 px-1.5 rounded-md font-bold transition ${
                      activeFilter === "by" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🇧🇾 РБ
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("global")}
                    className={`text-[10px] py-0.5 px-1.5 rounded-md font-bold transition ${
                      activeFilter === "global" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🌐 Мир
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={selectAllAssets}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Все
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={selectTop3}
                    className="text-slate-500 hover:underline font-medium"
                  >
                    Топ-3
                  </button>
                </div>
              </div>

              {/* Balanced Portfolio Option */}
              <label className="flex items-center gap-2 p-2 rounded-xl bg-teal-50/60 border border-teal-200/80 cursor-pointer hover:bg-teal-50 transition">
                <input
                  type="checkbox"
                  checked={inputs.includeBalancedPortfolio}
                  onChange={(e) =>
                    onChange({
                      ...inputs,
                      includeBalancedPortfolio: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-teal-300 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-teal-950 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      Сбалансированный портфель (1/N)
                    </span>
                    <HelpButton {...COMPARE_HELP.balancedPortfolio} variant="question" className="ml-1" />
                  </span>
                  <span className="text-[10px] text-teal-700 block truncate">
                    Ежегодная ребалансировка до равных долей
                  </span>
                </div>
              </label>

              {/* Asset Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredAssets.map((assetId) => {
                  const def = ASSET_DEFINITIONS[assetId];
                  const isChecked = inputs.selectedAssets.includes(assetId);
                  const Icon = ASSET_ICONS[assetId] ?? TrendingUp;
                  const countryBadge = def.country ? COUNTRY_BADGES[def.country] : null;

                  return (
                    <button
                      key={assetId}
                      type="button"
                      onClick={() => handleAssetToggle(assetId)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                        isChecked
                          ? "bg-slate-50/80 border-slate-300 shadow-xs"
                          : "bg-white border-slate-100 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: def.color }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="text-xs font-bold text-slate-900 block truncate">
                              {def.name}
                            </span>
                            {countryBadge && (
                              <span className="text-[10px] shrink-0">
                                {countryBadge.flag}
                              </span>
                            )}
                            {COMPARE_HELP[`asset_${assetId}`] && (
                              <HelpButton
                                {...COMPARE_HELP[`asset_${assetId}`]}
                                variant="question"
                                className="w-3.5 h-3.5 text-[9px] ml-0.5 shrink-0 opacity-60 hover:opacity-100"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ml-1.5 shrink-0 transition ${
                          isChecked
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Assets Summary */}
          <div className="mt-5 pt-3 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                <span>Выбрано инструментов</span>
                <span className="text-xs font-semibold text-teal-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {inputs.selectedAssets.length} из {allAvailableAssets.length}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xs text-slate-600 truncate">
                  {inputs.selectedAssets.map((id) => ASSET_DEFINITIONS[id]?.shortName ?? id).join(", ")}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold shrink-0 ml-2">
                  ✓ Котировки онлайн
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
