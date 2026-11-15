"use client";

import React, { useState } from "react";
import {
  FireInputs,
  SimpleFireInputs,
  FlexibleFireInputs,
  CalculatorMode,
  CurrencyCode,
  CURRENCY_CONFIGS,
} from "@/types/fire";
import { validateInputs } from "@/lib/validation";
import { formatCurrency, formatPercent, getCurrencySymbol } from "@/lib/formatters";
import { CurrencyIcon } from "./icons/CurrencyIcon";
import {
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  Wallet,
  TrendingUp,
  Shield,
  Layers,
  ArrowRight,
  User,
} from "lucide-react";

interface InputFormProps {
  mode: CalculatorMode;
  currency: CurrencyCode;
  simpleInputs: SimpleFireInputs;
  flexibleInputs: FlexibleFireInputs;
  onChangeSimple: (inputs: SimpleFireInputs) => void;
  onChangeFlexible: (inputs: FlexibleFireInputs) => void;
}

export function InputForm({
  mode,
  currency,
  simpleInputs,
  flexibleInputs,
  onChangeSimple,
  onChangeFlexible,
}: InputFormProps) {
  const isFlexible = mode === "flexible";
  const currencyConfig = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.RUB;
  const currencySymbol = currencyConfig.symbol;
  const currentInputs: FireInputs = isFlexible
    ? { mode: "flexible", ...flexibleInputs }
    : { mode: "simple", ...simpleInputs };

  const { errors, warnings } = validateInputs(currentInputs);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const updateNumberField = (field: string, value: number) => {
    if (isFlexible) {
      onChangeFlexible({
        ...flexibleInputs,
        [field]: value,
      });
    } else {
      onChangeSimple({
        ...simpleInputs,
        [field]: value,
      });
    }
  };

  const handleInputChange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/\s+/g, "").replace(",", ".");
    const val = cleaned === "" ? 0 : Number(cleaned);
    if (!isNaN(val)) {
      updateNumberField(field, val);
    }
  };

  // Helper for numeric inputs with currency/percent badges
  const renderField = ({
    name,
    label,
    tooltip,
    value,
    suffix,
    step = 1,
    min = 0,
    max,
    quickSuggestions,
  }: {
    name: string;
    label: string;
    tooltip: string;
    value: number;
    suffix: string;
    step?: number;
    min?: number;
    max?: number;
    quickSuggestions?: number[];
  }) => {
    const error = touchedFields[name] ? errors[name] : undefined;
    const warning = warnings[name];
    const isCurrencyField =
      suffix === currencySymbol ||
      suffix === "₽" ||
      suffix === "$" ||
      suffix === "€" ||
      suffix === "BYN";

    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={`input-${name}`}
            className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
          >
            <span>{label}</span>
            <span
              className="text-slate-400 hover:text-slate-600 cursor-help"
              title={tooltip}
              aria-label={tooltip}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </label>
          {quickSuggestions && (
            <div className="flex items-center gap-1">
              {quickSuggestions.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => updateNumberField(name, sug)}
                  className={`text-[10px] px-1.5 py-0.5 rounded transition ${
                    value === sug
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {suffix === "%" ? `${sug}%` : suffix === "мес." ? `${sug} мес.` : sug}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative rounded-lg shadow-sm">
          <input
            id={`input-${name}`}
            name={name}
            type="number"
            step={step}
            min={min}
            max={max}
            value={value === 0 ? "" : value}
            onChange={(e) => handleInputChange(name, e)}
            onBlur={() => handleBlur(name)}
            placeholder="0"
            className={`block w-full rounded-lg border py-2 pl-3 pr-16 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 tabular-nums transition ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-200"
            }`}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {isCurrencyField ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                <CurrencyIcon currency={currency} className="w-3.5 h-3.5 text-slate-500" />
                <span>{currency}</span>
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-400">{suffix}</span>
            )}
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && warning && (
          <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{warning}</span>
          </p>
        )}
      </div>
    );
  };

  const monthlySavings = isFlexible
    ? flexibleInputs.monthly_income - flexibleInputs.monthly_expenses
    : simpleInputs.monthly_income - simpleInputs.monthly_expenses;

  const currentIncome = isFlexible ? flexibleInputs.monthly_income : simpleInputs.monthly_income;
  const savingsRate = currentIncome > 0 ? (monthlySavings / currentIncome) * 100 : 0;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      aria-label="Параметры калькулятора FIRE"
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-6"
    >
      {/* Group 1: Личные данные и Денежный поток */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <User className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Доходы и расходы
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField({
            name: "age",
            label: "Ваш возраст",
            tooltip: "Текущий возраст на старте инвестирования",
            value: isFlexible ? flexibleInputs.age : simpleInputs.age,
            suffix: "лет",
            step: 1,
            min: 18,
            max: 85,
            quickSuggestions: [25, 30, 35, 40],
          })}

          {renderField({
            name: "monthly_income",
            label: "Ежемесячный доход",
            tooltip: "Ваш чистый совокупный доход в месяц (после налогов)",
            value: isFlexible ? flexibleInputs.monthly_income : simpleInputs.monthly_income,
            suffix: currencySymbol,
            step: currencyConfig.incomeStep,
            min: 0,
          })}

          {renderField({
            name: "monthly_expenses",
            label: "Ежемесячные расходы",
            tooltip: "Текущие средние расходы на жизнь в месяц",
            value: isFlexible ? flexibleInputs.monthly_expenses : simpleInputs.monthly_expenses,
            suffix: currencySymbol,
            step: currencyConfig.incomeStep,
            min: 0,
          })}

          {renderField({
            name: "personal_inflation",
            label: "Личная инфляция",
            tooltip: "Ожидаемый среднегодовой рост ваших расходов",
            value: isFlexible ? flexibleInputs.personal_inflation : simpleInputs.personal_inflation,
            suffix: "%",
            step: 0.5,
            min: 0,
            max: 50,
            quickSuggestions: [6, 8, 10, 12],
          })}

          {renderField({
            name: "savings_indexation",
            label: "Индексация сбережений",
            tooltip: "Ежегодный рост суммы ваших ежемесячных пополнений (например, рост зарплаты)",
            value: isFlexible ? flexibleInputs.savings_indexation : simpleInputs.savings_indexation,
            suffix: "%",
            step: 0.5,
            min: 0,
            max: 50,
            quickSuggestions: [5, 10, 15],
          })}

          {/* Quick Cash Flow Pill */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex flex-col justify-center">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Ежемесячные сбережения
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span
                className={`text-base font-bold tabular-nums ${
                  monthlySavings >= 0 ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {formatCurrency(monthlySavings, currency)}
              </span>
              <span className="text-xs font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {savingsRate.toFixed(0)}% дохода
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Group 2: Стартовый капитал и Пассивы */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Wallet className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Текущий капитал
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField({
            name: "current_assets",
            label: "Капитал в активах",
            tooltip: "Текущие средства в акциях, облигациях, фондах или депозитах",
            value: isFlexible ? flexibleInputs.current_assets : simpleInputs.current_assets,
            suffix: currencySymbol,
            step: currencyConfig.assetsStep,
            min: 0,
          })}

          {renderField({
            name: "liabilities_value",
            label: "Стоимость пассивов",
            tooltip:
              "Продажная стоимость имущества (машина, гараж, дача), если решите продать для инвестиций",
            value: isFlexible ? flexibleInputs.liabilities_value : simpleInputs.liabilities_value,
            suffix: currencySymbol,
            step: currencyConfig.assetsStep,
            min: 0,
          })}

          {/* Flexible only fields */}
          {isFlexible && (
            <>
              {renderField({
                name: "short_term_debts",
                label: "Краткосрочные долги",
                tooltip:
                  "Потребительские кредиты, кредитные карты и долги, которые нужно вычесть из капитала",
                value: flexibleInputs.short_term_debts,
                suffix: currencySymbol,
                step: currencyConfig.assetsStep,
                min: 0,
              })}

              {renderField({
                name: "cushion_months",
                label: "Подушка безопасности",
                tooltip:
                  "Запас на непредвиденные расходы в месяцах жизни (хранится в защитных активах)",
                value: flexibleInputs.cushion_months,
                suffix: "мес.",
                step: 1,
                min: 0,
                max: 36,
                quickSuggestions: [3, 6, 12],
              })}

              {renderField({
                name: "cushion_yield",
                label: "Доходность подушки",
                tooltip:
                  "Процентная ставка по подушке (накопительный счет, фонд денежного рынка LQDT)",
                value: flexibleInputs.cushion_yield,
                suffix: "%",
                step: 0.5,
                min: 0,
                max: 30,
                quickSuggestions: [10, 12, 14],
              })}
            </>
          )}
        </div>
      </div>

      {/* Group 3: Рыночные ожидания и параметры FIRE */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Доходность и модель FIRE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField({
            name: "dividend_yield",
            label: "Дивидендная доходность",
            tooltip: "Среднегодовая дивидендная доходность инвестиционного портфеля",
            value: isFlexible ? flexibleInputs.dividend_yield : simpleInputs.dividend_yield,
            suffix: "%",
            step: 0.5,
            min: 1,
            max: 30,
            quickSuggestions: [7, 8, 9, 10],
          })}

          {renderField({
            name: "capital_growth",
            label: "Рост тела капитала",
            tooltip: "Ожидаемый прирост стоимости самих активов в год (помимо дивидендов)",
            value: isFlexible ? flexibleInputs.capital_growth : simpleInputs.capital_growth,
            suffix: "%",
            step: 0.5,
            min: -10,
            max: 30,
            quickSuggestions: [5, 7, 9],
          })}

          {/* Simple Version: Capital Multiplier */}
          {!isFlexible && (
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-capital_multiplier"
                  className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <span>Множитель капитала</span>
                  <span
                    className="text-slate-400 hover:text-slate-600 cursor-help"
                    title="1 — дивиденды полностью покрывают расходы (1x). 2 — дивиденды в 2 раза превышают расходы (2x запас прочности)"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </label>
                <span className="text-xs font-bold text-emerald-700">
                  {simpleInputs.capital_multiplier}x
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateNumberField("capital_multiplier", 1)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left transition ${
                    simpleInputs.capital_multiplier === 1
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-bold">1x (Базовый)</div>
                  <div className="text-[11px] text-slate-500">
                    Дивиденды = 100% расходов
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateNumberField("capital_multiplier", 2)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-left transition ${
                    simpleInputs.capital_multiplier === 2
                      ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="font-bold">2x (Удвоенный)</div>
                  <div className="text-[11px] text-slate-500">
                    Дивиденды x2 (высокая надежность)
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Flexible Version: Dividend Consumption Pct */}
          {isFlexible && (
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-dividend_consumption_pct"
                  className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <span>Доля дивидендов на потребление</span>
                  <span
                    className="text-slate-400 hover:text-slate-600 cursor-help"
                    title="Какая доля дивидендов идет на жизнь на пенсии. Остаток реинвестируется для защиты от инфляции"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </label>
                <span className="text-xs font-bold text-emerald-700">
                  {flexibleInputs.dividend_consumption_pct}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="input-dividend_consumption_pct"
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={flexibleInputs.dividend_consumption_pct}
                  onChange={(e) =>
                    updateNumberField("dividend_consumption_pct", Number(e.target.value))
                  }
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>50% (реинвест 50%)</span>
                <span>70% (реинвест 30%)</span>
                <span>100% (все на жизнь)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
