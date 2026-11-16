export type SimulationMode = "retirement" | "accumulation" | "full_cycle";

export type PortfolioPreset =
  | "mcftr" // Акции РФ (MCFTR)
  | "sp500" // Акции США (S&P 500)
  | "balanced" // Сбалансированный портфель 60/40
  | "all_weather" // Всепогодный портфель (Акции + Облигации + Золото)
  | "conservative" // Консервативный (ОФЗ/Облигации РБ)
  | "bootstrap" // Исторический бутстрап (реальные данные 2003–2026)
  | "custom"; // Пользовательская доходность и волатильность

export interface PortfolioPresetConfig {
  id: PortfolioPreset;
  name: string;
  description: string;
  expectedReturn: number; // % годовых
  volatility: number; // % стандартное отклонение
  badge: string;
}

export interface MonteCarloInputs {
  initialCapital: number;
  mode: SimulationMode;
  years: number; // Общий горизонт (от 5 до 40 лет)
  accumulationYears?: number; // Для full_cycle: сколько лет копим
  monthlyCashflow: number; // Взнос при накоплении или расход при пенсии
  inflationRate: number; // Инфляция % в год
  adjustCashflowForInflation: boolean; // Индексировать платежи/изъятия
  expectedReturn: number; // Ожидаемая доходность (%)
  volatility: number; // Волатильность / риск (%)
  portfolioPreset: PortfolioPreset;
  simulationCount: 1000 | 2500 | 5000 | 10000;
  scaleType: "linear" | "log";
  showSamplePaths: boolean; // Отображать случайные нити траекторий
  seed?: number; // Детерминированный сид для воспроизводимости и устранения гидратации Next.js
}

export interface PercentilePoint {
  year: number;
  p95: number; // 95-й процентиль (Оптимистичный сценарий)
  p75: number; // 75-й процентиль
  p50: number; // 50-й процентиль (Медиана)
  p25: number; // 25-й процентиль
  p10: number; // 10-й процентиль (Пессимистичный сценарий)
  p5: number; // 5-й процентиль (Глубокий стресс)
  samplePaths: number[]; // 5-10 выбранных случайных траекторий
}

export interface HistogramBin {
  label: string;
  count: number;
  percentage: number;
  rangeMin: number;
  rangeMax: number;
  isDepletedBin?: boolean;
}

export interface MonteCarloResult {
  successRate: number; // % успешных исходов (капитал > 0 на финише)
  medianFinalCapital: number; // Медиана итогового капитала
  worst10PercentileFinalCapital: number; // Худший 10-й процентиль
  best10PercentileFinalCapital: number; // Лучший 90-й процентиль
  initialCapital: number;
  totalWithdrawnOrContributed: number;
  safeWithdrawalRate95: number; // Безопасная ставка изъятия с шансом успеха 95%
  percentileTrajectory: PercentilePoint[];
  histogram: HistogramBin[];
  totalDepletedCount: number;
  medianDepletionYear: number | null;
  simulationCount: number;
  years: number;
  computationTimeMs: number;
}
