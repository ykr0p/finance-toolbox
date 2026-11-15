"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BarChart3, Radio } from "lucide-react";
import { CompareInputs, CompareResult, HistoricalYearData } from "@/types/compare";
import { useCurrency } from "@/context/CurrencyContext";
import { calculateAssetComparison } from "@/lib/compareCalculator";
import { convertCurrencyValue } from "@/lib/formatters";
import { HISTORICAL_DATA, MAX_HISTORICAL_YEAR } from "@/data/historicalReturns";
import { Navigation } from "@/components/Navigation";
import { CompareInputPanel } from "./CompareInputPanel";
import { CompareChart } from "./CompareChart";
import { CompareLeaderboard } from "./CompareLeaderboard";
import { CompareAnnualTable } from "./CompareAnnualTable";
import { CompareInsights } from "./CompareInsights";

export function AssetComparisonCalculator() {
  const { currency } = useCurrency();
  const [dataset, setDataset] = useState<HistoricalYearData[]>(HISTORICAL_DATA);
  const [isOnline, setIsOnline] = useState(true);
  const [lastOnlineUpdate, setLastOnlineUpdate] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initial state calibrated to currency
  const [inputs, setInputs] = useState<CompareInputs>(() => {
    const isRub = currency === "RUB";
    const isByn = currency === "BYN";
    return {
      initialAmount: isRub ? 100000 : isByn ? 3000 : 1000,
      monthlyContribution: 0,
      startYear: 2003,
      endYear: MAX_HISTORICAL_YEAR,
      selectedAssets: ["mcftr", "sp500", "gold", "real_estate", "deposits", "bonds"],
      currency,
      adjustForInflation: false,
      scaleType: "linear",
      includeBalancedPortfolio: true,
    };
  });

  // Track previous currency to rescale monetary amounts when currency changes
  const [prevCurrency, setPrevCurrency] = useState(currency);

  useEffect(() => {
    if (currency !== prevCurrency) {
      setInputs((prev) => ({
        ...prev,
        currency,
        initialAmount: convertCurrencyValue(prev.initialAmount, prevCurrency, currency),
        monthlyContribution:
          prev.monthlyContribution > 0
            ? convertCurrencyValue(prev.monthlyContribution, prevCurrency, currency)
            : 0,
      }));
      setPrevCurrency(currency);
    }
  }, [currency, prevCurrency]);

  // Fetch live market data on mount and provide refresh handler
  const fetchLiveMarketData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/market-data");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDataset((prev) => {
            const copy = [...prev];
            const idx = copy.findIndex((d) => d.year === json.year);
            if (idx >= 0) {
              copy[idx] = json.data;
            } else {
              copy.push(json.data);
            }
            return copy;
          });
          setIsOnline(true);
          setLastOnlineUpdate(json.updatedAt);
        }
      }
    } catch {
      // Graceful fallback to verified cached data
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveMarketData();
  }, []);

  // Recalculate simulation result whenever inputs or live dataset change
  const result: CompareResult = useMemo(() => {
    return calculateAssetComparison(inputs, dataset);
  }, [inputs, dataset]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top App Navigation */}
      <Navigation />

      {/* Main Container */}
      <main className="flex-1 max-w-[1840px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        {/* Page Title & Subtitle Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-100 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Историческая доходность и онлайн котировки (2003 — {MAX_HISTORICAL_YEAR} YTD)</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Сравнение доходности классов активов
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              Наглядный финансовый инструмент с автоматическим обновлением котировок, показывающий, как
              вели бы себя инвестиции в акции РФ с дивидендами (MCFTR), американские акции (S&P 500 TR),
              физическое золото, московскую недвижимость, банковские вклады, ОФЗ и биткоин с 2003 по
              текущий момент в реальном времени.
            </p>
          </div>

          {/* Decorative background shapes */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        </div>

        {/* 2-Column Responsive Layout: Controls on Left, Visuals on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Parameters Panel (5 cols on lg, 4 cols on xl/2xl) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-20">
            <CompareInputPanel
              inputs={inputs}
              onChange={setInputs}
              currency={currency}
              isOnline={isOnline}
              lastOnlineUpdate={lastOnlineUpdate}
              onRefreshOnline={fetchLiveMarketData}
              isRefreshing={isRefreshing}
            />
          </div>

          {/* Right Column: Results, Charts & Tables (7 cols on lg, 8 cols on xl/2xl) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Leaderboard Cards */}
            <CompareLeaderboard result={result} currency={currency} />

            {/* Interactive Dynamic Capital Chart */}
            <CompareChart
              result={result}
              currency={currency}
              scaleType={inputs.scaleType}
            />

            {/* Educational Insights */}
            <CompareInsights result={result} currency={currency} />

            {/* Annual Matrix & Return Grid */}
            <CompareAnnualTable result={result} currency={currency} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <p>
            Исторические данные и котировки в реальном времени сформированы по официальным API
            Московской биржи (MOEX ISS), Банка России (ЦБ РФ), Росстата, IRN.RU и SlickCharts (2003–
            {MAX_HISTORICAL_YEAR} гг.).
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Прошлые результаты не гарантируют будущей доходности. Не является индивидуальной
            инвестиционной рекомендацией.
          </p>
        </div>
      </footer>
    </div>
  );
}
