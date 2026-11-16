"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { MonteCarloResult } from "@/types/monteCarlo";
import { CurrencyCode } from "@/types/fire";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";
import { HelpButton } from "@/components/common/HelpDialog";
import { MONTE_CARLO_HELP } from "@/data/parametersHelp";

interface MonteCarloFanChartProps {
  result: MonteCarloResult;
  currency: CurrencyCode;
  scaleType: "linear" | "log";
  showSamplePaths: boolean;
}

export function MonteCarloFanChart({
  result,
  currency,
  scaleType,
  showSamplePaths,
}: MonteCarloFanChartProps) {
  const { percentileTrajectory, years, computationTimeMs, simulationCount } = result;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine safe non-zero floor for log scale calculations
  const logFloor = useMemo(() => {
    if (currency === "BYN") return 100;
    if (currency === "RUB") return 10000;
    return 100; // USD / EUR
  }, [currency]);

  // Transform data for stacked shaded bands in Recharts
  const chartData = useMemo(() => {
    return percentileTrajectory.map((pt) => {
      const clamp = (val: number) => (scaleType === "log" ? Math.max(logFloor, val) : val);

      const point: Record<string, number | number[]> = {
        year: pt.year,
        // Clamped values for SVG path calculation in Log mode
        p95: clamp(pt.p95),
        p75: clamp(pt.p75),
        p50: clamp(pt.p50),
        p25: clamp(pt.p25),
        p10: clamp(pt.p10),
        p5: clamp(pt.p5),

        // Raw original values for tooltips
        raw_p95: pt.p95,
        raw_p75: pt.p75,
        raw_p50: pt.p50,
        raw_p25: pt.p25,
        raw_p10: pt.p10,
        raw_p5: pt.p5,
      };

      if (showSamplePaths && pt.samplePaths) {
        pt.samplePaths.forEach((val, idx) => {
          point[`sample_${idx}`] = clamp(val);
          point[`raw_sample_${idx}`] = val;
        });
      }

      return point;
    });
  }, [percentileTrajectory, showSamplePaths, scaleType, logFloor]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col space-y-3">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">
            Вероятностный веер капитала (Монте-Карло)
          </h2>
          <p className="text-xs text-slate-500">
            Коридор 90% вероятности, медиана и стресс-сценарии на {years} лет вперед
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <span
            suppressHydrationWarning
            className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
          >
            {simulationCount.toLocaleString("ru-RU")} прогонов{mounted && computationTimeMs > 0 ? ` за ${computationTimeMs} мс` : ""}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60 text-[11px] font-semibold">
            <span>{scaleType === "log" ? "Шкала: Log" : "Шкала: Линейная"}</span>
            <HelpButton {...MONTE_CARLO_HELP.scale} />
          </div>
        </div>
      </div>

      {/* Chart Legend Pills */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs font-semibold pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3 rounded-xs bg-indigo-500/20 border border-indigo-400/40" />
          <span className="text-slate-600">Коридор 90% (p10–p95)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3 rounded-xs bg-indigo-500/40 border border-indigo-500/60" />
          <span className="text-slate-600">Коридор 50% (p25–p75)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-teal-600 rounded-full" />
          <span className="text-slate-900 font-bold">Медиана (50%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 bg-rose-500 rounded-full border-b border-dashed border-rose-500" />
          <span className="text-rose-700">Стресс (10%)</span>
        </div>
        {showSamplePaths && (
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-slate-300" />
            <span className="text-slate-400">Случайные пути</span>
          </div>
        )}
      </div>

      {/* Interactive Responsive Graph */}
      <div className="w-full h-[360px] sm:h-[460px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => (v === 0 ? "Старт" : `${v} г.`)}
            />
            <YAxis
              scale={scaleType === "log" ? "log" : "linear"}
              domain={scaleType === "log" ? [logFloor, "auto"] : [0, "auto"]}
              allowDataOverflow={true}
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => {
                if (scaleType === "log" && v <= logFloor) {
                  return "0";
                }
                return formatCompactCurrency(v, currency);
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0]?.payload;
                if (!d) return null;

                const yr = Number(label);

                return (
                  <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-xl text-xs space-y-2 min-w-[240px]">
                    <div className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                      <span>{yr === 0 ? "Стартовый момент" : `Год ${yr}`}</span>
                      <span className="text-[10px] text-slate-400">Процентили</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-indigo-900 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-300" />
                          Оптимистичный (95%):
                        </span>
                        <span className="font-extrabold">{formatCurrency(d.raw_p95 ?? d.p95, currency)}</span>
                      </div>

                      <div className="flex items-center justify-between text-indigo-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          Верхний квантиль (75%):
                        </span>
                        <span className="font-bold">{formatCurrency(d.raw_p75 ?? d.p75, currency)}</span>
                      </div>

                      <div className="flex items-center justify-between text-teal-800 font-bold bg-teal-50/70 p-1 rounded-md">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-teal-600" />
                          Медиана (50%):
                        </span>
                        <span className="font-black text-sm">
                          {(d.raw_p50 ?? d.p50) <= 0
                            ? "0 (Исчерпан)"
                            : formatCurrency(d.raw_p50 ?? d.p50, currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-700">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          Нижний квантиль (25%):
                        </span>
                        <span className="font-bold">
                          {(d.raw_p25 ?? d.p25) <= 0
                            ? "0 (Исчерпан)"
                            : formatCurrency(d.raw_p25 ?? d.p25, currency)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-rose-700 font-semibold border-t border-slate-100 pt-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Стресс (10%):
                        </span>
                        <span className="font-extrabold">
                          {(d.raw_p10 ?? d.p10) <= 0
                            ? "0 (Исчерпан)"
                            : formatCurrency(d.raw_p10 ?? d.p10, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            {/* Shaded Area: Outer Band (p10 to p95) */}
            <Area
              type="monotone"
              dataKey="p95"
              baseValue={scaleType === "log" ? logFloor : 0}
              stroke="none"
              fill="#6366f1"
              fillOpacity={0.12}
              isAnimationActive={false}
            />

            {/* Shaded Area: Inner Band (p25 to p75) */}
            <Area
              type="monotone"
              dataKey="p75"
              baseValue={scaleType === "log" ? logFloor : 0}
              stroke="none"
              fill="#4f46e5"
              fillOpacity={0.18}
              isAnimationActive={false}
            />

            {/* Base mask under p10 to keep outer band clean */}
            <Area
              type="monotone"
              dataKey="p10"
              baseValue={scaleType === "log" ? logFloor : 0}
              stroke="none"
              fill="#ffffff"
              fillOpacity={scaleType === "log" ? 0.95 : 0.8}
              isAnimationActive={false}
            />

            {/* Sample random path threads if enabled */}
            {showSamplePaths &&
              [0, 1, 2, 3, 4, 5].map((idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={`sample_${idx}`}
                  stroke="#94a3b8"
                  strokeWidth={0.8}
                  strokeOpacity={0.4}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}

            {/* Stress 10th percentile Line */}
            <Line
              type="monotone"
              dataKey="p10"
              stroke="#f43f5e"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={false}
            />

            {/* 50th percentile (Median) Line */}
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#0d9488"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            {/* 95th percentile Line */}
            <Line
              type="monotone"
              dataKey="p95"
              stroke="#818cf8"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
