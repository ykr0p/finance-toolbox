"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CalculatorMode,
  SimpleFireInputs,
  FlexibleFireInputs,
  FireInputs,
  CurrencyCode,
  CURRENCY_CONFIGS,
} from "@/types/fire";
import { calculateFIRE } from "@/lib/calculator";
import { convertCurrencyValue } from "@/lib/formatters";
import { useCurrency } from "@/context/CurrencyContext";
import { Header } from "./Header";
import { Tabs } from "./Tabs";
import { InputForm } from "./InputForm";
import { MetricCards } from "./MetricCards";
import { CapitalChart } from "./CapitalChart";
import { SimulationTable } from "./SimulationTable";

const DEFAULT_SIMPLE_INPUTS: SimpleFireInputs = {
  age: 30,
  monthly_income: 150000,
  personal_inflation: 10,
  savings_indexation: 10,
  monthly_expenses: 60000,
  current_assets: 1500000,
  liabilities_value: 0,
  dividend_yield: 8,
  capital_growth: 7,
  capital_multiplier: 1,
};

const DEFAULT_FLEXIBLE_INPUTS: FlexibleFireInputs = {
  age: 30,
  monthly_income: 150000,
  personal_inflation: 10,
  savings_indexation: 10,
  monthly_expenses: 60000,
  current_assets: 1500000,
  liabilities_value: 0,
  dividend_yield: 8,
  capital_growth: 7,
  cushion_months: 6,
  short_term_debts: 0,
  cushion_yield: 12,
  dividend_consumption_pct: 70,
};

