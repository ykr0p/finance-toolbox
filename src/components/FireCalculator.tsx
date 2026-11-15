"use client";

import React, { useState, useMemo } from "react";
import {
  CalculatorMode,
  SimpleFireInputs,
  FlexibleFireInputs,
  FireInputs,
} from "@/types/fire";
import { calculateFIRE } from "@/lib/calculator";
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
  const [simpleInputs, setSimpleInputs] = useState<SimpleFireInputs>(DEFAULT_SIMPLE_INPUTS);
  const [flexibleInputs, setFlexibleInputs] = useState<FlexibleFireInputs>(DEFAULT_FLEXIBLE_INPUTS);

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
    if (preset === "standard") {
      setSimpleInputs(DEFAULT_SIMPLE_INPUTS);
      setFlexibleInputs(DEFAULT_FLEXIBLE_INPUTS);
    } else if (preset === "aggressive") {
      const aggCommon = {
        age: 26,
        monthly_income: 250000,
        monthly_expenses: 70000,
        personal_inflation: 8,
        savings_indexation: 12,
        current_assets: 2500000,
        liabilities_value: 500000,
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
      const consCommon = {
        age: 35,
        monthly_income: 120000,
        monthly_expenses: 55000,
        personal_inflation: 10,
        savings_indexation: 7,
        current_assets: 1000000,
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
        short_term_debts: 50000,
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
      <Header mode={mode} onSelectPreset={handleSelectPreset} />
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
            <MetricCards result={calculationResult} />

            {/* Recharts Growth Chart */}
            <CapitalChart result={calculationResult} />

            {/* Simulation Table Data Grid */}
            <SimulationTable result={calculationResult} />
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
