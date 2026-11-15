import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Калькулятор раннего выхода на пенсию (FIRE)",
  description: "Калькулятор раннего выхода на пенсию (FIRE). Простая и гибкая симуляция роста капитала и финансовой независимости.",
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
