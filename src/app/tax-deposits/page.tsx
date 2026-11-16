import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Налоговый калькулятор для вкладов | Финансовый Калькулятор",
  description: "Расчет подоходного налога 13% с учетом сроков депозита и необлагаемых лимитов",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "tax-deposits")!;
  return <UnderDevelopmentPage meta={meta} />;
}
