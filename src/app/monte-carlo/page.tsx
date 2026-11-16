import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор Монте-Карло | Финансовый Калькулятор",
  description: "Вероятностный стресс-тест портфеля с прогоном 10 000 случайных сценариев",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "monte-carlo")!;
  return <UnderDevelopmentPage meta={meta} />;
}
