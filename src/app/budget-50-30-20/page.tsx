import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Бюджетный планировщик (50/30/20) | Финансовый Калькулятор",
  description: "Распределение доходов: 50% на нужды, 30% на желания, 20% на инвестиции",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "budget-50-30-20")!;
  return <UnderDevelopmentPage meta={meta} />;
}
