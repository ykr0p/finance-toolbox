/**
 * Currency, number and plural formatters for FIRE calculator (Russian locale)
 */

export function formatCurrency(
  value: number,
  options?: { compact?: boolean; hideDecimals?: boolean }
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0 ₽";
  }

  if (options?.compact) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2).replace(/\.00$/, "")} млрд ₽`;
    }
    if (abs >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2).replace(/\.00$/, "")} млн ₽`;
    }
    if (abs >= 1_000) {
      return `${(value / 1_000).toFixed(0)} тыс. ₽`;
    }
  }

  const rounded = options?.hideDecimals !== false ? Math.round(value) : value;

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: options?.hideDecimals !== false ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(rounded);
}

export function formatNumber(value: number, maximumFractionDigits: number = 0): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }
  return `${value.toFixed(decimals).replace(/\.0$/, "")}%`;
}

/**
 * Proper Russian plural forms:
 * formatPlural(1, ['год', 'года', 'лет']) => "1 год"
 * formatPlural(24, ['год', 'года', 'лет']) => "24 года"
 * formatPlural(50, ['год', 'года', 'лет']) => "50 лет"
 */
export function formatPlural(value: number, titles: [string, string, string]): string {
  const abs = Math.abs(Math.round(value));
  const cases = [2, 0, 1, 1, 1, 2];
  const index =
    abs % 100 > 4 && abs % 100 < 20
      ? 2
      : cases[abs % 10 < 5 ? abs % 10 : 5];
  return `${value} ${titles[index]}`;
}

export function formatYears(years: number): string {
  return formatPlural(years, ["год", "года", "лет"]);
}

export function formatAge(age: number): string {
  return formatPlural(age, ["год", "года", "лет"]);
}
