"use client";

import React, { useState, useEffect } from "react";
import {
  Bookmark,
  Save,
  Trash2,
  FolderOpen,
  RotateCcw,
  X,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  SavedCalculation,
  getSavedCalculations,
  saveCalculation,
  deleteSavedCalculation,
} from "@/lib/storage";

interface CalculationTemplatesModalProps<T> {
  calculatorId: string;
  calculatorTitle: string;
  currentData: T;
  onLoadData: (data: T) => void;
  onResetDefaults?: () => void;
  currency?: string;
  defaultSummary?: string;
}

export function CalculationTemplatesModal<T>({
  calculatorId,
  calculatorTitle,
  currentData,
  onLoadData,
  onResetDefaults,
  currency,
  defaultSummary,
}: CalculationTemplatesModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [templates, setTemplates] = useState<SavedCalculation<T>[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Refresh templates list
  const refreshList = () => {
    setTemplates(getSavedCalculations(calculatorId));
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen, calculatorId]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim() || `Сценарий от ${new Date().toLocaleDateString("ru-RU")}`;
    saveCalculation(calculatorId, title, currentData, {
      currency,
      summary: defaultSummary,
    });
    setNewTitle("");
    setSaveSuccess(true);
    refreshList();
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    deleteSavedCalculation(id);
    refreshList();
  };

  const handleLoad = (data: T) => {
    onLoadData(data);
    setIsOpen(false);
  };

  const handleReset = () => {
    if (onResetDefaults) {
      if (confirm("Сбросить текущие параметры этого калькулятора к значениям по умолчанию?")) {
        onResetDefaults();
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Trigger Button in Header/Toolbar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
        title="Сохраненные шаблоны и история сценариев"
      >
        <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
        <span className="hidden sm:inline">Сценарии</span>
        {templates.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
            {templates.length}
          </span>
        )}
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="templates-dialog-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="templates-dialog-title"
                    className="text-base font-bold text-white tracking-tight"
                  >
                    История и шаблоны расчетов
                  </h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    {calculatorTitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5 overflow-y-auto">
              {/* Save Current Scenario Form */}
              <form onSubmit={handleSave} className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  <Save className="w-4 h-4 text-indigo-600" />
                  <span>Сохранить текущие параметры как сценарий</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Например: Оптимистичный план, Квартира в Минске..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Сохранено!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Сохранить</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Saved Scenarios List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Сохраненные сценарии ({templates.length}):</span>
                  {onResetDefaults && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Сбросить к заводским
                    </button>
                  )}
                </div>

                {templates.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    У вас пока нет сохраненных сценариев. Настройте параметры и нажмите «Сохранить» выше.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {templates.map((tpl) => (
                      <div
                        key={tpl.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-xs text-slate-900 truncate">
                            {tpl.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(tpl.createdAt).toLocaleDateString("ru-RU", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })}
                            </span>
                            {tpl.currency && (
                              <span className="font-semibold text-slate-500 uppercase">
                                {tpl.currency}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleLoad(tpl.data)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1"
                          >
                            <FolderOpen className="w-3 h-3" />
                            <span>Применить</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(tpl.id)}
                            className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                            title="Удалить сценарий"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:px-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
              <span className="text-[11px]">
                💾 Все изменения сохраняются автоматически в браузере
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs transition"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
