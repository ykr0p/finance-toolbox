"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Safely reads a value from localStorage with JSON parsing and fallback.
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") {
    return defaultValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);

    // Merge objects to ensure newly added properties in schema are preserved
    if (
      typeof defaultValue === "object" &&
      defaultValue !== null &&
      !Array.isArray(defaultValue) &&
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return { ...defaultValue, ...parsed };
    }

    return parsed as T;
  } catch (err) {
    console.warn(`[storage] Error loading key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Safely saves a value to localStorage with JSON stringification.
 */
export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] Error saving key "${key}":`, err);
  }
}

/**
 * Removes a key from localStorage safely.
 */
export function removeFromStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[storage] Error removing key "${key}":`, err);
  }
}

/**
 * React hook to synchronize state with localStorage.
 * - Prevents SSR hydration mismatches by initializing with defaultValue on server
 * - Loads persisted value on mount
 * - Only overwrites localStorage once initial load has completed
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const isLoadedRef = useRef(false);

  // 1. Initial client-side load
  useEffect(() => {
    const initial = typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue;
    const saved = loadFromStorage<T>(key, initial);
    setState(saved);
    isLoadedRef.current = true;
    setIsLoaded(true);
  }, [key]);

  // 2. Persist state on change (only after initial load has finished)
  useEffect(() => {
    if (!isLoadedRef.current) return;
    saveToStorage<T>(key, state);
  }, [key, state]);

  return [state, setState, isLoaded];
}

/* =====================================================================
   Calculation Scenarios & Template History System
   ===================================================================== */

export interface SavedCalculation<T = any> {
  id: string;
  calculatorId: string; // 'fire' | 'compare' | 'monte-carlo' | ...
  title: string;
  createdAt: number;
  updatedAt: number;
  currency?: string;
  data: T;
  summary?: string; // Optional short human readable tag (e.g. "15 лет, 10 млн ₽")
}

const TEMPLATES_STORAGE_KEY = "fincalc_saved_templates_v1";

/**
 * Retrieve all saved templates/scenarios, optionally filtered by calculator
 */
export function getSavedCalculations(calculatorId?: string): SavedCalculation[] {
  const list = loadFromStorage<SavedCalculation[]>(TEMPLATES_STORAGE_KEY, []);
  if (!calculatorId) return list;
  return list.filter((item) => item.calculatorId === calculatorId);
}

/**
 * Save current calculation state as a named template/scenario
 */
export function saveCalculation<T>(
  calculatorId: string,
  title: string,
  data: T,
  options?: { currency?: string; summary?: string }
): SavedCalculation<T> {
  const list = loadFromStorage<SavedCalculation[]>(TEMPLATES_STORAGE_KEY, []);
  const now = Date.now();
  const newEntry: SavedCalculation<T> = {
    id: `calc_${now}_${Math.random().toString(36).slice(2, 7)}`,
    calculatorId,
    title: title.trim() || `Расчет от ${new Date(now).toLocaleDateString("ru-RU")}`,
    createdAt: now,
    updatedAt: now,
    currency: options?.currency,
    summary: options?.summary,
    data,
  };

  const updated = [newEntry, ...list];
  saveToStorage(TEMPLATES_STORAGE_KEY, updated);
  return newEntry;
}

/**
 * Delete a saved calculation by ID
 */
export function deleteSavedCalculation(id: string): void {
  const list = loadFromStorage<SavedCalculation[]>(TEMPLATES_STORAGE_KEY, []);
  const updated = list.filter((item) => item.id !== id);
  saveToStorage(TEMPLATES_STORAGE_KEY, updated);
}

/**
 * Rename a saved calculation
 */
export function renameSavedCalculation(id: string, newTitle: string): void {
  const list = loadFromStorage<SavedCalculation[]>(TEMPLATES_STORAGE_KEY, []);
  const updated = list.map((item) =>
    item.id === id ? { ...item, title: newTitle.trim(), updatedAt: Date.now() } : item
  );
  saveToStorage(TEMPLATES_STORAGE_KEY, updated);
}
