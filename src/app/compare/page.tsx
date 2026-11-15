import { Metadata } from "next";
import { AssetComparisonCalculator } from "@/components/compare/AssetComparisonCalculator";

export const metadata: Metadata = {
  title: "Сравнение классов активов | Историческая доходность и онлайн котировки 2003–2026",
  description: "Инструмент наглядного сравнения роста инвестиций в акции РФ с дивидендами (MCFTR), акции США (S&P 500), золото, московскую недвижимость, банковские депозиты, ОФЗ и биткоин с автообновлением котировок в реальном времени.",
};

export default function ComparePage() {
  return <AssetComparisonCalculator />;
}
