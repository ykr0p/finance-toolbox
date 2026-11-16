export type CalculatorBlockId =
  | "investments" // Блок 1: Инвестиции и пассивный доход
  | "loans" // Блок 2: Кредиты и долги
  | "taxes" // Блок 3: Налоги и государственные льготы
  | "budget" // Блок 4: Планирование и бюджет
  | "advanced"; // Блок 5: Специализированные и продвинутые инструменты

export type CalculatorStatus = "ready" | "in_development" | "planned";

export interface CalculatorBlockInfo {
  id: CalculatorBlockId;
  number: number;
  title: string;
  shortTitle: string;
  emoji: string;
  description: string;
  gradient: string;
  badgeBg: string;
  badgeText: string;
}

export interface CalculatorMeta {
  id: string;
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  blockId: CalculatorBlockId;
  description: string;
  detailedOverview: string;
  plannedFeatures: string[];
  status: CalculatorStatus;
  badge: "Готов" | "В разработке" | "Скоро";
  iconName: string;
  gradient: string;
}
