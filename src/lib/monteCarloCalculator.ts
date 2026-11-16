import {
  MonteCarloInputs,
  MonteCarloResult,
  PercentilePoint,
  HistogramBin,
  PortfolioPreset,
  PortfolioPresetConfig,
} from "@/types/monteCarlo";
import { HISTORICAL_DATA } from "@/data/historicalReturns";

export const PORTFOLIO_PRESETS_CONFIG: Record<PortfolioPreset, PortfolioPresetConfig> = {
  mcftr: {
    id: "mcftr",
    name: "Акции РФ (MCFTR)",
    description: "Индекс Мосбиржи полной доходности: высокая доходность при высокой волатильности",
    expectedReturn: 15.5,
    volatility: 22.0,
    badge: "Высокий риск",
  },
  sp500: {
    id: "sp500",
    name: "Акции США (S&P 500)",
    description: "Широкий рынок США: глобальная диверсификация и устойчивый долгосрочный тренд",
    expectedReturn: 11.0,
    volatility: 16.0,
    badge: "Умеренный риск",
  },
  balanced: {
    id: "balanced",
    name: "Сбалансированный (60/40)",
    description: "Классический портфель: 60% акции, 40% надежные облигации для сглаживания просадок",
    expectedReturn: 12.0,
    volatility: 12.5,
    badge: "Сбалансированный",
  },
  all_weather: {
    id: "all_weather",
    name: "Всепогодный портфель",
    description: "Акции (35%), ОФЗ/Облигации (45%), Золото (20%): защита от инфляции и кризисов",
    expectedReturn: 10.5,
    volatility: 9.5,
    badge: "Низкий риск",
  },
  conservative: {
    id: "conservative",
    name: "Консервативный (Облигации)",
    description: "Государственные облигации (ОФЗ / Минфин РБ) и депозиты: максимальная стабильность",
    expectedReturn: 8.5,
    volatility: 6.0,
    badge: "Минимальный риск",
  },
  bootstrap: {
    id: "bootstrap",
    name: "Исторический бутстрап (2003–2026)",
    description: "Случайная выборка из реальных 24 лет истории рынков с сохранением реальных кризисных шоков",
    expectedReturn: 13.8,
    volatility: 19.5,
    badge: "Реальная история",
  },
  custom: {
    id: "custom",
    name: "Пользовательский",
    description: "Ручная настройка параметров ожидаемой доходности и риска",
    expectedReturn: 12.0,
    volatility: 15.0,
    badge: "Свой выбор",
  },
};

/**
 * Fast standard normal random variable generator via Box-Muller transform
 */
