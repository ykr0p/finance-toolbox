import {
  FireInputs,
  FireCalculationResult,
  SimulationYearRow,
  SimpleFireInputs,
  FlexibleFireInputs,
} from "@/types/fire";

/**
 * Calculates FIRE (Financial Independence, Retire Early) timeline and projection
 * based strictly on the Excel model "На пенсию в 35 лет" (Версия 2.0).
 */
export function calculateFIRE(inputs: FireInputs): FireCalculationResult {
  const isFlexible = inputs.mode === "flexible";
  const flexInputs = inputs as { mode: "flexible" } & FlexibleFireInputs;
  const simpleInputs = inputs as { mode: "simple" } & SimpleFireInputs;

  // Safe percentage rates
  const personalInflationRate = Math.max(0, inputs.personal_inflation) / 100;
  const savingsIndexationRate = Math.max(0, inputs.savings_indexation) / 100;
  const dividendYieldRate = Math.max(0.0001, inputs.dividend_yield) / 100;
  const capitalGrowthRate = inputs.capital_growth / 100;

  // Mode-specific parameters
  const cushionMonths = isFlexible ? Math.max(0, flexInputs.cushion_months) : 0;
  const cushionYieldRate = isFlexible ? Math.max(0, flexInputs.cushion_yield) / 100 : 0;
  const debts = isFlexible ? Math.max(0, flexInputs.short_term_debts) : 0;

  // Consumption share of dividends
  // In flexible: dividend_consumption_pct (e.g. 100%, 70%, 50%)
  // In simple: capital_multiplier (1 = 100% consumption, 2 = 50% consumption / 2x capital)
  const capitalMultiplier = isFlexible ? 1 : Math.max(0.5, simpleInputs.capital_multiplier || 1);
  const dividendConsumptionPct = isFlexible
    ? Math.max(1, Math.min(100, flexInputs.dividend_consumption_pct || 100))
    : 100 / capitalMultiplier;
  const dividendConsumptionRate = dividendConsumptionPct / 100;

  // ==========================================
  // Шаг 1. Предварительные расчеты (Старт/Сегодня)
  // ==========================================
  const initialMonthlyExpenses = Math.max(0, inputs.monthly_expenses);
  const initialMonthlyIncome = Math.max(0, inputs.monthly_income);
  const monthlySavingsToday = initialMonthlyIncome - initialMonthlyExpenses;
  const currentSavingsRate =
    initialMonthlyIncome > 0
      ? Math.max(0, (monthlySavingsToday / initialMonthlyIncome) * 100)
      : 0;

  // Starting cushion
  const startingCushion = isFlexible ? initialMonthlyExpenses * cushionMonths : 0;

  // Initial capital distribution
  // Total liquidated net worth initially available
  const grossAssets = Math.max(0, inputs.current_assets) + Math.max(0, inputs.liabilities_value);
  const netStartingWealth = Math.max(0, grossAssets - debts);

  let initialAssets = 0;
  let initialCushion = 0;

  if (isFlexible) {
    if (netStartingWealth <= startingCushion) {
      initialCushion = netStartingWealth;
      initialAssets = 0;
    } else {
      initialCushion = startingCushion;
      initialAssets = netStartingWealth - startingCushion;
    }
  } else {
    initialAssets = grossAssets;
    initialCushion = 0;
  }

  const initialTotalCapital = initialAssets + initialCushion;

  // Target capital today
  // Formula: (Расходы * 12) / (Дивидендная_доходность * %_потребления) + Подушка
  const initialAnnualExpenses = initialMonthlyExpenses * 12;
  const targetCapitalToday =
    initialAnnualExpenses / (dividendYieldRate * dividendConsumptionRate) + startingCushion;

  // Check if retirement is already reached at start
  const isAlreadyRetired = initialTotalCapital >= targetCapitalToday;

  const rows: SimulationYearRow[] = [];

  // Year 0 row (Сегодня / Старт)
  rows.push({
    year: 0,
    age: inputs.age,
    annual_expenses: initialAnnualExpenses,
    required_cushion: startingCushion,
    target_capital: targetCapitalToday,
    total_capital: initialTotalCapital,
    assets: initialAssets,
    cushion: initialCushion,
    savings_added: 0,
    cushion_income: 0,
    capital_body_growth: 0,
    dividends: initialAssets * dividendYieldRate,
    dividends_reinvested: isAlreadyRetired
      ? initialAssets * dividendYieldRate * (1 - dividendConsumptionRate)
      : initialAssets * dividendYieldRate,
    dividends_for_consumption: isAlreadyRetired
      ? initialAssets * dividendYieldRate * dividendConsumptionRate
      : 0,
    is_retired: isAlreadyRetired,
    passive_income: initialAssets * dividendYieldRate,
  });

  // ==========================================
  // Шаг 2. Цикл симуляции (год за годом, от 1 до 50)
  // ==========================================
  let currentAssets = initialAssets;
  let currentCushion = initialCushion;
  let retirementAge: number | null = isAlreadyRetired ? inputs.age : null;
  let yearsToRetirement: number | null = isAlreadyRetired ? 0 : null;
  let retirementYearIndex: number | null = isAlreadyRetired ? 0 : null;
  let capitalAtRetirement: number | null = isAlreadyRetired ? initialTotalCapital : null;
  let annualExpensesAtRetirement: number | null = isAlreadyRetired ? initialAnnualExpenses : null;

  let hasRetiredInPriorYears = isAlreadyRetired;

  const MAX_YEARS = 50;

  for (let i = 1; i <= MAX_YEARS; i++) {
    const currentAge = inputs.age + i;

    // 1. Annual expenses with personal inflation compounding
    // Расходы за прошлый год * (1 + личная_инфляция)
    const annualExpenses = initialAnnualExpenses * Math.pow(1 + personalInflationRate, i);

    // 2. Required cushion for this year
    const requiredCushion = isFlexible ? (annualExpenses / 12) * cushionMonths : 0;

    // 3. Target capital for this year (adjusted for inflation and consumption pct)
    const targetCapital =
      annualExpenses / (dividendYieldRate * dividendConsumptionRate) + requiredCushion;

    // Starting capital for year i
    const startAssets = currentAssets;
    const startCushion = currentCushion;
    const startTotalCapital = startAssets + startCushion;

    // 4. Yields and income during the year
    const cushionIncome = startCushion * cushionYieldRate;
    const capitalBodyGrowth = startAssets * capitalGrowthRate;
    const dividends = startAssets * dividendYieldRate;

    // Check if retirement was already reached prior to this year
    const isRetiredAtStart = hasRetiredInPriorYears || startTotalCapital >= targetCapital;

    // 5. Savings added
    // If not retired, person adds savings indexed by savings_indexation
    // Once retired, savings contributions cease (savings_added = 0)
    let savingsAdded = 0;
    if (!isRetiredAtStart && monthlySavingsToday > 0) {
      savingsAdded =
        monthlySavingsToday * 12 * Math.pow(1 + savingsIndexationRate, i - 1);
    }

    // 6. Dividends reinvested vs for consumption
    let dividendsReinvested = 0;
    let dividendsForConsumption = 0;

    if (isRetiredAtStart) {
      // In retirement, consumption portion is consumed, remaining is reinvested
      dividendsForConsumption = dividends * dividendConsumptionRate;
      dividendsReinvested = dividends * (1 - dividendConsumptionRate);
    } else {
      // Accumulation phase: 100% of dividends are reinvested
      dividendsReinvested = dividends;
      dividendsForConsumption = 0;
    }

    // 7. Update capital at end of year
    // Total capital generated before rebalancing between cushion and productive assets
    const totalCapitalBeforeRebalance =
      startAssets +
      capitalBodyGrowth +
      dividendsReinvested +
      savingsAdded +
      startCushion +
      cushionIncome;

    // Cushion rebalancing:
    // new_cushion = IF(Общий_капитал < Требуемая_подушка, Общий_капитал, Требуемая_подушка).
    // Остаток идет в активы.
    let newCushion = 0;
    let newAssets = 0;

    if (isFlexible) {
      if (totalCapitalBeforeRebalance <= requiredCushion) {
        newCushion = Math.max(0, totalCapitalBeforeRebalance);
        newAssets = 0;
      } else {
        newCushion = requiredCushion;
        newAssets = totalCapitalBeforeRebalance - requiredCushion;
      }
    } else {
      newCushion = 0;
      newAssets = Math.max(0, totalCapitalBeforeRebalance);
    }

    const endTotalCapital = newAssets + newCushion;

    // 8. Retirement check at end of year i
    const isNowRetired = isRetiredAtStart || endTotalCapital >= targetCapital;

    if (isNowRetired && retirementAge === null) {
      retirementAge = currentAge;
      yearsToRetirement = i;
      retirementYearIndex = i;
      capitalAtRetirement = endTotalCapital;
      annualExpensesAtRetirement = annualExpenses;
      hasRetiredInPriorYears = true;
    }

    const passiveIncome = dividends + cushionIncome;

    rows.push({
      year: i,
      age: currentAge,
      annual_expenses: annualExpenses,
      required_cushion: requiredCushion,
      target_capital: targetCapital,
      total_capital: endTotalCapital,
      assets: newAssets,
      cushion: newCushion,
      savings_added: savingsAdded,
      cushion_income: cushionIncome,
      capital_body_growth: capitalBodyGrowth,
      dividends,
      dividends_reinvested: dividendsReinvested,
      dividends_for_consumption: dividendsForConsumption,
      is_retired: isNowRetired,
      passive_income: passiveIncome,
    });

    // Advance state to next year
    currentAssets = newAssets;
    currentCushion = newCushion;
    if (isNowRetired) {
      hasRetiredInPriorYears = true;
    }
  }

  return {
    mode: inputs.mode,
    target_capital_today: targetCapitalToday,
    retirement_age: retirementAge,
    years_to_retirement: yearsToRetirement,
    is_already_retired: isAlreadyRetired,
    current_savings_rate: currentSavingsRate,
    monthly_savings_today: monthlySavingsToday,
    capital_at_retirement: capitalAtRetirement,
    annual_expenses_at_retirement: annualExpensesAtRetirement,
    initial_total_capital: initialTotalCapital,
    initial_assets: initialAssets,
    initial_cushion: initialCushion,
    rows,
  };
}
