import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор доходности облигаций (YTM) | Финансовый Калькулятор",
  description: "Сравнение выпусков облигаций по реальной доходности к погашению",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "bonds-ytm")!;
  return <UnderDevelopmentPage meta={meta} />;
}
