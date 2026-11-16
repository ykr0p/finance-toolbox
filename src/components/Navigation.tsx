"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  ChevronDown,
  Layers,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { CurrencyDropdown } from "./CurrencyDropdown";
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

interface NavigationProps {
  rightSlot?: React.ReactNode;
}

export function Navigation({ rightSlot }: NavigationProps) {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [activeCatalogBlock, setActiveCatalogBlock] = useState<CalculatorBlockId>("investments");
  const catalogRef = useRef<HTMLDivElement>(null);

  // Close catalog on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setCatalogOpen(false);
      }
    }
    if (catalogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [catalogOpen]);

  const isFireActive = pathname === "/";
  const isCompareActive = pathname === "/compare";
  const isCatalogActive = pathname === "/catalog";

  const blockCalculators = CALCULATORS_CATALOG.filter(
    (c) => c.blockId === activeCatalogBlock
  );

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-5 lg:gap-6">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-600 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white shrink-0 group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight block leading-tight">
                  Финансовый Калькулятор
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:block leading-none mt-0.5">
                  Инструменты финансового моделирования
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200">
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isFireActive
                    ? "bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${isFireActive ? "text-emerald-600" : "text-slate-400"}`} />
                <span>Калькулятор FIRE</span>
              </Link>

              <Link
                href="/compare"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isCompareActive
                    ? "bg-blue-50 text-blue-800 shadow-xs border border-blue-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <BarChart3 className={`w-3.5 h-3.5 ${isCompareActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>Сравнение активов</span>
              </Link>

              {/* Rich Multi-block Catalog Dropdown */}
              <div className="relative" ref={catalogRef}>
                <button
                  type="button"
                  onClick={() => setCatalogOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    catalogOpen || isCatalogActive
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  title="Все 15 калькуляторов по категориям"
                >
                  <Layers className={`w-3.5 h-3.5 ${catalogOpen || isCatalogActive ? "text-white" : "text-slate-500"}`} />
                  <span>Каталог (15)</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${catalogOpen ? "rotate-180" : ""}`} />
                </button>

                {catalogOpen && (
                  <div className="absolute left-0 mt-2 w-[520px] rounded-2xl bg-white p-3 shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Каталог финансовых инструментов
                        </span>
                      </div>
                      <Link
                        href="/catalog"
                        onClick={() => setCatalogOpen(false)}
                        className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1"
                      >
                        <span>Все 15 на одной странице</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Block Tabs inside Dropdown */}
                    <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl my-2">
                      {(["investments", "loans", "taxes", "budget", "advanced"] as CalculatorBlockId[]).map((bId) => {
                        const b = CALCULATOR_BLOCKS[bId];
                        const isCurrent = activeCatalogBlock === bId;

                        return (
                          <button
                            key={bId}
                            type="button"
                            onClick={() => setActiveCatalogBlock(bId)}
                            className={`text-[10px] py-1.5 px-1 rounded-lg font-bold transition flex flex-col items-center justify-center leading-tight ${
                              isCurrent
                                ? "bg-white text-slate-900 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <span className="text-xs">{b.emoji}</span>
                            <span className="truncate w-full text-center mt-0.5">{b.shortTitle}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Calculators in selected block */}
                    <div className="py-1 space-y-1 max-h-[320px] overflow-y-auto pr-1">
                      {blockCalculators.map((item) => {
                        const Icon = ICON_MAP[item.iconName] ?? Layers;
                        const isCurrentRoute = pathname === item.href;
                        const isReady = item.status === "ready";

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setCatalogOpen(false)}
                            className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors ${
                              isCurrentRoute
                                ? "bg-slate-100 text-slate-900 font-semibold"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${item.gradient} bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5`}
                            >
                              <Icon className="w-3.5 h-3.5 text-white stroke-[2.2]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {item.title}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                                    isReady
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <Link
                        href="/catalog"
                        onClick={() => setCatalogOpen(false)}
                        className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-center text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>Открыть интерактивный каталог всех калькуляторов</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right: Custom rightSlot (presets) + Currency Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {rightSlot}
            <CurrencyDropdown
              currency={currency}
              onChangeCurrency={setCurrency}
            />
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center gap-1.5 py-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isFireActive
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-emerald-600" />
            <span>Калькулятор FIRE</span>
          </Link>

          <Link
            href="/compare"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isCompareActive
                ? "bg-blue-50 text-blue-800 border border-blue-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Сравнение активов</span>
          </Link>

          <Link
            href="/catalog"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              isCatalogActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Каталог (15)</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