function standardNormal(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Pre-extracted real historical portfolio annual returns for bootstrap sampling
 */
const HISTORICAL_BALANCED_RETURNS: number[] = HISTORICAL_DATA.map((d) => {
  // Equal-weighted blend of stocks, bonds, gold, deposits for historical bootstrap
  const mcftr = d.mcftr;
  const bonds = d.bonds_rub;
  const gold = d.gold_rub;
  const dep = d.deposits_rub;
  return 0.4 * mcftr + 0.3 * bonds + 0.15 * gold + 0.15 * dep;
});

/**
 * Core Monte Carlo Simulation Runner
 */
export function calculateMonteCarlo(inputs: MonteCarloInputs): MonteCarloResult {
  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

  const {
    initialCapital,
    mode,
    years,
    monthlyCashflow,
    inflationRate,
    adjustCashflowForInflation,
    simulationCount,
    portfolioPreset,
  } = inputs;

  const conf = PORTFOLIO_PRESETS_CONFIG[portfolioPreset] || PORTFOLIO_PRESETS_CONFIG.balanced;
  const meanReturn = (inputs.portfolioPreset === "custom" ? inputs.expectedReturn : conf.expectedReturn) / 100;
  const vol = (inputs.portfolioPreset === "custom" ? inputs.volatility : conf.volatility) / 100;
  const inf = Math.max(0, inflationRate) / 100;

  // Geometric Brownian motion drift: mu - 0.5 * sigma^2
  const muDrift = Math.log(1 + Math.max(-0.9, meanReturn)) - 0.5 * vol * vol;

  const N = simulationCount;
  const T = years;

  // trajectories[pathIdx][year]
  const trajectories = new Float64Array(N * (T + 1));

  // Initialize year 0
  for (let i = 0; i < N; i++) {
    trajectories[i * (T + 1) + 0] = initialCapital;
  }

  let depletedCount = 0;
  const depletionYears: number[] = [];

  const accumYears = inputs.accumulationYears ?? Math.min(10, Math.floor(T / 2));

  // Run simulation forward across years
  for (let i = 0; i < N; i++) {
    let currentCapital = initialCapital;
    let isDepleted = false;

    for (let t = 1; t <= T; t++) {
      if (currentCapital <= 0) {
        if (!isDepleted) {
          isDepleted = true;
          depletedCount++;
          depletionYears.push(t);
        }
        trajectories[i * (T + 1) + t] = 0;
        continue;
      }

      // Generate annual return
      let annualReturn: number;
      if (portfolioPreset === "bootstrap" && HISTORICAL_BALANCED_RETURNS.length > 0) {
        const randIdx = Math.floor(Math.random() * HISTORICAL_BALANCED_RETURNS.length);
        annualReturn = HISTORICAL_BALANCED_RETURNS[randIdx] / 100;
      } else {
        const z = standardNormal();
        annualReturn = Math.exp(muDrift + vol * z) - 1;
      }

      // Determine cashflow for year t
      let annualCashflow = 0;
      const inflationMultiplier = adjustCashflowForInflation ? Math.pow(1 + inf, t) : 1;

      if (mode === "accumulation") {
        annualCashflow = monthlyCashflow * 12 * inflationMultiplier;
        // Mid-year cashflow compound
        currentCapital = (currentCapital + annualCashflow * 0.5) * (1 + annualReturn) + annualCashflow * 0.5;
      } else if (mode === "retirement") {
        annualCashflow = monthlyCashflow * 12 * inflationMultiplier;
        // Start-of-year withdrawal
        currentCapital = Math.max(0, currentCapital - annualCashflow);
        currentCapital = currentCapital * (1 + annualReturn);
      } else if (mode === "full_cycle") {
        if (t <= accumYears) {
          annualCashflow = monthlyCashflow * 12 * inflationMultiplier;
          currentCapital = (currentCapital + annualCashflow * 0.5) * (1 + annualReturn) + annualCashflow * 0.5;
        } else {
          // Withdrawal phase
          const withdrawal = monthlyCashflow * 12 * inflationMultiplier;
          currentCapital = Math.max(0, currentCapital - withdrawal);
          currentCapital = currentCapital * (1 + annualReturn);
        }
      }

      if (currentCapital < 1) {
        currentCapital = 0;
      }

      trajectories[i * (T + 1) + t] = currentCapital;
    }

    if (currentCapital <= 0 && !isDepleted) {
      depletedCount++;
      depletionYears.push(T);
    }
  }

  // Pre-select 6 sample path indices to display in UI
  const sampleIndices = [
    0,
    Math.floor(N * 0.15),
    Math.floor(N * 0.35),
    Math.floor(N * 0.65),
    Math.floor(N * 0.85),
    N - 1,
  ];

  // Calculate Percentiles for each year
  const percentileTrajectory: PercentilePoint[] = [];
  const yearCapitals = new Float64Array(N);

  for (let t = 0; t <= T; t++) {
    for (let i = 0; i < N; i++) {
      yearCapitals[i] = trajectories[i * (T + 1) + t];
    }
    yearCapitals.sort();

    const p5 = Math.round(yearCapitals[Math.floor(N * 0.05)]);
    const p10 = Math.round(yearCapitals[Math.floor(N * 0.10)]);
    const p25 = Math.round(yearCapitals[Math.floor(N * 0.25)]);
    const p50 = Math.round(yearCapitals[Math.floor(N * 0.50)]);
    const p75 = Math.round(yearCapitals[Math.floor(N * 0.75)]);
    const p95 = Math.round(yearCapitals[Math.floor(N * 0.95)]);

    const samples = sampleIndices.map((idx) => Math.round(trajectories[idx * (T + 1) + t]));

    percentileTrajectory.push({
      year: t,
      p95,
      p75,
      p50,
      p25,
      p10,
      p5,
      samplePaths: samples,
    });
  }

  // Final Year stats
  for (let i = 0; i < N; i++) {
    yearCapitals[i] = trajectories[i * (T + 1) + T];
  }
  yearCapitals.sort();

  const successRate = Math.round(((N - depletedCount) / N) * 1000) / 10;
  const medianFinalCapital = Math.round(yearCapitals[Math.floor(N * 0.5)]);
  const worst10Final = Math.round(yearCapitals[Math.floor(N * 0.1)]);
  const best10Final = Math.round(yearCapitals[Math.floor(N * 0.9)]);

  // Median depletion year if failures occurred
  let medianDepletionYear: number | null = null;
  if (depletionYears.length > 0) {
    depletionYears.sort((a, b) => a - b);
    medianDepletionYear = depletionYears[Math.floor(depletionYears.length / 2)];
  }

  // Calculate Safe Withdrawal Rate (95% target) for retirement mode
  let safeWithdrawalRate95 = 4.0;
  if (initialCapital > 0) {
    if (mode === "retirement") {
      const currentSwr = (monthlyCashflow * 12 / initialCapital) * 100;
      if (successRate >= 95) {
        safeWithdrawalRate95 = Math.round(currentSwr * 10) / 10;
      } else {
        // Approximate safe withdrawal rate
        safeWithdrawalRate95 = Math.max(2.5, Math.round((currentSwr * (successRate / 95)) * 10) / 10);
      }
    } else {
      safeWithdrawalRate95 = 4.0;
    }
  }

  // Construct histogram of final outcomes
  const histogram = buildHistogram(yearCapitals, N);

  // Compute total cashflow
  let totalCashflow = 0;
  for (let t = 1; t <= T; t++) {
    const infMult = adjustCashflowForInflation ? Math.pow(1 + inf, t) : 1;
    if (mode === "accumulation") {
      totalCashflow += monthlyCashflow * 12 * infMult;
    } else if (mode === "retirement") {
      totalCashflow += monthlyCashflow * 12 * infMult;
    } else {
      if (t <= accumYears) {
        totalCashflow += monthlyCashflow * 12 * infMult;
      }
    }
  }

  const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const computationTimeMs = Math.round(endTime - startTime);

  return {
    successRate,
    medianFinalCapital,
    worst10PercentileFinalCapital: worst10Final,
    best10PercentileFinalCapital: best10Final,
    initialCapital,
    totalWithdrawnOrContributed: Math.round(totalCashflow),
    safeWithdrawalRate95,
    percentileTrajectory,
    histogram,
    totalDepletedCount: depletedCount,
    medianDepletionYear,
    simulationCount: N,
    years: T,
    computationTimeMs,
  };
}

/**
 * Builds a clean 10-bin histogram of final capital distributions
 */
function buildHistogram(sortedCapitals: Float64Array, N: number): HistogramBin[] {
  const bins: HistogramBin[] = [];

  // Count zeros / bankruptcies
  let zeroCount = 0;
  while (zeroCount < N && sortedCapitals[zeroCount] <= 0) {
    zeroCount++;
  }

  if (zeroCount > 0) {
    bins.push({
      label: "0 (Истощен)",
      count: zeroCount,
      percentage: Math.round((zeroCount / N) * 1000) / 10,
      rangeMin: 0,
      rangeMax: 0,
      isDepletedBin: true,
    });
  }

  const nonZeroCount = N - zeroCount;
  if (nonZeroCount === 0) {
    return bins;
  }

  // Use 95th percentile as max to prevent single outlier from compressing the histogram
  const minVal = sortedCapitals[zeroCount];
  const maxVal = sortedCapitals[Math.floor(N * 0.95)] || sortedCapitals[N - 1];

  const binCount = 8;
  const step = Math.max(1, (maxVal - minVal) / binCount);

  for (let b = 0; b < binCount; b++) {
    const bMin = minVal + b * step;
    const bMax = b === binCount - 1 ? Infinity : minVal + (b + 1) * step;

    let count = 0;
    for (let i = zeroCount; i < N; i++) {
      const val = sortedCapitals[i];
      if (val >= bMin && (b === binCount - 1 ? true : val < bMax)) {
        count++;
      }
    }

    const formatShort = (v: number) => {
      if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
      if (v >= 1e3) return `${Math.round(v / 1e3)}k`;
      return String(Math.round(v));
    };

    const label = b === binCount - 1 ? `>${formatShort(bMin)}` : `${formatShort(bMin)}–${formatShort(bMax)}`;

    bins.push({
      label,
      count,
      percentage: Math.round((count / N) * 1000) / 10,
      rangeMin: bMin,
      rangeMax: bMax === Infinity ? maxVal * 1.5 : bMax,
    });
  }

  return bins;
}
