"use client";

import React from "react";
import { Lightbulb, ShieldCheck, Flame, Scale, TrendingUp } from "lucide-react";
import { CompareResult } from "@/types/compare";
import { CurrencyCode, CURRENCY_CONFIGS } from "@/types/fire";
import { formatCurrency } from "@/lib/formatters";

interface CompareInsightsProps {
  result: CompareResult;
  currency: CurrencyCode;
}

export function CompareInsights({ result, currency }: CompareInsightsProps) {
  const winner = result.winner;
  const beatenInflationAssets = result.metrics.filter((m) => m.realCagr > 0);
  const deposits = result.metrics.find((m) => m.assetId === "deposits");
  const portfolio = result.metrics.find((m) => m.assetId === "portfolio");

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
          <Lightbulb className="w-4 h-4" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Ключевые инсайты за период {result.startYear}–{result.endYear}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {/* Insight 1: Winner & Multiplier */}
        {winner && (
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Лидер периода: {winner.shortName}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Инвестиция выросла{" "}
              <strong className="text-slate-900 font-extrabold">в {winner.multiple} раза</strong>{" "}
              ({winner.totalReturnPct >= 0 ? `+${winner.totalReturnPct}%` : `${winner.totalReturnPct}%`}){" "}
              со среднегодовой доходностью{" "}
              <strong className="text-emerald-700">+{winner.cagr}% годовых</strong>.
            </p>
          </div>
        )}

        {/* Insight 2: Inflation Protection */}
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Защита от инфляции</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Инфляция за {result.yearsCount} лет составила{" "}
            <strong className="text-slate-900">+{result.inflationCompoundPct}%</strong>.{" "}
            {beatenInflationAssets.length} из {result.metrics.length} активов смогли обогнать рост
            цен и принести реальный прирост покупательной способности.
          </p>
        </div>

        {/* Insight 3: Diversification & Balance */}
        <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Scale className="w-3.5 h-3.5 text-teal-600" />
            <span>Эффект диверсификации</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {portfolio ? (
              <>
                Сбалансированный портфель показал{" "}
                <strong className="text-teal-700 font-bold">+{portfolio.cagr}%/год</strong> при
                просадке всего {portfolio.maxDrawdown}%, сглаживая кризисы отдельных инструментов.
              </>
            ) : (
              <>
                Распределение средств по разным классам активов защищает капитал от глубоких
                просадок (кризисы 2008, 2014, 2022 гг.).
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
