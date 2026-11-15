import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";

export const metadata: Metadata = {
  title: "Финансовые Калькуляторы | FIRE и Сравнение Активов",
  description: "Интерактивные финансовые калькуляторы: расчет ранней пенсии (FIRE) и историческое сравнение доходности классов активов (акции РФ и США, золото, недвижимость, вклады, ОФЗ, биткоин).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased font-sans text-slate-800 bg-slate-50">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
