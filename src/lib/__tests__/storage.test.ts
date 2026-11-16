import {
  loadFromStorage,
  saveToStorage,
  getSavedCalculations,
  saveCalculation,
  deleteSavedCalculation,
  renameSavedCalculation,
} from "../storage";

// Simple in-memory mock for localStorage in NodeJS
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// Assign mock to global window
(global as any).window = {
  localStorage: new LocalStorageMock(),
};

function runStorageTests() {
  console.log("--- Running Storage Unit Tests ---");

  // 1. Basic save & load with fallback
  const fallback = { a: 1, b: "hello" };
  const loadedDefault = loadFromStorage("non_existent_key", fallback);
  if (loadedDefault.a !== 1 || loadedDefault.b !== "hello") {
    throw new Error("Test 1 failed: Fallback not returned for missing key");
  }
  console.log("✓ Test 1: Fallback loaded correctly");

  // 2. Save & Load JSON
  saveToStorage("test_key", { a: 99, b: "world" });
  const loadedSaved = loadFromStorage("test_key", fallback);
  if (loadedSaved.a !== 99 || loadedSaved.b !== "world") {
    throw new Error("Test 2 failed: Stored value not parsed correctly");
  }
  console.log("✓ Test 2: Save and load succeeded");

  // 3. Schema evolution merging
  // If user stored { a: 99 }, but new default has { a: 1, newProp: true }
  saveToStorage("evolve_key", { a: 99 });
  const merged = loadFromStorage("evolve_key", { a: 1, newProp: true });
  if (merged.a !== 99 || (merged as any).newProp !== true) {
    throw new Error("Test 3 failed: Object merge did not preserve new properties");
  }
  console.log("✓ Test 3: Schema evolution merge succeeded");

  // 4. Saved Calculation Scenarios CRUD
  const entry1 = saveCalculation("monte-carlo", "Мой план FIRE 1", { capital: 5000000 }, { currency: "RUB" });
  const entry2 = saveCalculation("compare", "Акции против Золота", { period: 10 }, { currency: "USD" });

  const allMonteCarlo = getSavedCalculations("monte-carlo");
  if (allMonteCarlo.length !== 1 || allMonteCarlo[0].id !== entry1.id) {
    throw new Error("Test 4 failed: Filter by calculatorId failed");
  }

  const allTotal = getSavedCalculations();
  if (allTotal.length !== 2) {
    throw new Error("Test 4 failed: All calculations count mismatch");
  }

  // Rename
  renameSavedCalculation(entry1.id, "Обновленный план FIRE 1");
  const renamed = getSavedCalculations("monte-carlo")[0];
  if (renamed.title !== "Обновленный план FIRE 1") {
    throw new Error("Test 4 failed: Rename failed");
  }

  // Delete
  deleteSavedCalculation(entry2.id);
  const remaining = getSavedCalculations();
  if (remaining.length !== 1 || remaining[0].id !== entry1.id) {
    throw new Error("Test 4 failed: Delete failed");
  }
  console.log("✓ Test 4: Scenario and Template CRUD operations succeeded");

  console.log("All Storage unit tests passed successfully!\n");
}

runStorageTests();
