"use client";

import React from "react";
import { FireCalculationResult } from "@/types/fire";
import { formatCurrency, formatYears, formatAge, formatPercent } from "@/lib/formatters";
import {
  Calendar,
  PiggyBank,
  Hourglass,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Coins,
  ShieldCheck,
} from "lucide-react";

interface MetricCardsProps {
  result: FireCalculationResult;
}

export function MetricCards({ result }: MetricCardsProps) {
  const {
    target_capital_today,
    retirement_age,
    years_to_retirement,
    is_already_retired,
    capital_at_retirement,
    annual_expenses_at_retirement,
    current_savings_rate,
    monthly_savings_today,
  } = result;

  const monthlyPassiveIncomeAtRetirement = annual_expenses_at_retirement
    ? annual_expenses_at_retirement / 12
    : 0;

  return (
    <div className="space-y-4">
      {/* Already retired banner or status notice */}
      {is_already_retired && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold">Вы уже достигли финансовой независимости!</h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              Текущий капитал полностью покрывает ваши расходы в соответствии с выбранной моделью FIRE.
            </p>
          </div>
        </div>
      )}

      {retirement_age === null && !is_already_retired && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold">Цель не достигнута за 50 лет</h3>
            <p className="text-xs text-amber-700 mt-0.5">
              Попробуйте увеличить норму сбережений, доход или оптимизировать расходы, чтобы выйти на пенсию быстрее.
            </p>
          </div>
        </div>
      )}

      {/* Primary KPI Grid (The 3 Main Numbers requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Target Capital Today */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Цель в ценах сегодня
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {formatCurrency(target_capital_today, { compact: true })}
            </div>
            <div className="text-xs text-slate-500 mt-1 tabular-nums">
              {formatCurrency(target_capital_today)}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Необходимый капитал</span>
            <span className="font-medium text-emerald-700">100% покрытия</span>
          </div>
        </div>

        {/* Card 2: Retirement Age */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Возраст на пенсии
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {retirement_age !== null ? `${retirement_age} лет` : "50+ лет"}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {retirement_age !== null
                ? `Ранний выход в ${formatAge(retirement_age)}`
                : "Требуется корректировка"}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Статус</span>
            <span
              className={`font-medium ${
                retirement_age !== null && retirement_age <= 45
                  ? "text-emerald-700"
                  : retirement_age !== null
                  ? "text-blue-700"
                  : "text-amber-700"
              }`}
            >
              {retirement_age !== null
                ? retirement_age <= 35
                  ? "FIRE до 35 лет 🎯"
                  : "FIRE достижим"
                : "Не достигнуто"}
            </span>
          </div>
        </div>

        {/* Card 3: Years to Retirement */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Осталось до пенсии
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition">
              <Hourglass className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {years_to_retirement !== null ? formatYears(years_to_retirement) : "50+ лет"}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {years_to_retirement !== null && years_to_retirement > 0
                ? `Активное накопление ${years_to_retirement} ${formatYears(years_to_retirement).split(" ")[1]}`
                : is_already_retired
                ? "Уже на пенсии"
                : "Более 50 лет"}
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Период</span>
            <span className="font-medium text-amber-700">
              {years_to_retirement !== null ? `~${years_to_retirement * 12} мес.` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Норма сбережений</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
              {formatPercent(current_savings_rate, 0)}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1 rounded">
              {monthly_savings_today > 0 ? "Накопление" : "Дефицит"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Капитал к пенсии</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
              {capital_at_retirement !== null
                ? formatCurrency(capital_at_retirement, { compact: true })
                : "—"}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">с инфляцией</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Пассивный доход/мес</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm sm:text-base font-bold text-emerald-700 tabular-nums">
              {monthlyPassiveIncomeAtRetirement > 0
                ? formatCurrency(monthlyPassiveIncomeAtRetirement, { compact: true })
                : "—"}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">в ценах пенсии</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 block">Довнесения сегодня</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
              {formatCurrency(monthly_savings_today, { compact: true })}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">в месяц</span>
          </div>
        </div>
      </div>
    </div>
  );
}
