"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { BarChart3, Info } from "lucide-react";
import { HistogramBin } from "@/types/monteCarlo";
import { CurrencyCode } from "@/types/fire";

interface MonteCarloHistogramProps {
  histogram: HistogramBin[];
  currency: CurrencyCode;
}

export function MonteCarloHistogram({ histogram, currency }: MonteCarloHistogramProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Плотность распределения финального капитала
            </h2>
            <p className="text-xs text-slate-500">
              Частота различных исходов на финише моделирования
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[220px] sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={histogram} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={35}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as HistogramBin;

                return (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1">
                    <div className="font-bold text-slate-900">
                      {d.isDepletedBin ? "🚨 Истощение капитала" : `Диапазон: ${d.label}`}
                    </div>
                    <div className="text-slate-600 flex items-center justify-between gap-4">
                      <span>Доля исходов:</span>
                      <strong className="text-indigo-700">{d.percentage}%</strong>
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      Количество: {d.count.toLocaleString("ru-RU")} сценариев
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
              {histogram.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isDepletedBin ? "#ef4444" : "#4f46e5"}
                  fillOpacity={entry.isDepletedBin ? 0.9 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
