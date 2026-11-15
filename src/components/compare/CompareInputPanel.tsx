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
  gold: Coins,
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
        "gold",
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
    "gold",
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Параметры симуляции
            </h2>
            <p className="text-xs text-slate-500">
              Настройте стартовый капитал, довнесения и период
            </p>
          </div>
        </div>

        {/* Live Auto-update Status Badge with Source List Popup */}
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
        </div>
      </div>

      {/* 1. Сумма инвестиций & Ежемесячные довнесения */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Начальная сумма */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-blue-600" />
            Начальная сумма
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

          {/* Quick buttons */}
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
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
            Ежемесячное довнесение (DCA)
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

          {/* Quick buttons */}
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

      {/* 2. Временной период & Быстрые пресеты */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            Исторический период: {inputs.startYear} — {inputs.endYear} (
            {inputs.endYear - inputs.startYear + 1} лет)
          </label>
        </div>

        {/* Quick Horizon Buttons */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => selectPresetPeriod(2003, MAX_HISTORICAL_YEAR)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition ${
              inputs.startYear === 2003 && inputs.endYear === MAX_HISTORICAL_YEAR
                ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            🌟 Все {MAX_HISTORICAL_YEAR - 2003 + 1} года (2003–{MAX_HISTORICAL_YEAR} YTD)
          </button>
          <button
            type="button"
            onClick={() => selectPresetPeriod(2011, MAX_HISTORICAL_YEAR)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition ${
              inputs.startYear === 2011 && inputs.endYear === MAX_HISTORICAL_YEAR
                ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            15 лет (2011–{MAX_HISTORICAL_YEAR})
          </button>
          <button
            type="button"
            onClick={() => selectPresetPeriod(2016, MAX_HISTORICAL_YEAR)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition ${
              inputs.startYear === 2016 && inputs.endYear === MAX_HISTORICAL_YEAR
                ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            10 лет (2016–{MAX_HISTORICAL_YEAR})
          </button>
          <button
            type="button"
            onClick={() => selectPresetPeriod(2021, MAX_HISTORICAL_YEAR)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition ${
              inputs.startYear === 2021 && inputs.endYear === MAX_HISTORICAL_YEAR
                ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            5 лет (2021–{MAX_HISTORICAL_YEAR})
          </button>
          <button
            type="button"
            onClick={() => selectPresetPeriod(2023, MAX_HISTORICAL_YEAR)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition ${
              inputs.startYear === 2023 && inputs.endYear === MAX_HISTORICAL_YEAR
                ? "bg-blue-600 border-blue-600 text-white font-bold shadow-xs"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            3 года (2023–{MAX_HISTORICAL_YEAR})
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
      </div>

      {/* 3. Выбор классов активов с фильтрами по странам */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-700">
            Сравниваемые активы ({inputs.selectedAssets.length} из {allAvailableAssets.length})
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={selectAllAssets}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              Все
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={selectRuBasket}
              className="text-[11px] text-slate-600 hover:text-slate-800 font-medium transition"
            >
              РФ 🇷🇺
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={selectByBasket}
              className="text-[11px] text-slate-600 hover:text-slate-800 font-medium transition"
            >
              РБ 🇧🇾
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={selectTop3}
              className="text-[11px] text-slate-500 hover:text-slate-700 font-medium transition"
            >
              Топ-3
            </button>
          </div>
        </div>

        {/* Country filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`flex-1 text-[11px] py-1 rounded-lg font-semibold transition ${
              activeFilter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Все ({allAvailableAssets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("ru")}
            className={`flex-1 text-[11px] py-1 rounded-lg font-semibold transition flex items-center justify-center gap-1 ${
              activeFilter === "ru"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🇷🇺 РФ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("by")}
            className={`flex-1 text-[11px] py-1 rounded-lg font-semibold transition flex items-center justify-center gap-1 ${
              activeFilter === "by"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🇧🇾 РБ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("global")}
            className={`flex-1 text-[11px] py-1 rounded-lg font-semibold transition flex items-center justify-center gap-1 ${
              activeFilter === "global"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🌐 Мировые</span>
          </button>
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-0.5">
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
                className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  isChecked
                    ? "bg-slate-50/80 border-slate-300 shadow-xs"
                    : "bg-white border-slate-100 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: def.color }}
                  />
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {def.name}
                      </span>
                      {countryBadge && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${countryBadge.bg} ${countryBadge.text}`}
                        >
                          {countryBadge.flag}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {def.description}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center ml-2 shrink-0 transition ${
                    isChecked
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Опции: Сбалансированный портфель, инфляция, логарифм */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        {/* Чекбокс: Сбалансированный портфель 1/N */}
        <label className="flex items-center gap-2.5 p-2 rounded-xl bg-teal-50/60 border border-teal-200/80 cursor-pointer hover:bg-teal-50 transition">
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
          <div className="flex-1">
            <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
              <PieChart className="w-3.5 h-3.5 text-teal-600" />
              Сбалансированный портфель (1/N)
            </span>
            <span className="text-[11px] text-teal-700 block">
              Ежегодная ребалансировка до равных долей всех выбранных инструментов
            </span>
          </div>
        </label>

        {/* Шкала графика & Инфляция */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {/* Масштаб шкалы */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-700">Шкала графика:</span>
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => onChange({ ...inputs, scaleType: "linear" })}
                className={`text-[11px] px-2 py-1 rounded-md font-semibold transition ${
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
                className={`text-[11px] px-2 py-1 rounded-md font-semibold transition ${
                  inputs.scaleType === "log"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Логарифмическая шкала наглядно отображает процентный рост активов при многократном росте"
              >
                Log
              </button>
            </div>
          </div>

          {/* Инфляционная поправка */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-medium text-slate-700">С учетом инфляции:</span>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...inputs,
                  adjustForInflation: !inputs.adjustForInflation,
                })
              }
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold border transition ${
                inputs.adjustForInflation
                  ? "bg-amber-500 border-amber-600 text-white shadow-xs"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {inputs.adjustForInflation ? "Реальная доходность" : "Номинальная"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
