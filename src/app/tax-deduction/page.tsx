import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор налогового вычета (аналог ИИС) | Финансовый Калькулятор",
  description: "Расчет возврата подоходного налога по социальным и инвестиционным льготам",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "tax-deduction")!;
  return <UnderDevelopmentPage meta={meta} />;
}
