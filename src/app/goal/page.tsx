import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор цели (обратный расчёт) | Финансовый Калькулятор",
  description: "Расчет ежемесячного взноса для достижения цели к определенному сроку",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "goal")!;
  return <UnderDevelopmentPage meta={meta} />;
}
