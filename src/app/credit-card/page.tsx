import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор кредитной карты (льготный период) | Финансовый Калькулятор",
  description: "Расчет даты окончания беспроцентного периода и минимальных платежей",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "credit-card")!;
  return <UnderDevelopmentPage meta={meta} />;
}
