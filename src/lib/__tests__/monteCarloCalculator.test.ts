import { calculateMonteCarlo } from "../monteCarloCalculator";
import { MonteCarloInputs } from "@/types/monteCarlo";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("--- Running Monte Carlo Calculator Unit Tests ---");

// Test 1: Accumulation mode with 1000 simulations
{
  const inputs: MonteCarloInputs = {
    initialCapital: 100000,
    mode: "accumulation",
    years: 15,
    monthlyCashflow: 30000,
    inflationRate: 6.0,
    adjustCashflowForInflation: true,
    expectedReturn: 12.0,
    volatility: 15.0,
    portfolioPreset: "balanced",
    simulationCount: 1000,
    scaleType: "linear",
    showSamplePaths: false,
  };

  const result = calculateMonteCarlo(inputs);
  console.log(`✓ Test 1: Accumulation successRate: ${result.successRate}%, medianFinal: ${result.medianFinalCapital} (took ${result.computationTimeMs}ms)`);

  assert(result.successRate === 100, "Accumulation should have 100% survival rate");
  assert(result.medianFinalCapital > inputs.initialCapital, "Final capital should exceed initial");
  assert(result.percentileTrajectory.length === 16, "Should have 16 points for 15 years");

  // Check percentile order p95 >= p75 >= p50 >= p25 >= p10
  const finalPoint = result.percentileTrajectory[15];
  assert(finalPoint.p95 >= finalPoint.p75, "p95 >= p75");
  assert(finalPoint.p75 >= finalPoint.p50, "p75 >= p50");
  assert(finalPoint.p50 >= finalPoint.p25, "p50 >= p25");
  assert(finalPoint.p25 >= finalPoint.p10, "p25 >= p10");
}

// Test 2: Retirement mode (Safe vs Depleted)
{
  const safeInputs: MonteCarloInputs = {
    initialCapital: 10000000, // 10M
    mode: "retirement",
    years: 30,
    monthlyCashflow: 30000, // 360k/yr = 3.6% SWR (very safe)
    inflationRate: 5.0,
    adjustCashflowForInflation: true,
    expectedReturn: 12.0,
    volatility: 12.0,
    portfolioPreset: "balanced",
    simulationCount: 1000,
    scaleType: "linear",
    showSamplePaths: false,
  };

  const safeResult = calculateMonteCarlo(safeInputs);
  console.log(`✓ Test 2: Safe retirement successRate: ${safeResult.successRate}%`);
  assert(safeResult.successRate >= 90, "Low withdrawal rate should have >= 90% success");

  // Dangerous high withdrawal rate
  const dangerousInputs: MonteCarloInputs = {
    ...safeInputs,
    monthlyCashflow: 150000, // 1.8M/yr = 18% SWR (guaranteed depletion)
  };
  const dangerousResult = calculateMonteCarlo(dangerousInputs);
  console.log(`✓ Test 2b: Dangerous retirement successRate: ${dangerousResult.successRate}%`);
  assert(dangerousResult.successRate < 30, "18% SWR should fail often");
  assert(dangerousResult.totalDepletedCount > 0, "Should have depleted simulations");
}

// Test 3: Historical Bootstrap mode
{
  const bootstrapInputs: MonteCarloInputs = {
    initialCapital: 500000,
    mode: "retirement",
    years: 20,
    monthlyCashflow: 20000,
    inflationRate: 5.0,
    adjustCashflowForInflation: true,
    expectedReturn: 13.0,
    volatility: 18.0,
    portfolioPreset: "bootstrap",
    simulationCount: 1000,
    scaleType: "linear",
    showSamplePaths: true,
  };

  const bResult = calculateMonteCarlo(bootstrapInputs);
  console.log(`✓ Test 3: Historical bootstrap successRate: ${bResult.successRate}%`);
  assert(bResult.percentileTrajectory[0].samplePaths.length > 0, "Should have sample paths");
}

// Test 4: Performance with 5000 simulations
{
  const perfInputs: MonteCarloInputs = {
    initialCapital: 1000000,
    mode: "accumulation",
    years: 30,
    monthlyCashflow: 25000,
    inflationRate: 5.0,
    adjustCashflowForInflation: true,
    expectedReturn: 11.0,
    volatility: 16.0,
    portfolioPreset: "sp500",
    simulationCount: 5000,
    scaleType: "linear",
    showSamplePaths: true,
  };

  const perfResult = calculateMonteCarlo(perfInputs);
  console.log(`✓ Test 4: 5,000 simulations completed in ${perfResult.computationTimeMs}ms`);
  assert(perfResult.computationTimeMs < 1000, "5,000 simulations should finish in < 1 sec");
}

console.log("All Monte Carlo Calculator unit tests passed successfully!");
