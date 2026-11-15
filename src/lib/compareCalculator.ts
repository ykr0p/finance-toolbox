import {
  AssetId,
  AssetMetrics,
  ChartPoint,
  AnnualReturnPoint,
  CompareInputs,
  CompareResult,
  HistoricalYearData,
} from "@/types/compare";
import { ASSET_DEFINITIONS, HISTORICAL_DATA } from "@/data/historicalReturns";

/**
 * Преобразует доходность актива за конкретный год с учетом выбранной валюты (RUB, USD, EUR, BYN)
 */
export function getAssetAnnualReturn(
  assetId: AssetId,
  data: HistoricalYearData,
  currency: string
): number | null {
  const usdRubFactor = 1 + data.usd_rub_change / 100;

  if (currency === "RUB" || currency === "BYN") {
    // В рублях (RUB / BYN)
    switch (assetId) {
      case "mcftr":
        return data.mcftr;
      case "sp500":
        // S&P 500 в рублях: долларовая доходность + эффект изменения курса доллара
        return ((1 + data.sp500_usd / 100) * usdRubFactor - 1) * 100;
      case "gold":
        return data.gold_rub;
      case "real_estate":
        return data.real_estate_rub;
      case "deposits":
        return data.deposits_rub;
      case "bonds":
        return data.bonds_rub;
      case "btc":
        if (data.btc_usd === null) return null;
        return ((1 + data.btc_usd / 100) * usdRubFactor - 1) * 100;
      default:
        return 0;
    }
  } else {
    // В долларах / евро (USD / EUR)
    switch (assetId) {
      case "mcftr":
        // Российские акции в USD (эквивалент индекса РТС полной доходности)
        return ((1 + data.mcftr / 100) / usdRubFactor - 1) * 100;
      case "sp500":
        return data.sp500_usd;
      case "gold":
        // Золото в USD
        return ((1 + data.gold_rub / 100) / usdRubFactor - 1) * 100;
      case "real_estate":
        // Недвижимость в USD
        return ((1 + data.real_estate_rub / 100) / usdRubFactor - 1) * 100;
      case "deposits":
        // Рублевые депозиты в USD
        return ((1 + data.deposits_rub / 100) / usdRubFactor - 1) * 100;
      case "bonds":
        // ОФЗ в USD
        return ((1 + data.bonds_rub / 100) / usdRubFactor - 1) * 100;
      case "btc":
        return data.btc_usd;
      default:
        return 0;
    }
  }
}

/**
 * Получить уровень инфляции за год в зависимости от валюты
 */
export function getInflationReturn(data: HistoricalYearData, currency: string): number {
  if (currency === "RUB" || currency === "BYN") {
    return data.inflation_rub;
  }
  // Для USD / EUR используем историческую долларовую инфляцию США (US CPI)
  // В среднем 2.5 - 3.5%, в 2021-2022 всплеск 7-8%
  const usCpiByYear: Record<number, number> = {
    2003: 2.3,
    2004: 2.7,
    2005: 3.4,
    2006: 3.2,
    2007: 2.8,
    2008: 3.8,
    2009: -0.4,
    2010: 1.6,
    2011: 3.2,
    2012: 2.1,
    2013: 1.5,
    2014: 1.6,
    2015: 0.1,
    2016: 1.3,
    2017: 2.1,
    2018: 2.4,
    2019: 1.8,
    2020: 1.2,
    2021: 4.7,
    2022: 8.0,
    2023: 4.1,
    2024: 2.9,
  };
  return usCpiByYear[data.year] ?? 2.5;
}

/**
 * Основная функция расчета сравнения доходности активов
 */
