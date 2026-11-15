"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { FireCalculationResult, CurrencyCode } from "@/types/fire";
import { formatCurrency } from "@/lib/formatters";
import { BarChart3, Maximize2, Sparkles } from "lucide-react";

interface CapitalChartProps {
  result: FireCalculationResult;
  currency: CurrencyCode;
}

export function CapitalChart({ result, currency }: CapitalChartProps) {
  const [maxDisplayYears, setMaxDisplayYears] = useState<number>(30);
  const [showBreakdown, setShowBreakdown] = useState<boolean>(false);

  const { rows, retirement_age, years_to_retirement, mode } = result;

  // Filter rows based on selected timeframe
  const chartData = rows.filter((r) => r.year <= maxDisplayYears);

  // Retirement point coordinates for ReferenceDot
  const retirementRow =
    years_to_retirement !== null && years_to_retirement <= maxDisplayYears
      ? rows.find((r) => r.year === years_to_retirement)
      : null;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Динамика роста капитала и целевой суммы</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Точка пересечения линий — момент достижения финансовой независимости
          </p>
        </div>

        {/* Time horizon buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Горизонт:</span>
          {[15, 25, 35, 50].map((horizon) => (
            <button
              key={horizon}
              type="button"
              onClick={() => setMaxDisplayYears(horizon)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                maxDisplayYears === horizon
                  ? "bg-emerald-600 text-white shadow-sm font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {horizon} лет
            </button>
          ))}
          {mode === "flexible" && (
            <button
              type="button"
              onClick={() => setShowBreakdown((prev) => !prev)}
              className={`text-xs px-2 py-1 rounded-lg ml-1 font-medium transition ${
                showBreakdown
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              {showBreakdown ? "Скрыть активы" : "Активы/Подушка"}
            </button>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="year"
              tickFormatter={(year) => {
                const r = rows.find((row) => row.year === year);
                return r ? `${r.age} лет` : `${year} г.`;
              }}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value, currency, { compact: true })}
              width={80}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const row = rows.find((r) => r.year === label);
                if (!row) return null;

                return (
                  <div className="bg-slate-900/95 backdrop-blur text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 space-y-2 min-w-[210px]">
                    <div className="flex items-center justify-between border-b border-slate-750 pb-1.5">
                      <span className="font-bold text-slate-200">
                        Год {row.year} ({row.age} лет)
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          row.is_retired
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {row.is_retired ? "Пенсия достигнута 🎉" : "Фаза накопления"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Общий капитал:
                        </span>
                        <span className="font-bold tabular-nums">
                          {formatCurrency(row.total_capital, currency)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Цель (с инфляцией):
                        </span>
                        <span className="font-bold tabular-nums">
                          {formatCurrency(row.target_capital, currency)}
                        </span>
                      </div>

                      {mode === "flexible" && (
                        <>
                          <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-800">
                            <span>В активах:</span>
                            <span className="tabular-nums">{formatCurrency(row.assets, currency)}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300">
                            <span>В подушке:</span>
                            <span className="tabular-nums">{formatCurrency(row.cushion, currency)}</span>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
                        <span>Расходы в год:</span>
                        <span className="tabular-nums">
                          {formatCurrency(row.annual_expenses, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingTop: "0px" }}
            />

            {/* Line 1: Общий капитал */}
            <Line
              type="monotone"
              dataKey="total_capital"
              name="Общий капитал"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
            />

            {/* Line 2: Необходимая сумма (цель) */}
            <Line
              type="monotone"
              dataKey="target_capital"
              name="Необходимая сумма (цель)"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 5, fill: "#f59e0b", stroke: "#ffffff", strokeWidth: 2 }}
            />

            {/* Optional breakdown lines for flexible mode */}
            {showBreakdown && mode === "flexible" && (
              <>
                <Line
                  type="monotone"
                  dataKey="assets"
                  name="Капитал в активах"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cushion"
                  name="Подушка безопасности"
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  dot={false}
                />
              </>
            )}

            {/* Reference line at retirement year */}
            {years_to_retirement !== null &&
              years_to_retirement <= maxDisplayYears &&
              years_to_retirement > 0 && (
                <ReferenceLine
                  x={years_to_retirement}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{
                    value: `Пенсия (${retirement_age} лет)`,
                    fill: "#047857",
                    fontSize: 11,
                    fontWeight: 700,
                    position: "top",
                  }}
                />
              )}

            {/* Highlight point on the crossing */}
            {retirementRow && (
              <ReferenceDot
                x={retirementRow.year}
                y={retirementRow.total_capital}
                r={6}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={3}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
