import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор подушки безопасности | Финансовый Калькулятор",
  description: "Расчет резервного фонда на 3, 6 или 12 месяцев расходов",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "emergency-fund")!;
  return <UnderDevelopmentPage meta={meta} />;
}