export function FireCalculator() {
  const [mode, setMode] = useState<CalculatorMode>("simple");
  const { currency, setCurrency } = useCurrency();
  const [prevCurrency, setPrevCurrency] = useState<CurrencyCode>(currency);
  const [simpleInputs, setSimpleInputs] = useState<SimpleFireInputs>(() => {
    const cfg = CURRENCY_CONFIGS[currency] ?? CURRENCY_CONFIGS.RUB;
    return {
      ...DEFAULT_SIMPLE_INPUTS,
      monthly_income: cfg.defaultMonthlyIncome,
      monthly_expenses: cfg.defaultMonthlyExpenses,
      current_assets: cfg.defaultAssets,
    };
  });
  const [flexibleInputs, setFlexibleInputs] = useState<FlexibleFireInputs>(() => {
    const cfg = CURRENCY_CONFIGS[currency] ?? CURRENCY_CONFIGS.RUB;
    return {
      ...DEFAULT_FLEXIBLE_INPUTS,
      monthly_income: cfg.defaultMonthlyIncome,
      monthly_expenses: cfg.defaultMonthlyExpenses,
      current_assets: cfg.defaultAssets,
    };
  });

  // Currency switch handler with automatic smart scaling of monetary amounts
  useEffect(() => {
    if (currency !== prevCurrency) {
      setSimpleInputs((prev) => ({
        ...prev,
        monthly_income: convertCurrencyValue(prev.monthly_income, prevCurrency, currency),
        monthly_expenses: convertCurrencyValue(prev.monthly_expenses, prevCurrency, currency),
        current_assets: convertCurrencyValue(prev.current_assets, prevCurrency, currency),
        liabilities_value: convertCurrencyValue(prev.liabilities_value, prevCurrency, currency),
      }));

      setFlexibleInputs((prev) => ({
        ...prev,
        monthly_income: convertCurrencyValue(prev.monthly_income, prevCurrency, currency),
        monthly_expenses: convertCurrencyValue(prev.monthly_expenses, prevCurrency, currency),
        current_assets: convertCurrencyValue(prev.current_assets, prevCurrency, currency),
        liabilities_value: convertCurrencyValue(prev.liabilities_value, prevCurrency, currency),
        short_term_debts: convertCurrencyValue(prev.short_term_debts, prevCurrency, currency),
      }));

      setPrevCurrency(currency);
    }
  }, [currency, prevCurrency]);

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
  };

  // Sync common fields when mode switches so the user doesn't lose data
  const handleModeChange = (newMode: CalculatorMode) => {
    if (newMode === "flexible" && mode === "simple") {
      setFlexibleInputs((prev) => ({
        ...prev,
        age: simpleInputs.age,
        monthly_income: simpleInputs.monthly_income,
        personal_inflation: simpleInputs.personal_inflation,
        savings_indexation: simpleInputs.savings_indexation,
        monthly_expenses: simpleInputs.monthly_expenses,
        current_assets: simpleInputs.current_assets,
        liabilities_value: simpleInputs.liabilities_value,
        dividend_yield: simpleInputs.dividend_yield,
        capital_growth: simpleInputs.capital_growth,
      }));
    } else if (newMode === "simple" && mode === "flexible") {
      setSimpleInputs((prev) => ({
        ...prev,
        age: flexibleInputs.age,
        monthly_income: flexibleInputs.monthly_income,
        personal_inflation: flexibleInputs.personal_inflation,
        savings_indexation: flexibleInputs.savings_indexation,
        monthly_expenses: flexibleInputs.monthly_expenses,
        current_assets: flexibleInputs.current_assets,
        liabilities_value: flexibleInputs.liabilities_value,
        dividend_yield: flexibleInputs.dividend_yield,
        capital_growth: flexibleInputs.capital_growth,
      }));
    }
    setMode(newMode);
  };

  const handleSelectPreset = (preset: "standard" | "aggressive" | "conservative") => {
    const cfg = CURRENCY_CONFIGS[currency];
    const baseIncome = cfg.defaultMonthlyIncome;
    const baseExpenses = cfg.defaultMonthlyExpenses;
    const baseAssets = cfg.defaultAssets;

    if (preset === "standard") {
      const stdCommon = {
        age: 30,
        monthly_income: baseIncome,
        monthly_expenses: baseExpenses,
        personal_inflation: 10,
        savings_indexation: 10,
        current_assets: baseAssets,
        liabilities_value: 0,
        dividend_yield: 8,
        capital_growth: 7,
      };
      setSimpleInputs({
        ...stdCommon,
        capital_multiplier: 1,
      });
      setFlexibleInputs({
        ...stdCommon,
        cushion_months: 6,
        short_term_debts: 0,
        cushion_yield: 12,
        dividend_consumption_pct: 70,
      });
    } else if (preset === "aggressive") {
      const aggIncome = Math.round((baseIncome * 1.65) / cfg.incomeStep) * cfg.incomeStep;
      const aggExpenses = Math.round((baseExpenses * 1.15) / cfg.incomeStep) * cfg.incomeStep;
      const aggAssets = Math.round((baseAssets * 1.6) / cfg.assetsStep) * cfg.assetsStep;
      const aggLiabilities = Math.round((baseAssets * 0.3) / cfg.assetsStep) * cfg.assetsStep;

      const aggCommon = {
        age: 26,
        monthly_income: aggIncome,
        monthly_expenses: aggExpenses,
        personal_inflation: 8,
        savings_indexation: 12,
        current_assets: aggAssets,
        liabilities_value: aggLiabilities,
        dividend_yield: 9,
        capital_growth: 8,
      };
      setSimpleInputs({
        ...aggCommon,
        capital_multiplier: 1,
      });
      setFlexibleInputs({
        ...aggCommon,
        cushion_months: 4,
        short_term_debts: 0,
        cushion_yield: 13,
        dividend_consumption_pct: 70,
      });
    } else if (preset === "conservative") {
      const consIncome = Math.round((baseIncome * 0.8) / cfg.incomeStep) * cfg.incomeStep;
      const consExpenses = Math.round((baseExpenses * 0.9) / cfg.incomeStep) * cfg.incomeStep;
      const consAssets = Math.round((baseAssets * 0.7) / cfg.assetsStep) * cfg.assetsStep;
      const consDebts = Math.round((baseExpenses * 0.8) / cfg.incomeStep) * cfg.incomeStep;

      const consCommon = {
        age: 35,
        monthly_income: consIncome,
        monthly_expenses: consExpenses,
        personal_inflation: 10,
        savings_indexation: 7,
        current_assets: consAssets,
        liabilities_value: 0,
        dividend_yield: 7,
        capital_growth: 6,
      };
      setSimpleInputs({
        ...consCommon,
        capital_multiplier: 2,
      });
      setFlexibleInputs({
        ...consCommon,
        cushion_months: 12,
        short_term_debts: consDebts,
        cushion_yield: 11,
        dividend_consumption_pct: 50,
      });
    }
  };

  // Run FIRE simulation (pure TypeScript calculation)
  const calculationResult = useMemo(() => {
    const inputs: FireInputs =
      mode === "flexible"
        ? { mode: "flexible", ...flexibleInputs }
        : { mode: "simple", ...simpleInputs };

    return calculateFIRE(inputs);
  }, [mode, simpleInputs, flexibleInputs]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        mode={mode}
        currency={currency}
        onChangeCurrency={handleCurrencyChange}
        onSelectPreset={handleSelectPreset}
      />
      <Tabs mode={mode} onChangeMode={handleModeChange} />

      <main
        id="panel-calculator"
        role="tabpanel"
        aria-labelledby={`tab-${mode}`}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* Split Screen Grid: Left (Inputs) | Right (Results, Chart, Table) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Inputs Form (5 cols on lg) */}
          <section
            aria-label="Параметры симуляции"
            className="lg:col-span-5 lg:sticky lg:top-24"
          >
            <InputForm
              mode={mode}
              currency={currency}
              simpleInputs={simpleInputs}
              flexibleInputs={flexibleInputs}
              onChangeSimple={setSimpleInputs}
              onChangeFlexible={setFlexibleInputs}
            />
          </section>

          {/* Right Side: Results, Chart, Table (7 cols on lg) */}
          <section
            aria-label="Результаты расчета и симуляция"
            className="lg:col-span-7 space-y-6"
          >
            {/* Top Cards (Главные цифры) */}
            <MetricCards result={calculationResult} currency={currency} />

            {/* Recharts Growth Chart */}
            <CapitalChart result={calculationResult} currency={currency} />

            {/* Simulation Table Data Grid */}
            <SimulationTable result={calculationResult} currency={currency} />
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            Калькулятор раннего выхода на пенсию (FIRE). Простая и гибкая математические модели долгосрочной симуляции капитала.
          </p>
          <p className="mt-1 text-slate-400">
            Расчеты носят информационный характер и не являются индивидуальной инвестиционной рекомендацией.
          </p>
        </div>
      </footer>
    </div>
  );
}
