"use client";

import React, { useState } from "react";
import { FireCalculationResult, SimulationYearRow } from "@/types/fire";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Table, Download, CheckCircle2, ChevronRight, Filter } from "lucide-react";

interface SimulationTableProps {
  result: FireCalculationResult;
}

export function SimulationTable({ result }: SimulationTableProps) {
  const [filterMode, setFilterMode] = useState<"all" | "retirement_plus" | "first_20">("retirement_plus");

  const { rows, years_to_retirement, mode } = result;

  // Filter rows based on view mode
  const displayedRows = rows.filter((row) => {
    if (filterMode === "all") return true;
    if (filterMode === "first_20") return row.year <= 20;
    if (filterMode === "retirement_plus") {
      if (years_to_retirement === null) return row.year <= 25;
      return row.year <= Math.min(50, Math.max(15, years_to_retirement + 7));
    }
    return true;
  });

  // Export to CSV matching Excel columns
  const handleExportCSV = () => {
    const headers = [
      "Год",
      "Возраст",
      "Расходы в год (руб)",
      "Требуемая подушка (руб)",
      "Целевой капитал (руб)",
      "Общий капитал (руб)",
      "Капитал в активах (руб)",
      "Подушка (руб)",
      "Довнесения (руб)",
      "Доход с подушки (руб)",
      "Прирост тела (руб)",
      "Дивиденды всего (руб)",
      "Дивиденды (реинвест) (руб)",
      "Дивиденды (на потребление) (руб)",
      "Статус",
    ];

    const csvRows = [headers.join(";")];

    rows.forEach((r) => {
      const line = [
        r.year,
        r.age,
        Math.round(r.annual_expenses),
        Math.round(r.required_cushion),
        Math.round(r.target_capital),
        Math.round(r.total_capital),
        Math.round(r.assets),
        Math.round(r.cushion),
        Math.round(r.savings_added),
        Math.round(r.cushion_income),
        Math.round(r.capital_body_growth),
        Math.round(r.dividends),
        Math.round(r.dividends_reinvested),
        Math.round(r.dividends_for_consumption),
        r.is_retired ? "Пенсия" : "Накопление",
      ];
      csvRows.push(line.join(";"));
    });

    const blob = new Blob(["\uFEFF" + csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `FIRE_Simulation_${mode}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-600" />
            <span id="simulation-table-caption">
              Таблица симуляции по годам (Модель Excel 2.0)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Детальная разбивка денежных потоков, доходностей и распределения капитала
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter options */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setFilterMode("retirement_plus")}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterMode === "retirement_plus"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              До пенсии + 7 лет
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("first_20")}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterMode === "first_20"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              20 лет
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                filterMode === "all"
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Все 50 лет
            </button>
          </div>

          {/* Export to CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition"
            title="Экспорт таблицы в файл CSV для Excel"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Экспорт в Excel</span>
          </button>
        </div>
      </div>

      {/* Accessible Responsive Table Container */}
      <div
        tabIndex={0}
        role="region"
        aria-labelledby="simulation-table-caption"
        className="overflow-x-auto max-h-[500px] rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 relative"
      >
        <table className="min-w-full border-collapse text-xs text-left">
          {/* Sticky Column Headers */}
          <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 z-20 shadow-sm border-b border-slate-200">
            <tr>
              {/* Sticky row header corner */}
              <th
                scope="col"
                className="py-3 px-3 sticky left-0 z-30 bg-slate-100 border-r border-slate-200 font-bold whitespace-nowrap min-w-[90px]"
              >
                Год / Возраст
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">
                Расходы в год
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">
                Требуемая подушка
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap font-bold text-slate-900 bg-emerald-50/50">
                Общий капитал
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">
                Капитал в активах
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">
                Довнесения (сбережения)
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">
                Доход с подушки
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap">
                Прирост тела
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap text-blue-700">
                Дивиденды (реинвест)
              </th>
              <th scope="col" className="py-3 px-3 text-right whitespace-nowrap text-emerald-700">
                Дивиденды (потребление)
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {displayedRows.map((row) => {
              const isCrossingRow =
                years_to_retirement !== null && row.year === years_to_retirement;

              return (
                <tr
                  key={row.year}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isCrossingRow
                      ? "bg-emerald-50/70 font-medium"
                      : row.is_retired
                      ? "bg-emerald-50/20"
                      : ""
                  }`}
                >
                  {/* Sticky Row Header for Year / Age */}
                  <th
                    scope="row"
                    className={`py-2.5 px-3 sticky left-0 z-10 border-r border-slate-200 whitespace-nowrap font-semibold ${
                      isCrossingRow
                        ? "bg-emerald-100 text-emerald-950 font-bold"
                        : row.year === 0
                        ? "bg-slate-100 text-slate-800"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>
                        {row.year === 0 ? "Старт" : `Г.${row.year}`} ({row.age} лет)
                      </span>
                      {isCrossingRow && (
                        <span
                          className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-600 text-white"
                          title="Момент выхода на пенсию!"
                        >
                          FIRE 🎯
                        </span>
                      )}
                    </div>
                  </th>

                  {/* Расходы в год */}
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 whitespace-nowrap">
                    {formatCurrency(row.annual_expenses)}
                  </td>

                  {/* Требуемая подушка */}
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 whitespace-nowrap">
                    {row.required_cushion > 0
                      ? formatCurrency(row.required_cushion)
                      : "—"}
                  </td>

                  {/* Общий капитал */}
                  <td
                    className={`py-2.5 px-3 text-right tabular-nums font-bold whitespace-nowrap ${
                      isCrossingRow
                        ? "text-emerald-800 bg-emerald-100/50"
                        : row.is_retired
                        ? "text-emerald-700 bg-emerald-50/40"
                        : "text-slate-900 bg-slate-50/30"
                    }`}
                  >
                    {formatCurrency(row.total_capital)}
                  </td>

                  {/* Капитал в активах */}
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-700 whitespace-nowrap">
                    {formatCurrency(row.assets)}
                  </td>

                  {/* Довнесения (сбережения) */}
                  <td className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap">
                    {row.savings_added > 0 ? (
                      <span className="text-slate-800">
                        +{formatCurrency(row.savings_added)}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-normal">0 (Пенсия)</span>
                    )}
                  </td>

                  {/* Доход с подушки */}
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 whitespace-nowrap">
                    {row.cushion_income > 0
                      ? `+${formatCurrency(row.cushion_income)}`
                      : "—"}
                  </td>

                  {/* Прирост тела */}
                  <td className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap">
                    {row.capital_body_growth !== 0 ? (
                      <span
                        className={
                          row.capital_body_growth > 0
                            ? "text-slate-700"
                            : "text-rose-600"
                        }
                      >
                        +{formatCurrency(row.capital_body_growth)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Дивиденды (реинвест) */}
                  <td className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap">
                    {row.dividends_reinvested > 0 ? (
                      <span className="text-blue-700 font-medium">
                        +{formatCurrency(row.dividends_reinvested)}
                      </span>
                    ) : (
                      <span className="text-slate-300">0</span>
                    )}
                  </td>

                  {/* Дивиденды (на потребление) */}
                  <td className="py-2.5 px-3 text-right tabular-nums whitespace-nowrap">
                    {row.dividends_for_consumption > 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        {formatCurrency(row.dividends_for_consumption)}
                      </span>
                    ) : (
                      <span className="text-slate-300">0</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 pt-1">
        <div>
          Показано строк: {displayedRows.length} из {rows.length}
        </div>
        <div className="flex items-center gap-4 mt-1 sm:mt-0 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Зеленый: момент выхода на пенсию
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            Старт: сегодняшнее состояние
          </span>
        </div>
      </div>
    </div>
  );
}
