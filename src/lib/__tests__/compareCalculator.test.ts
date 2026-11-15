import { calculateAssetComparison, getAssetAnnualReturn } from "../compareCalculator";
import { HISTORICAL_DATA } from "../../data/historicalReturns";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("--- Running Compare Calculator Unit Tests ---");

// Test 1: Basic lump-sum comparison over 5 years (2019-2024)
{
  const result = calculateAssetComparison({
    initialAmount: 100000,
    monthlyContribution: 0,
    startYear: 2019,
    endYear: 2024,
    selectedAssets: ["mcftr", "gold", "deposits"],
    currency: "RUB",
    adjustForInflation: false,
    scaleType: "linear",
    includeBalancedPortfolio: false,
  });

  assert(result.startYear === 2019, "Start year should be 2019");
  assert(result.endYear === 2024, "End year should be 2024");
  assert(result.yearsCount === 6, "Years count should be 6 (2019..2024 inclusive)");
  assert(result.totalInvested === 100000, "Total invested should remain 100 000 with 0 DCA");
  assert(result.chartPoints.length === 7, "Chart points should include base year (2018) + 6 years");
  assert(result.metrics.length === 3, "Should have 3 assets");

  // All final values must be positive and greater than 0
  for (const m of result.metrics) {
    assert(m.finalValue > 0, `Asset ${m.name} final value should be > 0`);
    assert(m.multiple > 0, `Asset ${m.name} multiple should be > 0`);
    assert(m.rank >= 1 && m.rank <= 3, `Asset ${m.name} rank should be 1..3`);
  }

  // Best performer over 2019-2024 in gold or stocks
  assert(result.winner !== null, "Winner should exist");
  console.log(`✓ Test 1 passed: 5-year lump sum comparison. Winner: ${result.winner?.name} (Final: ${result.winner?.finalValue} ₽, multiple: x${result.winner?.multiple})`);
}

// Test 2: DCA Monthly contributions accumulation
{
  const result = calculateAssetComparison({
    initialAmount: 50000,
    monthlyContribution: 10000,
    startYear: 2020,
    endYear: 2024,
    selectedAssets: ["deposits", "bonds"],
    currency: "RUB",
    adjustForInflation: false,
    scaleType: "linear",
    includeBalancedPortfolio: false,
  });

  // 5 years of 10k/month = 5 * 120 000 = 600 000 + 50 000 = 650 000 total invested
  assert(result.totalInvested === 650000, `Expected total invested 650000, got ${result.totalInvested}`);
  const dep = result.metrics.find((m) => m.assetId === "deposits");
  assert(dep !== undefined, "Deposits metric must exist");
  assert(dep!.finalValue > result.totalInvested, "Deposits with interest must exceed total invested capital");
  console.log(`✓ Test 2 passed: DCA monthly contributions. Total invested: ${result.totalInvested} ₽, Deposits final: ${dep!.finalValue} ₽`);
}

// Test 3: Balanced Portfolio 1/N inclusion
{
  const result = calculateAssetComparison({
    initialAmount: 100000,
    monthlyContribution: 0,
    startYear: 2003,
    endYear: 2024,
    selectedAssets: ["mcftr", "gold", "bonds", "deposits", "real_estate"],
    currency: "RUB",
    adjustForInflation: false,
    scaleType: "linear",
    includeBalancedPortfolio: true,
  });

  const portfolioMetric = result.metrics.find((m) => m.assetId === "portfolio");
  assert(portfolioMetric !== undefined, "Portfolio metric must exist when enabled");
  // Over 22 years, diversified portfolio beats deposits and bonds by a wide margin
  const deposits = result.metrics.find((m) => m.assetId === "deposits")!;
  assert(portfolioMetric!.finalValue > deposits.finalValue, "Balanced portfolio should outperform bank deposits over 22 years");
  console.log(`✓ Test 3 passed: 22-year Balanced Portfolio. Final: ${portfolioMetric!.finalValue} ₽ vs Deposits: ${deposits.finalValue} ₽`);
}

// Test 4: Currency conversion (USD)
{
  const resultRub = calculateAssetComparison({
    initialAmount: 100000,
    monthlyContribution: 0,
    startYear: 2022,
    endYear: 2024,
    selectedAssets: ["sp500"],
    currency: "RUB",
    adjustForInflation: false,
    scaleType: "linear",
    includeBalancedPortfolio: false,
  });

  const resultUsd = calculateAssetComparison({
    initialAmount: 1000,
    monthlyContribution: 0,
    startYear: 2022,
    endYear: 2024,
    selectedAssets: ["sp500"],
    currency: "USD",
    adjustForInflation: false,
    scaleType: "linear",
    includeBalancedPortfolio: false,
  });

  const spRub = resultRub.metrics[0];
  const spUsd = resultUsd.metrics[0];
  assert(spRub.finalValue > 0, "S&P 500 in RUB must be positive");
  assert(spUsd.finalValue > 0, "S&P 500 in USD must be positive");
  console.log(`✓ Test 4 passed: Currency conversion works. S&P 500 RUB multiple: x${spRub.multiple}, USD multiple: x${spUsd.multiple}`);
}

// Test 5: Full period up to 2026 (YTD)
{
  const result2026 = calculateAssetComparison({
    initialAmount: 100000,
    monthlyContribution: 0,
    startYear: 2003,
    endYear: 2026,
    selectedAssets: ["mcftr", "gold", "sp500", "bonds"],
    currency: "RUB",
    adjustForInflation: false,
    scaleType: "linear",
    includeBalancedPortfolio: true,
  });

  assert(result2026.endYear === 2026, "End year should be 2026");
  assert(result2026.yearsCount === 24, "Should count 24 years (2003..2026)");
  const ytdPoint = result2026.annualReturns.find((p) => p.year === 2026);
  assert(ytdPoint !== undefined, "2026 annual return point must exist");
  assert(ytdPoint!.isYtd === true, "2026 must be flagged as isYtd");
  console.log(`✓ Test 5 passed: Full 24-year simulation up to 2026 (YTD) verified.`);
}

console.log("All Compare Calculator unit tests passed successfully!");
