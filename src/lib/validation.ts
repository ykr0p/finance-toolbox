import { FireInputs } from "@/types/fire";

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ValidationWarnings {
  [key: string]: string | undefined;
}

export function validateInputs(inputs: FireInputs): {
  isValid: boolean;
  errors: ValidationErrors;
  warnings: ValidationWarnings;
} {
  const errors: ValidationErrors = {};
  const warnings: ValidationWarnings = {};

  // Age validation
  if (inputs.age === undefined || isNaN(inputs.age)) {
    errors.age = "Укажите ваш возраст";
  } else if (inputs.age < 18 || inputs.age > 90) {
    errors.age = "Возраст должен быть от 18 до 90 лет";
  }

  // Monthly income
  if (inputs.monthly_income === undefined || isNaN(inputs.monthly_income)) {
    errors.monthly_income = "Укажите ежемесячный доход";
  } else if (inputs.monthly_income < 0) {
    errors.monthly_income = "Доход не может быть отрицательным";
  }

  // Monthly expenses
  if (inputs.monthly_expenses === undefined || isNaN(inputs.monthly_expenses)) {
    errors.monthly_expenses = "Укажите ежемесячные расходы";
  } else if (inputs.monthly_expenses <= 0) {
    errors.monthly_expenses = "Расходы должны быть больше 0";
  }

  // Income vs Expenses check
  if (
    inputs.monthly_income !== undefined &&
    inputs.monthly_expenses !== undefined &&
    inputs.monthly_income < inputs.monthly_expenses
  ) {
    warnings.monthly_income = "Расходы превышают доходы! Накопление капитала невозможно без сбережений.";
  }

  // Dividend yield
  if (inputs.dividend_yield === undefined || isNaN(inputs.dividend_yield)) {
    errors.dividend_yield = "Укажите дивидендную доходность";
  } else if (inputs.dividend_yield <= 0) {
    errors.dividend_yield = "Дивидендная доходность должна быть больше 0%";
  } else if (inputs.dividend_yield > 40) {
    warnings.dividend_yield = "Дивидендная доходность выше 40% маловероятна в долгосрочной перспективе.";
  }

  // Personal inflation
  if (inputs.personal_inflation === undefined || isNaN(inputs.personal_inflation)) {
    errors.personal_inflation = "Укажите личную инфляцию";
  } else if (inputs.personal_inflation < 0) {
    errors.personal_inflation = "Инфляция не может быть отрицательной";
  }

  // Savings indexation
  if (inputs.savings_indexation === undefined || isNaN(inputs.savings_indexation)) {
    errors.savings_indexation = "Укажите индексацию сбережений";
  } else if (inputs.savings_indexation < 0) {
    errors.savings_indexation = "Индексация не может быть отрицательной";
  }

  // Current assets
  if (inputs.current_assets === undefined || isNaN(inputs.current_assets)) {
    errors.current_assets = "Укажите размер активов";
  } else if (inputs.current_assets < 0) {
    errors.current_assets = "Активы не могут быть отрицательными";
  }

  // Liabilities
  if (inputs.liabilities_value === undefined || isNaN(inputs.liabilities_value)) {
    errors.liabilities_value = "Укажите стоимость пассивов";
  } else if (inputs.liabilities_value < 0) {
    errors.liabilities_value = "Стоимость пассивов не может быть отрицательной";
  }

  // Flexible specific
  if (inputs.mode === "flexible") {
    if (inputs.cushion_months === undefined || isNaN(inputs.cushion_months)) {
      errors.cushion_months = "Укажите размер подушки безопасности";
    } else if (inputs.cushion_months < 0 || inputs.cushion_months > 60) {
      errors.cushion_months = "Подушка безопасности обычно составляет от 0 до 60 месяцев";
    }

    if (inputs.short_term_debts === undefined || isNaN(inputs.short_term_debts)) {
      errors.short_term_debts = "Укажите размер долгов";
    } else if (inputs.short_term_debts < 0) {
      errors.short_term_debts = "Долги не могут быть отрицательными";
    }

    if (inputs.cushion_yield === undefined || isNaN(inputs.cushion_yield)) {
      errors.cushion_yield = "Укажите доходность подушки";
    } else if (inputs.cushion_yield < 0) {
      errors.cushion_yield = "Доходность подушки не может быть отрицательной";
    }

    if (
      inputs.dividend_consumption_pct === undefined ||
      isNaN(inputs.dividend_consumption_pct)
    ) {
      errors.dividend_consumption_pct = "Укажите процент дивидендов для потребления";
    } else if (
      inputs.dividend_consumption_pct <= 0 ||
      inputs.dividend_consumption_pct > 100
    ) {
      errors.dividend_consumption_pct = "Процент потребления должен быть от 1% до 100%";
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return { isValid, errors, warnings };
}
