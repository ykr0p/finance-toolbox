"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { ChartPoint, CompareResult } from "@/types/compare";
import { CurrencyCode, CURRENCY_CONFIGS } from "@/types/fire";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";
import { ASSET_DEFINITIONS } from "@/data/historicalReturns";

interface CompareChartProps {
  result: CompareResult;
  currency: CurrencyCode;
  scaleType: "linear" | "log";
}

export function CompareChart({
  result,
  currency,
  scaleType,
}: CompareChartProps) {
  const currencyConfig = CURRENCY_CONFIGS[currency] ?? CURRENCY_CONFIGS.RUB;

  // Find min non-zero value for safe log scale domain
  const minNonZeroValue = useMemo(() => {
    let minVal = Infinity;
    for (const pt of result.chartPoints) {
      for (const m of result.metrics) {
        const val = pt[m.assetId];
        if (typeof val === "number" && val > 0 && val < minVal) {
          minVal = val;
        }
      }
      if (pt.totalInvested > 0 && pt.totalInvested < minVal) {
        minVal = pt.totalInvested;
      }
    }
    return minVal === Infinity ? 1 : Math.max(1, minVal * 0.9);
  }, [result]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Динамика роста капитала по активам
          </h2>
          <p className="text-xs text-slate-500">
            Сравнение накопленного капитала при инвестировании с {result.startYear} по {result.endYear} год
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Шкала: {scaleType === "log" ? "Логарифмическая (Log)" : "Линейная"}
          </span>
        </div>
      </div>

      <div className="w-full h-[360px] sm:h-[440px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={result.chartPoints}
            margin={{ top: 10, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              scale={scaleType === "log" ? "log" : "linear"}
              domain={scaleType === "log" ? [minNonZeroValue, "auto"] : ["auto", "auto"]}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => formatCompactCurrency(v, currency)}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;

                // Sort items in tooltip descending by value
                const items = [...payload].sort((a, b) => {
                  const valA = Number(a.value) || 0;
                  const valB = Number(b.value) || 0;
                  return valB - valA;
                });

                return (
                  <div className="bg-slate-950/95 text-white p-3 rounded-xl shadow-2xl border border-slate-800 text-xs min-w-[240px]">
                    <div className="font-bold text-sm text-slate-100 border-b border-slate-800 pb-1.5 mb-2 flex items-center justify-between">
                      <span>{label} год</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        {currency}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {items.map((item, idx) => {
                        const isInvested = item.dataKey === "totalInvested";
                        const isInflation = item.dataKey === "inflationBaseline";
                        const name = isInvested
                          ? "Вложено средств"
                          : isInflation
                          ? "Инфляция (база)"
                          : item.name;

                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between gap-3 ${
                              isInvested ? "pt-1 border-t border-slate-800 text-slate-400" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="truncate max-w-[130px]">{name}</span>
                            </div>
                            <span className="font-semibold text-right tabular-nums">
                              {formatCurrency(Number(item.value) || 0, currency)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={40}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: "12px", fontSize: "11px" }}
            />

            {/* Total Invested Baseline Line */}
            <Line
              type="monotone"
              dataKey="totalInvested"
              name="Вложено средств"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />

            {/* Render lines for active assets */}
            {result.metrics.map((m) => {
              const def = ASSET_DEFINITIONS[m.assetId];
              return (
                <Line
                  key={m.assetId}
                  type="monotone"
                  dataKey={m.assetId}
                  name={def?.shortName ?? m.shortName}
                  stroke={m.color}
                  strokeWidth={m.rank === 1 ? 2.8 : 2}
                  dot={{ r: 2.5, strokeWidth: 0, fill: m.color }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "#ffffff" }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
