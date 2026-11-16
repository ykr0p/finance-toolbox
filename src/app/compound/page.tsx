import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор сложного процента | Финансовый Калькулятор",
  description: "Моделирование долгосрочного сложного процента с регулярными довнесениями",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "compound")!;
  return <UnderDevelopmentPage meta={meta} />;
}
