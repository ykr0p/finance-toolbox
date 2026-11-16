"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Layers,
  Flame,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CalculatorMeta } from "@/types/calculators";
import { CALCULATOR_BLOCKS, CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

interface UnderDevelopmentPageProps {
  meta: CalculatorMeta;
}

export function UnderDevelopmentPage({ meta }: UnderDevelopmentPageProps) {
  const block = CALCULATOR_BLOCKS[meta.blockId];
  const relatedCalculators = CALCULATORS_CATALOG.filter(
    (c) => c.blockId === meta.blockId && c.id !== meta.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navigation />

      <main className="flex-1 max-w-[1840px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link href="/catalog" className="hover:text-slate-900 transition-colors">
            Каталог
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400">{block.shortTitle}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-bold truncate">{meta.shortTitle}</span>
        </div>

        {/* Hero Title Card */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-blue-100 border border-white/15">
                <span>{block.emoji}</span>
                <span>{block.title}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Clock className="w-3 h-3" />
                <span>В разработке</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {meta.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-3xl">
              {meta.detailedOverview}
            </p>
          </div>

          {/* Decorative background glow */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 to-transparent pointer-events-none" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Planned Capabilities and Roadmap */}
          <div className="lg:col-span-8 space-y-6">
            {/* Planned Features Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Запланированный функционал инструмента
                  </h2>
                  <p className="text-xs text-slate-500">
                    Что будет рассчитывать и визуализировать данный калькулятор
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meta.plannedFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Статус разработки</span>
                </div>
                <p className="text-amber-800/90 leading-relaxed">
                  Архитектурный каркас подпапки, модели данных и типы для этого калькулятора уже добавлены в проект. Полный интерактивный интерфейс находится в активной разработке.
                </p>
              </div>
            </div>

            {/* Related Calculators in the same Block */}
            {relatedCalculators.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Другие калькуляторы блока «{block.shortTitle}»</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedCalculators.map((rc) => (
                    <Link
                      key={rc.id}
                      href={rc.href}
                      className="p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-start justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                            {rc.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {rc.description}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          rc.status === "ready"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {rc.badge}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Ready-to-use Tools & Quick Navigation */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active Available Calculators Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Доступные готовые калькуляторы
                </h3>
                <p className="text-xs text-slate-500">
                  Вы можете воспользоваться готовыми инструментами прямо сейчас:
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/"
                  className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-all flex items-center justify-between group block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-emerald-800">
                        Калькулятор FIRE
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Ранняя пенсия и пассивный доход
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/compare"
                  className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-all flex items-center justify-between group block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-800">
                        Сравнение активов
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        10 классов активов и онлайн-котировки
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <Link
                href="/catalog"
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-center text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>Открыть полный каталог (15 инструментов)</span>
              </Link>
            </div>
          </div>
        </div>
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
