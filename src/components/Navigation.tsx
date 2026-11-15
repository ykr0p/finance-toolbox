"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  BarChart3,
  Sparkles,
  ChevronDown,
  Percent,
  Coins,
  BadgeDollarSign,
  TrendingDown,
  Layers,
  ArrowRight,
  Calculator,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { CurrencyDropdown } from "./CurrencyDropdown";

export interface CalculatorItem {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isReady: boolean;
  color: string;
}

export const ALL_CALCULATORS: CalculatorItem[] = [
  {
    id: "fire",
    title: "Калькулятор FIRE",
    shortTitle: "FIRE (Ранняя пенсия)",
    description: "Расчет срока и необходимого капитала для жизни на пассивный доход",
    href: "/",
    icon: Flame,
    isReady: true,
    color: "from-amber-500 to-emerald-500",
  },
  {
    id: "compare",
    title: "Сравнение активов",
    shortTitle: "Сравнение активов",
    description: "Историческая доходность акций РФ, США, золота, недвижимости, депозитов и ОФЗ",
    href: "/compare",
    icon: BarChart3,
    isReady: true,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "compound",
    title: "Сложный процент",
    shortTitle: "Сложный процент",
    description: "Моделирование долгосрочного сложного процента с регулярными довнесениями",
    href: "#",
    icon: Percent,
    badge: "Скоро",
    isReady: false,
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: "dividends",
    title: "Дивидендная зарплата",
    shortTitle: "Дивиденды",
    description: "Калькулятор дивидендного денежного потока и пассивной зарплаты",
    href: "#",
    icon: BadgeDollarSign,
    badge: "Скоро",
    isReady: false,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "inflation",
    title: "Инфляция капитала",
    shortTitle: "Инфляция",
    description: "Анализ обесценения накоплений и расчет реальной покупательной способности",
    href: "#",
    icon: TrendingDown,
    badge: "Скоро",
    isReady: false,
    color: "from-rose-500 to-amber-500",
  },
];

interface NavigationProps {
  rightSlot?: React.ReactNode;
}

export function Navigation({ rightSlot }: NavigationProps) {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();
  const [catalogOpen, setCatalogOpen] = useState(false);
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

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
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
            <nav className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-200">
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

              {/* Catalog Dropdown Button */}
              <div className="relative" ref={catalogRef}>
                <button
                  type="button"
                  onClick={() => setCatalogOpen((prev) => !prev)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
                    catalogOpen ? "bg-slate-100 text-slate-900" : ""
                  }`}
                  title="Все калькуляторы и инструменты"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Каталог</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${catalogOpen ? "rotate-180" : ""}`} />
                </button>

                {catalogOpen && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white p-2 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Все калькуляторы
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        5 инструментов
                      </span>
                    </div>

                    <div className="py-1 space-y-1">
                      {ALL_CALCULATORS.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                          (item.id === "fire" && isFireActive) ||
                          (item.id === "compare" && isCompareActive);

                        if (!item.isReady) {
                          return (
                            <div
                              key={item.id}
                              className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left opacity-60 bg-slate-50/50 cursor-not-allowed"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold text-slate-700">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setCatalogOpen(false)}
                            className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                              isActive
                                ? "bg-slate-100 text-slate-900 font-semibold"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900">
                                  {item.title}
                                </span>
                                {isActive && (
                                  <span className="text-[10px] text-emerald-600 font-semibold">
                                    Открыт
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
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
        <div className="flex md:hidden items-center gap-1 py-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
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
        </div>
      </div>
    </header>
  );
}
