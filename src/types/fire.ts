export type CalculatorMode = "simple" | "flexible";

export type CurrencyCode = "RUB" | "USD" | "EUR" | "BYN";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  defaultMonthlyIncome: number;
  defaultMonthlyExpenses: number;
  defaultAssets: number;
  incomeStep: number;
  assetsStep: number;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  RUB: {
    code: "RUB",
    symbol: "₽",
    name: "Российский рубль (RUB)",
    flag: "🇷🇺",
    defaultMonthlyIncome: 150000,
    defaultMonthlyExpenses: 60000,
    defaultAssets: 1500000,
    incomeStep: 5000,
    assetsStep: 50000,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "Доллар США (USD)",
    flag: "🇺🇸",
    defaultMonthlyIncome: 3500,
    defaultMonthlyExpenses: 1500,
    defaultAssets: 35000,
    incomeStep: 100,
    assetsStep: 1000,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Евро (EUR)",
    flag: "🇪🇺",
    defaultMonthlyIncome: 3200,
    defaultMonthlyExpenses: 1400,
    defaultAssets: 32000,
    incomeStep: 100,
    assetsStep: 1000,
  },
  BYN: {
    code: "BYN",
    symbol: "Br",
    name: "Белорусский рубль (BYN)",
    flag: "🇧🇾",
    defaultMonthlyIncome: 4500,
    defaultMonthlyExpenses: 2000,
    defaultAssets: 45000,
    incomeStep: 100,
    assetsStep: 1000,
  },
};

export interface SimpleFireInputs {
  age: number; // Ваш возраст
  monthly_income: number; // Ежемесячный доход
  personal_inflation: number; // Личная инфляция (%)
  savings_indexation: number; // Индексация сбережений (%)
  monthly_expenses: number; // Ежемесячные расходы
  current_assets: number; // Текущий капитал в активах
  liabilities_value: number; // Продажная стоимость пассивов
  dividend_yield: number; // Дивидендная доходность (%)
  capital_growth: number; // Доходность тела капитала (%)
  capital_multiplier: number; // Множитель капитала (1 - покрытие дивидендами, 2 - дивиденды х2)
}

export interface FlexibleFireInputs {
  age: number; // Ваш возраст
  monthly_income: number; // Ежемесячный доход
  personal_inflation: number; // Личная инфляция (%)
  savings_indexation: number; // Индексация сбережений (%)
  monthly_expenses: number; // Ежемесячные расходы
  current_assets: number; // Текущий капитал в активах
  liabilities_value: number; // Продажная стоимость пассивов
  dividend_yield: number; // Дивидендная доходность (%)
  capital_growth: number; // Доходность тела капитала (%)
  cushion_months: number; // Подушка безопасности в месяцах
  short_term_debts: number; // Стоимость краткосрочных долгов
  cushion_yield: number; // Доходность подушки безопасности (%)
  dividend_consumption_pct: number; // Процент дивидендов для потребления (%)
}

export type FireInputs = 
  | ({ mode: "simple" } & SimpleFireInputs)
  | ({ mode: "flexible" } & FlexibleFireInputs);

export interface SimulationYearRow {
  year: number; // 0 (старт) или 1..50
  age: number; // Возраст
  annual_expenses: number; // Расходы в год
  required_cushion: number; // Требуемая подушка
  target_capital: number; // Необходимая сумма капитала (цель с инфляцией)
  total_capital: number; // Общий капитал
  assets: number; // Капитал в активах
  cushion: number; // Подушка
  savings_added: number; // Довнесения (сбережения)
  cushion_income: number; // Доход с подушки
  capital_body_growth: number; // Прирост тела
  dividends: number; // Дивиденды всего
  dividends_reinvested: number; // Дивиденды (реинвест)
  dividends_for_consumption: number; // Дивиденды (на потребление)
  is_retired: boolean; // Достигнута ли пенсия
  passive_income: number; // Совокупный пассивный доход
}

export interface FireCalculationResult {
  mode: CalculatorMode;
  target_capital_today: number; // Целевой капитал в сегодняшних деньгах
  retirement_age: number | null; // Возраст выхода на пенсию
  years_to_retirement: number | null; // Сколько лет осталось
  is_already_retired: boolean; // Пенсия уже достигнута на старте
  current_savings_rate: number; // Норма сбережений (%)
  monthly_savings_today: number; // Сбережения в месяц сегодня
  capital_at_retirement: number | null; // Капитал в момент выхода на пенсию
  annual_expenses_at_retirement: number | null; // Расходы в год выхода на пенсию
  initial_total_capital: number; // Стартовый общий капитал
  initial_assets: number; // Стартовые активы
  initial_cushion: number; // Стартовая подушка
  rows: SimulationYearRow[]; // Таблица по годам (0..50)
}
