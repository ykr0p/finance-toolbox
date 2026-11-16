import { Metadata } from "next";
import { MonteCarloCalculator } from "@/components/monte-carlo/MonteCarloCalculator";

export const metadata: Metadata = {
  title: "Калькулятор Монте-Карло: Стресс-тест инвестиций | Финансовый Калькулятор",
  description:
    "Продвинутая симуляция Монте-Карло с прогоном тысяч случайных рыночных сценариев, веером квантилей и оценкой риска последовательности доходностей.",
};

export default function MonteCarloPage() {
  return <MonteCarloCalculator />;
}
