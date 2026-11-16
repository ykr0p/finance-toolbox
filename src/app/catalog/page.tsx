"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  ArrowRight,
  Flame,
  BarChart3,
  Percent,
  BadgeDollarSign,
  Scroll,
  Target,
  Home,
  TrendingDown,
  CreditCard,
  Receipt,
  PiggyBank,
  ShieldCheck,
  PieChart,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CALCULATOR_BLOCKS, CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";
import { CalculatorBlockId, CalculatorMeta } from "@/types/calculators";

const ICON_MAP: Record<string, React.ElementType> = {
  Flame,
  BarChart3,
  Percent,
  BadgeDollarSign,
  Scroll,
  Target,
  Home,
  TrendingDown,
  CreditCard,
  Receipt,
  PiggyBank,
  ShieldCheck,
  PieChart,
  Sparkles,
};

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<CalculatorBlockId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "ready" | "in_development">("all");

  const filteredCalculators = useMemo(() => {
    return CALCULATORS_CATALOG.filter((item) => {
      // Block filter
      if (selectedBlock !== "all" && item.blockId !== selectedBlock) {
        return false;
      }
      // Status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesDetails = item.detailedOverview.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesDetails;
      }
      return true;
    });
  }, [searchQuery, selectedBlock, statusFilter]);

  const blocksList: CalculatorBlockId[] = ["investments", "loans", "taxes", "budget", "advanced"];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navigation />

      <main className="flex-1 max-w-[1840px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-8">
        {/* Catalog Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 sm:p-10 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-200 border border-white/15">
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              <span>Полный каталог инструментов (15 калькуляторов в 5 блоках)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Каталог финансовых калькуляторов
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              Единый портал инструментов для управления личными финансами: инвестиции, ранний выход на пенсию, кредиты, налоги, бюджет и математический анализ активов.
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400 to-transparent pointer-events-none" />
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск калькулятора по названию или теме..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            {/* Status Segment Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${
                  statusFilter === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Все ({CALCULATORS_CATALOG.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("ready")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  statusFilter === "ready"
                    ? "bg-white text-emerald-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Готовые (2)</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("in_development")}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                  statusFilter === "in_development"
                    ? "bg-white text-amber-800 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Clock className="w-3 h-3 text-amber-600" />
                <span>В разработке (13)</span>
              </button>
            </div>
          </div>

          {/* Block Selection Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              type="button"
              onClick={() => setSelectedBlock("all")}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition border ${
                selectedBlock === "all"
                  ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Все блоки (5)
            </button>
            {blocksList.map((blockId) => {
              const b = CALCULATOR_BLOCKS[blockId];
              const count = CALCULATORS_CATALOG.filter((c) => c.blockId === blockId).length;
              const isSelected = selectedBlock === blockId;

              return (
                <button
                  key={blockId}
                  type="button"
                  onClick={() => setSelectedBlock(blockId)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{b.emoji}</span>
                  <span>{b.shortTitle}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grouped Calculators Display */}
        {selectedBlock === "all" && !searchQuery.trim() && statusFilter === "all" ? (
          // Full Categorized View by 5 Blocks
          <div className="space-y-10">
            {blocksList.map((blockId) => {
              const b = CALCULATOR_BLOCKS[blockId];
              const items = CALCULATORS_CATALOG.filter((c) => c.blockId === blockId);

              return (
                <div key={blockId} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{b.emoji}</span>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Блок {b.number}: {b.title}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500">{b.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <CalculatorCatalogCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Filtered Grid View
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Найдено калькуляторов: {filteredCalculators.length}</span>
              {(searchQuery || selectedBlock !== "all" || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedBlock("all");
                    setStatusFilter("all");
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>

            {filteredCalculators.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Ничего не найдено</p>
                <p className="text-xs text-slate-400">
                  Попробуйте изменить поисковый запрос или выбрать другой блок
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCalculators.map((item) => (
                  <CalculatorCatalogCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <p>
            Платформа персонального финансового моделирования и анализа классов активов.
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Все расчеты носят информационный характер и не являются индивидуальной инвестиционной рекомендацией.
          </p>
        </div>
      </footer>
    </div>
  );
}

function CalculatorCatalogCard({ item }: { item: CalculatorMeta }) {
  const Icon = ICON_MAP[item.iconName] ?? Layers;
  const isReady = item.status === "ready";
  const block = CALCULATOR_BLOCKS[item.blockId];

  return (
    <Link
      href={item.href}
      className={`rounded-2xl border p-5 transition-all flex flex-col justify-between group relative overflow-hidden ${
        isReady
          ? "bg-white border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md"
          : "bg-white/90 border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-sm"
      }`}
    >
      {/* Top Accent Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.gradient}`} />

      <div className="space-y-3 pt-1">
        {/* Header: Icon + Category + Status Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.gradient} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${block.badgeBg} ${block.badgeText}`}>
              {block.shortTitle}
            </span>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isReady
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300/60"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {isReady ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-slate-400" />}
            <span>{item.badge}</span>
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Key Features Preview */}
        <div className="space-y-1 pt-1 border-t border-slate-100">
          {item.plannedFeatures.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
        <span className={isReady ? "text-emerald-700" : "text-slate-500"}>
          {isReady ? "Перейти к расчету" : "О калькуляторе"}
        </span>
        <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
          <span>Открыть</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
