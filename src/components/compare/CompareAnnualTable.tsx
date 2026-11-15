"use client";

import React, { useState } from "react";
import { Download, Table as TableIcon, Percent, DollarSign } from "lucide-react";
import { CompareResult } from "@/types/compare";
import { CurrencyCode, CURRENCY_CONFIGS } from "@/types/fire";
import { formatCurrency } from "@/lib/formatters";
import { ASSET_DEFINITIONS } from "@/data/historicalReturns";

interface CompareAnnualTableProps {
  result: CompareResult;
  currency: CurrencyCode;
}

type TableMode = "returns" | "capital";

export function CompareAnnualTable({
  result,
  currency,
}: CompareAnnualTableProps) {
  const [mode, setMode] = useState<TableMode>("returns");
  const currencyConfig = CURRENCY_CONFIGS[currency] ?? CURRENCY_CONFIGS.RUB;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Год",
      "Инфляция (%)",
      "Вложено средств",
      ...result.metrics.map((m) => m.name),
    ];

    const rows = result.annualReturns.map((ar, idx) => {
      // Find corresponding chartPoint
      const cp = result.chartPoints.find((p) => p.year === ar.year);
      const rowData = [
        ar.year,
        ar.inflation_rub,
        cp?.totalInvested ?? "",
        ...result.metrics.map((m) =>
          mode === "returns" ? ar[m.assetId] ?? "" : cp?.[m.assetId] ?? ""
        ),
      ];
      return rowData.join(";");
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `asset_comparison_${result.startYear}_${result.endYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <TableIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Погодовая таблица результатов
            </h2>
            <p className="text-xs text-slate-500">
              Детализация динамики капитала и доходностей по каждому году
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setMode("returns")}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                mode === "returns"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Percent className="w-3 h-3 text-emerald-600" />
              Доходность (%)
            </button>
            <button
              type="button"
              onClick={() => setMode("capital")}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                mode === "capital"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <DollarSign className="w-3 h-3 text-blue-600" />
              Капитал ({currency})
            </button>
          </div>

          {/* Export CSV button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Экспорт CSV</span>
          </button>
        </div>
      </div>

      {/* Accessible Table Container */}
      <div
        className="overflow-x-auto rounded-xl border border-slate-200 max-h-[480px] relative"
        tabIndex={0}
        role="region"
        aria-label="Таблица сравнения активов по годам"
      >
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-xs text-slate-700 font-semibold">
            <tr>
              <th className="py-2.5 px-3 whitespace-nowrap bg-slate-50">Год</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-right bg-slate-50">
                Инфляция
              </th>
              {mode === "capital" && (
                <th className="py-2.5 px-3 whitespace-nowrap text-right bg-slate-50 text-slate-500">
                  Вложено
                </th>
              )}
              {result.metrics.map((m) => (
                <th
                  key={m.assetId}
                  className="py-2.5 px-3 whitespace-nowrap text-right bg-slate-50"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: m.color }}
                    />
                    <span>{m.shortName}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-800">
            {result.annualReturns.map((ar) => {
              const cp = result.chartPoints.find((p) => p.year === ar.year);

              return (
                <tr key={ar.year} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {ar.year}
                  </td>
                  <td className="py-2 px-3 text-right tabular-nums text-slate-500 whitespace-nowrap">
                    {ar.inflation_rub > 0 ? `+${ar.inflation_rub}%` : `${ar.inflation_rub}%`}
                  </td>

                  {mode === "capital" && (
                    <td className="py-2 px-3 text-right tabular-nums text-slate-500 whitespace-nowrap">
                      {formatCurrency(cp?.totalInvested ?? 0, currency)}
                    </td>
                  )}

                  {result.metrics.map((m) => {
                    if (mode === "returns") {
                      const ret = ar[m.assetId] as number | undefined;
                      const isPositive = typeof ret === "number" && ret > 0;
                      const isZero = typeof ret === "number" && ret === 0;

                      return (
                        <td
                          key={m.assetId}
                          className="py-2 px-3 text-right tabular-nums font-semibold whitespace-nowrap"
                        >
                          {typeof ret === "number" ? (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[11px] ${
                                isPositive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : isZero
                                  ? "text-slate-500"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {ret > 0 ? `+${ret}%` : `${ret}%`}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      );
                    } else {
                      const cap = cp?.[m.assetId] as number | undefined;
                      return (
                        <td
                          key={m.assetId}
                          className="py-2 px-3 text-right tabular-nums font-medium text-slate-800 whitespace-nowrap"
                        >
                          {typeof cap === "number" ? (
                            formatCurrency(cap, currency)
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* Table Summary Footer */}
          <tfoot className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900 sticky bottom-0">
            <tr>
              <td className="py-2.5 px-3">
                {mode === "returns" ? "Среднегодовая (CAGR)" : "Итоговый капитал"}
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">
                +{result.inflationCompoundPct}%
              </td>

              {mode === "capital" && (
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">
                  {formatCurrency(result.totalInvested, currency)}
                </td>
              )}

              {result.metrics.map((m) => (
                <td key={m.assetId} className="py-2.5 px-3 text-right tabular-nums">
                  {mode === "returns" ? (
                    <span className="text-emerald-700 font-extrabold">
                      +{m.cagr}%/год
                    </span>
                  ) : (
                    <span className="text-slate-900 font-extrabold">
                      {formatCurrency(m.finalValue, currency)}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
