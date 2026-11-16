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
 * Преобразует доходность актива за конкретный год с учетом выбранной валюты (RUB, BYN, USD, EUR)
 */
export function getAssetAnnualReturn(
  assetId: AssetId,
  data: HistoricalYearData,
  currency: string
): number | null {
  const usdRubFactor = 1 + data.usd_rub_change / 100;
  const usdBynFactor = 1 + (data.usd_byn_change ?? 0) / 100;

  // Базовые долларовые доходности для перекрестного пересчета
  const goldUsdReturn = (1 + data.gold_rub / 100) / usdRubFactor - 1;
  const silverUsdReturn = (1 + data.silver_rub / 100) / usdRubFactor - 1;
  const mcftrUsdReturn = (1 + data.mcftr / 100) / usdRubFactor - 1;
  const reMosUsdReturn = (1 + data.real_estate_rub / 100) / usdRubFactor - 1;
  const reMinskUsdReturn = (data.real_estate_minsk_usd ?? 0) / 100;

  // Вспомогательная функция расчета долларовой доходности зарубежных ETF
  const getUsdEtfReturn = (id: AssetId): number => {
    switch (id) {
      case "sp500":
        return data.sp500_usd;
      case "vwce":
        return data.vwce_usd ?? data.sp500_usd * 0.95;
      case "schd":
        return data.schd_usd ?? data.sp500_usd;
      case "vym":
        return data.vym_usd ?? data.sp500_usd * 0.9;
      case "agg":
        return data.agg_usd ?? 3.5;
      case "vnq":
        return data.vnq_usd ?? 8.0;
      default:
        return 0;
    }
  };

  if (currency === "BYN") {
    // Расчет в белорусских рублях (BYN)
    switch (assetId) {
      case "mcftr":
        // Акции РФ в BYN: долларовый доход + динамика USD/BYN
        return ((1 + mcftrUsdReturn) * usdBynFactor - 1) * 100;
      case "sp500":
      case "vwce":
      case "schd":
      case "vym":
      case "agg":
      case "vnq":
        return ((1 + getUsdEtfReturn(assetId) / 100) * usdBynFactor - 1) * 100;
      case "gold":
        // Золото в BYN (по официальным учетным ценам слитков НБРБ)
        return ((1 + goldUsdReturn) * usdBynFactor - 1) * 100;
      case "silver":
        // Серебро в BYN (учетные цены НБРБ или пересчет через кросс-курс)
        if (data.silver_byn !== undefined) return data.silver_byn;
        return ((1 + silverUsdReturn) * usdBynFactor - 1) * 100;
      case "real_estate":
        // Недвижимость Москвы в BYN
        return ((1 + reMosUsdReturn) * usdBynFactor - 1) * 100;
      case "real_estate_minsk":
        // Недвижимость Минска в BYN: рост цен на жилье ($/м²) + валютная переоценка
        return ((1 + reMinskUsdReturn) * usdBynFactor - 1) * 100;
      case "deposits":
        // Рублевые депозиты РФ в BYN
        const depRubUsd = (1 + data.deposits_rub / 100) / usdRubFactor - 1;
        return ((1 + depRubUsd) * usdBynFactor - 1) * 100;
      case "deposits_by":
        return data.deposits_byn ?? 12.0;
      case "bonds":
        const bondsUsd = (1 + data.bonds_rub / 100) / usdRubFactor - 1;
        return ((1 + bondsUsd) * usdBynFactor - 1) * 100;
      case "bonds_by":
        return data.bonds_byn ?? 11.0;
      case "btc":
        if (data.btc_usd === null) return null;
        return ((1 + data.btc_usd / 100) * usdBynFactor - 1) * 100;
      default:
        return 0;
    }
  } else if (currency === "RUB") {
    // Расчет в российских рублях (RUB)
    switch (assetId) {
      case "mcftr":
        return data.mcftr;
      case "sp500":
      case "vwce":
      case "schd":
      case "vym":
      case "agg":
      case "vnq":
        return ((1 + getUsdEtfReturn(assetId) / 100) * usdRubFactor - 1) * 100;
      case "gold":
        return data.gold_rub;
      case "silver":
        return data.silver_rub;
      case "real_estate":
        return data.real_estate_rub;
      case "real_estate_minsk":
        // Недвижимость Минска в RUB
        return ((1 + reMinskUsdReturn) * usdRubFactor - 1) * 100;
      case "deposits":
        return data.deposits_rub;
      case "deposits_by":
        // Вклады BYN в RUB
        const depBynUsd = (1 + (data.deposits_byn ?? 12) / 100) / usdBynFactor - 1;
        return ((1 + depBynUsd) * usdRubFactor - 1) * 100;
      case "bonds":
        return data.bonds_rub;
      case "bonds_by":
        const bondsBynUsd = (1 + (data.bonds_byn ?? 11) / 100) / usdBynFactor - 1;
        return ((1 + bondsBynUsd) * usdRubFactor - 1) * 100;
      case "btc":
        if (data.btc_usd === null) return null;
        return ((1 + data.btc_usd / 100) * usdRubFactor - 1) * 100;
      default:
        return 0;
    }
  } else {
    // Расчет в долларах / евро (USD / EUR)
    switch (assetId) {
      case "mcftr":
        return mcftrUsdReturn * 100;
      case "sp500":
      case "vwce":
      case "schd":
      case "vym":
      case "agg":
      case "vnq":
        return getUsdEtfReturn(assetId);
      case "gold":
        return goldUsdReturn * 100;
      case "silver":
        return silverUsdReturn * 100;
      case "real_estate":
        return reMosUsdReturn * 100;
      case "real_estate_minsk":
        return data.real_estate_minsk_usd ?? 0;
      case "deposits":
        return ((1 + data.deposits_rub / 100) / usdRubFactor - 1) * 100;
      case "deposits_by":
        return ((1 + (data.deposits_byn ?? 12) / 100) / usdBynFactor - 1) * 100;
      case "bonds":
        return ((1 + data.bonds_rub / 100) / usdRubFactor - 1) * 100;
      case "bonds_by":
        return ((1 + (data.bonds_byn ?? 11) / 100) / usdBynFactor - 1) * 100;
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
  if (currency === "BYN") {
    return data.inflation_byn ?? data.inflation_rub;
  }
  if (currency === "RUB") {
    return data.inflation_rub;
  }
  // Для USD / EUR используем историческую долларовую инфляцию США (US CPI)
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
    2025: 2.7,
    2026: 2.4,
  };
  return usCpiByYear[data.year] ?? 2.5;
}

/**
 * Основная функция расчета сравнения доходности активов
 */
export function calculateAssetComparison(
  inputs: CompareInputs,
  dataset: HistoricalYearData[] = HISTORICAL_DATA
): CompareResult {
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

  const maxYear = dataset.length > 0 ? Math.max(...dataset.map((d) => d.year)) : 2026;
  const validStartYear = Math.max(2003, Math.min(startYear, endYear));
  const validEndYear = Math.max(validStartYear, Math.min(maxYear, endYear));
  const yearsCount = validEndYear - validStartYear + 1;

  // Фильтруем исторические данные по выбранному диапазону лет
  const filteredData = dataset.filter(
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
      isYtd: yearData.isYtd,
    };

    const annualReturnPoint: AnnualReturnPoint = {
      year,
      inflation_rub: yearData.inflation_rub,
      inflation_byn: yearData.inflation_byn,
      isYtd: yearData.isYtd,
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
        r = singleAssetReturns["deposits"] ?? singleAssetReturns["deposits_by"] ?? 0;
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
      rank: 0,
    });
  }

  // Сортировка по итоговому капиталу
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
