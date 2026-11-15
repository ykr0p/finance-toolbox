import { CurrencyCode } from "./fire";

export type AssetId =
  | "mcftr" // Акции РФ (MCFTR - с дивидендами)
  | "sp500" // Акции США (S&P 500 Total Return)
  | "gold" // Золото (XAU)
  | "real_estate" // Недвижимость (Москва IRN)
  | "real_estate_minsk" // Недвижимость (Минск Realt.by)
  | "deposits" // Банковские вклады (РФ)
  | "deposits_by" // Вклады в BYN (НБРБ)
  | "bonds" // Облигации ОФЗ (RGBITR)
  | "bonds_by" // Гособлигации РБ (Минфин РБ)
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
  country?: "ru" | "by" | "us" | "global";
}

export interface HistoricalYearData {
  year: number;
  mcftr: number; // % за год в RUB
  sp500_usd: number; // % за год в USD
  gold_rub: number; // % за год в RUB
  gold_byn?: number; // % за год в BYN (НБРБ)
  real_estate_rub: number; // % за год в RUB (Москва IRN)
  real_estate_minsk_usd?: number; // % за год в USD (Минск Realt.by)
  deposits_rub: number; // % за год в RUB (ЦБ РФ)
  deposits_byn?: number; // % за год в BYN (НБРБ)
  bonds_rub: number; // % за год в RUB (RGBITR)
  bonds_byn?: number; // % за год в BYN (Минфин РБ)
  btc_usd: number | null; // % за год в USD (null до 2011)
  inflation_rub: number; // % официальной инфляции Росстат
  inflation_byn?: number; // % официальной инфляции Белстат
  usd_rub_change: number; // % изменения курса USD/RUB за год
  usd_byn_change?: number; // % изменения курса USD/BYN за год
  isYtd?: boolean; // Флаг текущего незавершенного года (Year-To-Date)
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
  isYtd?: boolean;
  [key: string]: number | boolean | undefined; // asset values by assetId
}

export interface AnnualReturnPoint {
  year: number;
  inflation_rub: number;
  inflation_byn?: number;
  isYtd?: boolean;
  [key: string]: number | boolean | undefined; // asset returns by assetId
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
  isLiveOnline?: boolean;
  lastOnlineUpdate?: string;
}
