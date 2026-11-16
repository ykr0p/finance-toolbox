import Link from "next/link";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-black text-2xl mb-4 shadow-sm">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
        Страница не найдена
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        Запрошенный калькулятор или страница не существуют или были перемещены в каталог.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>На главную (FIRE)</span>
        </Link>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition shadow-xs"
        >
          <Compass className="w-4 h-4" />
          <span>Каталог калькуляторов</span>
        </Link>
      </div>
    </div>
  );
}
