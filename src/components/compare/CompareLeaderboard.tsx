"use client";

import React from "react";
import {
  Trophy,
  TrendingUp,
  Percent,
  ArrowDownRight,
  Sparkles,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { AssetMetrics, CompareResult } from "@/types/compare";
import { CurrencyCode, CURRENCY_CONFIGS } from "@/types/fire";
import { formatCurrency } from "@/lib/formatters";

interface CompareLeaderboardProps {
  result: CompareResult;
  currency: CurrencyCode;
}

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export function CompareLeaderboard({
  result,
  currency,
}: CompareLeaderboardProps) {
  const currencyConfig = CURRENCY_CONFIGS[currency] ?? CURRENCY_CONFIGS.RUB;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Рейтинг доходности активов
            </h2>
            <p className="text-xs text-slate-500">
              Итоговые результаты за {result.yearsCount} лет (с {result.startYear} по {result.endYear})
            </p>
          </div>
        </div>

        {/* Total inflation badge */}
        <div className="text-right">
          <span className="text-[11px] text-slate-500 block">Инфляция за период:</span>
          <span className="text-xs font-bold text-slate-700">
            +{result.inflationCompoundPct}%
          </span>
        </div>
      </div>

      {/* Grid of Ranked Asset Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {result.metrics.map((m) => {
          const isWinner = m.rank === 1;
          const medal = RANK_MEDALS[m.rank - 1] ?? `#${m.rank}`;
          const isAboveInflation = m.realCagr > 0;

          return (
            <div
              key={m.assetId}
              className={`rounded-2xl border p-4 transition-all relative overflow-hidden ${
                isWinner
                  ? "bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/10 border-amber-300 shadow-md ring-1 ring-amber-200"
                  : "bg-white border-slate-200/90 shadow-xs hover:border-slate-300"
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: m.color }}
              />

              {/* Card Header: Rank + Name */}
              <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg shrink-0" title={`Место в рейтинге: ${m.rank}`}>
                    {medal}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-slate-900 block truncate">
                      {m.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {m.shortName}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                      m.totalReturnPct >= 0
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-rose-50 text-rose-700 border border-rose-200/60"
                    }`}
                  >
                    x{m.multiple}
                  </span>
                </div>
              </div>

              {/* Final Capital Value */}
              <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Итоговый капитал:
                </span>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                  {formatCurrency(m.finalValue, currency)}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                  Прирост: {m.totalReturnPct >= 0 ? `+${m.totalReturnPct}%` : `${m.totalReturnPct}%`}
                </span>
              </div>

              {/* Key Indicators Row */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-2.5">
                <div>
                  <span className="text-[10px] text-slate-400 block">CAGR (годовых):</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    +{m.cagr}%/год
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Над инфляцией:</span>
                  <span
                    className={`font-bold flex items-center gap-0.5 ${
                      isAboveInflation ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isAboveInflation ? `+${m.realCagr}%` : `${m.realCagr}%`}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Макс. просадка:</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-500" />
                    {m.maxDrawdown}%
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Лучший год:</span>
                  <span className="font-semibold text-slate-700 truncate block text-[11px]">
                    {m.bestYear.year} (+{m.bestYear.returnPct}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
