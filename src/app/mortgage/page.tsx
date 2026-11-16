import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Ипотечный калькулятор с досрочным погашением | Финансовый Калькулятор",
  description: "Расчет платежей, графика и экономии от досрочных взносов",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "mortgage")!;
  return <UnderDevelopmentPage meta={meta} />;
}
