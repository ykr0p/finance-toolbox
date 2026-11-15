import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Калькулятор раннего выхода на пенсию (FIRE) — Модель Бабайкина 2.0",
  description: "Калькулятор раннего выхода на пенсию по методологии «На пенсию в 35 лет» (Версия 2.0). Простая и гибкая симуляция роста капитала.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased font-sans text-slate-800">
        {children}
      </body>
    </html>
  );
}
