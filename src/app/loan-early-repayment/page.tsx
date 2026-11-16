import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор досрочного погашения кредита | Финансовый Калькулятор",
  description: "Универсальный расчет досрочного закрытия потребительских и автокредитов",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "loan-early-repayment")!;
  return <UnderDevelopmentPage meta={meta} />;
}
