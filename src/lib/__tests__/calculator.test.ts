import { calculateFIRE } from "../calculator";
import { SimpleFireInputs, FlexibleFireInputs } from "../../types/fire";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function runTests() {
  console.log("Starting FIRE calculation test suite...");

  // Test 1: Simple version standard case
  {
    const inputs: { mode: "simple" } & SimpleFireInputs = {
      mode: "simple",
      age: 30,
      monthly_income: 150000,
      monthly_expenses: 60000,
      personal_inflation: 10,
      savings_indexation: 10,
      current_assets: 1500000,
      liabilities_value: 0,
      dividend_yield: 8,
      capital_growth: 7,
      capital_multiplier: 1,
    };

    const res = calculateFIRE(inputs);

    // Initial calculations check
    assert(res.monthly_savings_today === 90000, "Monthly savings should be 150k - 60k = 90k");
    assert(res.current_savings_rate === 60, "Savings rate should be 60%");
    assert(res.target_capital_today === 9000000, "Target capital today should be (60k*12)/0.08 = 9M");
    assert(res.initial_total_capital === 1500000, "Initial capital should be 1.5M");
    assert(res.initial_cushion === 0, "Simple version cushion must be 0");
    assert(res.initial_assets === 1500000, "Initial assets should be 1.5M");

    // Simulation year 1 check
    const y1 = res.rows.find((r) => r.year === 1)!;
    assert(y1.age === 31, "Year 1 age should be 31");
    // annual expenses = 720k * 1.10 = 792k
    assert(Math.abs(y1.annual_expenses - 792000) < 0.01, "Year 1 expenses should be 792k");
    assert(y1.savings_added === 1080000, "Year 1 savings added should be 90k * 12 = 1.08M");
    assert(y1.capital_body_growth === 1500000 * 0.07, "Year 1 body growth should be 1.5M * 7% = 105k");
    assert(y1.dividends === 1500000 * 0.08, "Year 1 dividends should be 1.5M * 8% = 120k");
    assert(y1.dividends_reinvested === 120000, "Year 1 dividends should be fully reinvested");
    assert(y1.dividends_for_consumption === 0, "Year 1 consumption dividends should be 0");
    assert(y1.total_capital === 1500000 + 105000 + 120000 + 1080000, "Year 1 total capital should be 2,805,000");

    // Retirement reached
    assert(res.retirement_age !== null, "Retirement age should be reached");
    assert(res.years_to_retirement !== null && res.years_to_retirement > 0, "Years to retirement should be > 0");

    const retRow = res.rows.find((r) => r.year === res.years_to_retirement)!;
    assert(retRow.is_retired === true, "Row at retirement should have is_retired = true");
    assert(retRow.total_capital >= retRow.target_capital, "Capital at retirement must reach or exceed target");

    // Year after retirement: savings_added should be 0, dividends_for_consumption > 0
    const nextRow = res.rows.find((r) => r.year === res.years_to_retirement! + 1);
    if (nextRow) {
      assert(nextRow.savings_added === 0, "After retirement, savings_added must be 0");
      assert(nextRow.dividends_for_consumption > 0, "After retirement, dividends_for_consumption must be > 0");
    }

    console.log("✓ Test 1 (Simple Mode) passed!");
  }

  // Test 2: Flexible version with cushion, debts and dividend consumption
  {
    const inputs: { mode: "flexible" } & FlexibleFireInputs = {
      mode: "flexible",
      age: 28,
      monthly_income: 200000,
      monthly_expenses: 80000,
      personal_inflation: 8,
      savings_indexation: 10,
      current_assets: 2000000,
      liabilities_value: 500000,
      dividend_yield: 9,
      capital_growth: 8,
      cushion_months: 6,
      short_term_debts: 200000,
      cushion_yield: 12,
      dividend_consumption_pct: 70,
    };

    const res = calculateFIRE(inputs);

    // Initial calculations check
    const expectedCushion = 80000 * 6; // 480 000
    const netWealth = 2000000 + 500000 - 200000; // 2 300 000
    const expectedAssets = netWealth - expectedCushion; // 1 820 000

    assert(res.initial_cushion === expectedCushion, "Initial cushion should be 480k");
    assert(res.initial_assets === expectedAssets, "Initial assets should be 1.82M");
    assert(res.initial_total_capital === netWealth, "Initial total capital should be 2.3M");

    // Target capital today check:
    // (80000 * 12 / (0.70)) / 0.09 + 480000
    const annualExpensesToday = 80000 * 12;
    const expectedTarget = annualExpensesToday / (0.09 * 0.7) + expectedCushion;
    assert(
      Math.abs(res.target_capital_today - expectedTarget) < 0.01,
      "Target capital today must match formula"
    );

    // Simulation year 1 check
    const y1 = res.rows.find((r) => r.year === 1)!;
    assert(y1.required_cushion === (y1.annual_expenses / 12) * 6, "Required cushion should grow with inflation");
    assert(y1.cushion_income === expectedCushion * 0.12, "Cushion income should be cushion * 12%");

    // After retirement check:
    if (res.years_to_retirement !== null) {
      const postRet = res.rows.find((r) => r.year === res.years_to_retirement! + 1);
      if (postRet) {
        assert(postRet.savings_added === 0, "Savings contributions cease after retirement");
        // 70% of dividends consumed, 30% reinvested
        const expectedCons = postRet.dividends * 0.7;
        const expectedReinv = postRet.dividends * 0.3;
        assert(Math.abs(postRet.dividends_for_consumption - expectedCons) < 0.1, "70% consumed");
        assert(Math.abs(postRet.dividends_reinvested - expectedReinv) < 0.1, "30% reinvested");
      }
    }

    console.log("✓ Test 2 (Flexible Mode) passed!");
  }

  // Test 3: Already retired from day 1
  {
    const inputs: { mode: "simple" } & SimpleFireInputs = {
      mode: "simple",
      age: 40,
      monthly_income: 100000,
      monthly_expenses: 50000,
      personal_inflation: 10,
      savings_indexation: 10,
      current_assets: 20000000, // 20M > target 7.5M
      liabilities_value: 0,
      dividend_yield: 8,
      capital_growth: 7,
      capital_multiplier: 1,
    };

    const res = calculateFIRE(inputs);
    assert(res.is_already_retired === true, "Should be already retired");
    assert(res.retirement_age === 40, "Retirement age should be start age");
    assert(res.years_to_retirement === 0, "Years to retirement should be 0");
    console.log("✓ Test 3 (Already Retired) passed!");
  }

  // Test 4: Capital Multiplier 2x (Simple Mode)
  {
    const inputs1: { mode: "simple" } & SimpleFireInputs = {
      mode: "simple",
      age: 30,
      monthly_income: 150000,
      monthly_expenses: 50000,
      personal_inflation: 10,
      savings_indexation: 10,
      current_assets: 1000000,
      liabilities_value: 0,
      dividend_yield: 10,
      capital_growth: 5,
      capital_multiplier: 1,
    };

    const inputs2: { mode: "simple" } & SimpleFireInputs = {
      ...inputs1,
      capital_multiplier: 2,
    };

    const res1 = calculateFIRE(inputs1);
    const res2 = calculateFIRE(inputs2);

    assert(res2.target_capital_today === res1.target_capital_today * 2, "Multiplier 2x should double target capital");
    assert(
      res2.years_to_retirement! > res1.years_to_retirement!,
      "Reaching 2x capital should take more years"
    );
    console.log("✓ Test 4 (Capital Multiplier 2x) passed!");
  }

  console.log("All tests passed successfully!");
}

runTests();
