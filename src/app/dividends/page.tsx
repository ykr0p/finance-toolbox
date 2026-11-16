import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор дивидендов | Финансовый Калькулятор",
  description: "Прогноз ежемесячного и годового пассивного дохода от портфеля акций",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "dividends")!;
  return <UnderDevelopmentPage meta={meta} />;
}
