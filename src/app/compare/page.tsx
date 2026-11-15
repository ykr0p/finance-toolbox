import { Metadata } from "next";
import { AssetComparisonCalculator } from "@/components/compare/AssetComparisonCalculator";

export const metadata: Metadata = {
  title: "Сравнение классов активов | Историческая доходность 2003–2024",
  description: "Инструмент наглядного сравнения роста инвестиций в акции РФ с дивидендами (MCFTR), акции США (S&P 500), золото, московскую недвижимость, банковские депозиты, ОФЗ и биткоин.",
};

export default function ComparePage() {
  return <AssetComparisonCalculator />;
}