export function calculateAssetComparison(inputs: CompareInputs): CompareResult {
  const {
    initialAmount,
    monthlyContribution,
    startYear,
    endYear,
    selectedAssets,
    currency,
    adjustForInflation,
    includeBalancedPortfolio,
  } = inputs;

  const validStartYear = Math.max(2003, Math.min(startYear, endYear));
  const validEndYear = Math.max(validStartYear, Math.min(2024, endYear));
  const yearsCount = validEndYear - validStartYear + 1;

  // Фильтруем исторические данные по выбранному диапазону лет
  const filteredData = HISTORICAL_DATA.filter(
    (d) => d.year >= validStartYear && d.year <= validEndYear
  );

  const activeAssets = [...selectedAssets];
  if (includeBalancedPortfolio && !activeAssets.includes("portfolio")) {
    activeAssets.push("portfolio");
  }

  // Расчет накопленной инфляции за период
  let cumulativeInflationMultiplier = 1;
  const annualInflationRates: number[] = [];

  for (const yearData of filteredData) {
    const inf = getInflationReturn(yearData, currency);
    annualInflationRates.push(inf);
    cumulativeInflationMultiplier *= 1 + inf / 100;
  }

  const inflationCompoundPct = (cumulativeInflationMultiplier - 1) * 100;
  const inflationCagr =
    yearsCount > 0 ? (Math.pow(cumulativeInflationMultiplier, 1 / yearsCount) - 1) * 100 : 0;

  // Инициализация структур для симуляции
  const chartPoints: ChartPoint[] = [];
  const annualReturns: AnnualReturnPoint[] = [];

  // Стартовая точка: год перед началом инвестирования (startYear - 1)
  const baseStartPoint: ChartPoint = {
    year: validStartYear - 1,
    totalInvested: initialAmount,
    inflationBaseline: initialAmount,
  };

  for (const assetId of activeAssets) {
    baseStartPoint[assetId] = initialAmount;
  }
  chartPoints.push(baseStartPoint);

  // Состояние капитала каждого актива
  const capitalTracker: Record<string, number> = {};
  const peakTracker: Record<string, number> = {};
  const maxDrawdownTracker: Record<string, number> = {};
  const bestYearTracker: Record<string, { year: number; returnPct: number }> = {};
  const worstYearTracker: Record<string, { year: number; returnPct: number }> = {};

  for (const assetId of activeAssets) {
    capitalTracker[assetId] = initialAmount;
    peakTracker[assetId] = initialAmount;
    maxDrawdownTracker[assetId] = 0;
    bestYearTracker[assetId] = { year: validStartYear, returnPct: -Infinity };
    worstYearTracker[assetId] = { year: validStartYear, returnPct: Infinity };
  }

  let runningTotalInvested = initialAmount;
  let runningInflationBaseline = initialAmount;
  const annualContribution = monthlyContribution * 12;

  // Симуляция год за годом
  for (let i = 0; i < filteredData.length; i++) {
    const yearData = filteredData[i];
    const year = yearData.year;
    const yearInflation = annualInflationRates[i];

    // Довнесения в текущем году
    runningTotalInvested += annualContribution;
    runningInflationBaseline =
      (runningInflationBaseline + annualContribution) * (1 + yearInflation / 100);

    const point: ChartPoint = {
      year,
      totalInvested: Math.round(runningTotalInvested),
      inflationBaseline: Math.round(runningInflationBaseline),
    };

    const annualReturnPoint: AnnualReturnPoint = {
      year,
      inflation_rub: yearInflation,
    };

    // 1. Сначала рассчитываем доходности одиночных активов за год
    const singleAssetReturns: Record<string, number | null> = {};
    for (const assetId of activeAssets) {
      if (assetId === "portfolio") continue;

      let r = getAssetAnnualReturn(assetId, yearData, currency);
      if (r !== null && adjustForInflation) {
        // Формула Фишера для реальной доходности: (1 + r_nom) / (1 + inf) - 1
        r = ((1 + r / 100) / (1 + yearInflation / 100) - 1) * 100;
      }
      singleAssetReturns[assetId] = r;
    }

    // 2. Если включен сбалансированный портфель, его доходность = среднее доступных активов
    if (activeAssets.includes("portfolio")) {
      const validReturns = Object.values(singleAssetReturns).filter(
        (v): v is number => v !== null && !isNaN(v)
      );
      const portfolioReturn =
        validReturns.length > 0
          ? validReturns.reduce((sum, val) => sum + val, 0) / validReturns.length
          : 0;
      singleAssetReturns["portfolio"] = portfolioReturn;
    }

    // 3. Обновляем капитал для каждого актива
    for (const assetId of activeAssets) {
      let r = singleAssetReturns[assetId];

      // Если актив еще не запущен (например BTC до 2011), он растет по ставке депозита
      if (r === null) {
        r = singleAssetReturns["deposits"] ?? 0;
      }

      annualReturnPoint[assetId] = Math.round(r * 10) / 10;

      // Применяем доходность к прошлому капиталу + усредненное довнесение в течение года
      const oldCap = capitalTracker[assetId];
      const rDecimal = r / 100;
      const newCap = oldCap * (1 + rDecimal) + annualContribution * (1 + rDecimal / 2);

      capitalTracker[assetId] = Math.max(0, newCap);
      point[assetId] = Math.round(capitalTracker[assetId]);

      // Отслеживание пика и максимальной просадки
      if (newCap > peakTracker[assetId]) {
        peakTracker[assetId] = newCap;
      } else if (peakTracker[assetId] > 0) {
        const dd = ((newCap - peakTracker[assetId]) / peakTracker[assetId]) * 100;
        if (dd < maxDrawdownTracker[assetId]) {
          maxDrawdownTracker[assetId] = dd;
        }
      }

      // Отслеживание лучшего и худшего года
      if (r > bestYearTracker[assetId].returnPct) {
        bestYearTracker[assetId] = { year, returnPct: Math.round(r * 10) / 10 };
      }
      if (r < worstYearTracker[assetId].returnPct) {
        worstYearTracker[assetId] = { year, returnPct: Math.round(r * 10) / 10 };
      }
    }

    chartPoints.push(point);
    annualReturns.push(annualReturnPoint);
  }

  // Расчет итоговых метрик по каждому активу
  const metrics: AssetMetrics[] = [];

  for (const assetId of activeAssets) {
    const def = ASSET_DEFINITIONS[assetId];
    const finalValue = Math.round(capitalTracker[assetId]);
    const totalInvested = runningTotalInvested;
    const totalReturnPct =
      totalInvested > 0 ? ((finalValue - totalInvested) / totalInvested) * 100 : 0;
    const multiple = totalInvested > 0 ? finalValue / totalInvested : 1;

    // CAGR (среднегодовая геометрическая доходность)
    let cagr = 0;
    if (yearsCount > 0 && totalInvested > 0 && finalValue > 0) {
      if (monthlyContribution === 0) {
        cagr = (Math.pow(finalValue / initialAmount, 1 / yearsCount) - 1) * 100;
      } else {
        // Аппроксимация среднегодовой доходности с учетом равномерного потока довнесений
        const avgCapitalInvested = (initialAmount + totalInvested) / 2;
        const totalProfit = finalValue - totalInvested;
        const avgAnnualReturn = (totalProfit / avgCapitalInvested / yearsCount) * 100;
        cagr = avgAnnualReturn;
      }
    }

    // Реальный CAGR с поправкой на накопленную инфляцию
    const realCagr =
      inflationCompoundPct !== -100
        ? ((1 + cagr / 100) / (1 + inflationCagr / 100) - 1) * 100
        : cagr;

    metrics.push({
      assetId,
      name: def?.name ?? assetId,
      shortName: def?.shortName ?? assetId,
      color: def?.color ?? "#94a3b8",
      finalValue,
      totalInvested,
      totalReturnPct: Math.round(totalReturnPct * 10) / 10,
      multiple: Math.round(multiple * 100) / 100,
      cagr: Math.round(cagr * 10) / 10,
      realCagr: Math.round(realCagr * 10) / 10,
      maxDrawdown: Math.round(maxDrawdownTracker[assetId] * 10) / 10,
      bestYear: bestYearTracker[assetId],
      worstYear: worstYearTracker[assetId],
      rank: 0, // заполнится после сортировки
    });
  }

  // Сортировка по итоговому капиталу (места в рейтинге)
  metrics.sort((a, b) => b.finalValue - a.finalValue);
  metrics.forEach((m, idx) => {
    m.rank = idx + 1;
  });

  const winner = metrics.length > 0 ? metrics[0] : null;

  return {
    startYear: validStartYear,
    endYear: validEndYear,
    yearsCount,
    totalInvested: runningTotalInvested,
    inflationCompoundPct: Math.round(inflationCompoundPct * 10) / 10,
    inflationBaselineFinal: Math.round(runningInflationBaseline),
    metrics,
    chartPoints,
    annualReturns,
    winner,
  };
}
