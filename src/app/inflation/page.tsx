import { Metadata } from "next";
import { UnderDevelopmentPage } from "@/components/common/UnderDevelopmentPage";
import { CALCULATORS_CATALOG } from "@/data/calculatorsCatalog";

export const metadata: Metadata = {
  title: "Калькулятор инфляции | Финансовый Калькулятор",
  description: "Оценка покупательной способности и обесценения капитала за любой срок",
};

export default function Page() {
  const meta = CALCULATORS_CATALOG.find((c) => c.slug === "inflation")!;
  return <UnderDevelopmentPage meta={meta} />;
}
