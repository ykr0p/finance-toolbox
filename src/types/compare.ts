import { CurrencyCode } from "./fire";

export type AssetId =
  | "mcftr" // Акции РФ (MCFTR - с дивидендами)
  | "sp500" // Акции США (S&P 500 Total Return)
  | "gold" // Золото (XAU)
  | "real_estate" // Недвижимость (Москва IRN)
  | "deposits" // Банковские депозиты
  | "bonds" // Облигации ОФЗ (RGBITR)
  | "btc" // Биткоин (BTC)
  | "portfolio"; // Сбалансированный портфель (1/N)

export interface AssetDefinition {
  id: AssetId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  category: "stocks" | "bonds" | "commodities" | "real_estate" | "crypto" | "cash" | "portfolio";
  startYear: number;
  iconName: string;
}

export interface HistoricalYearData {
  year: number;
  mcftr: number; // % за год в RUB
  sp500_usd: number; // % за год в USD
  gold_rub: number; // % за год в RUB
  real_estate_rub: number; // % за год в RUB
  deposits_rub: number; // % за год в RUB
  bonds_rub: number; // % за год в RUB
  btc_usd: number | null; // % за год в USD (null до 2011)
  inflation_rub: number; // % официальной инфляции Росстат
  usd_rub_change: number; // % изменения курса USD/RUB за год
}

export interface CompareInputs {
  initialAmount: number;
  monthlyContribution: number;
  startYear: number;
  endYear: number;
  selectedAssets: AssetId[];
  currency: CurrencyCode;
  adjustForInflation: boolean;
  scaleType: "linear" | "log";
  includeBalancedPortfolio: boolean;
}

export interface AssetMetrics {
  assetId: AssetId;
  name: string;
  shortName: string;
  color: string;
  finalValue: number;
  totalInvested: number;
  totalReturnPct: number;
  multiple: number;
  cagr: number;
  realCagr: number;
  maxDrawdown: number;
  bestYear: { year: number; returnPct: number };
  worstYear: { year: number; returnPct: number };
  rank: number;
}

export interface ChartPoint {
  year: number;
  totalInvested: number;
  inflationBaseline: number;
  [key: string]: number; // asset values by assetId
}

export interface AnnualReturnPoint {
  year: number;
  inflation_rub: number;
  [key: string]: number; // asset returns by assetId
}

export interface CompareResult {
  startYear: number;
  endYear: number;
  yearsCount: number;
  totalInvested: number;
  inflationCompoundPct: number;
  inflationBaselineFinal: number;
  metrics: AssetMetrics[];
  chartPoints: ChartPoint[];
  annualReturns: AnnualReturnPoint[];
  winner: AssetMetrics | null;
}
