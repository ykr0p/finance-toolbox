"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, HelpCircle, X, Lightbulb, Target, Calculator, CheckCircle2 } from "lucide-react";

export interface HelpDialogContent {
  title: string;
  subtitle?: string;
  whatIsIt: string | React.ReactNode;
  whyNeeded: string | React.ReactNode;
  example: string | React.ReactNode;
  tip?: string | React.ReactNode;
}

interface HelpButtonProps extends HelpDialogContent {
  variant?: "exclamation" | "question";
  className?: string;
  buttonAriaLabel?: string;
}

export function HelpButton({
  title,
  subtitle,
  whatIsIt,
  whyNeeded,
  example,
  tip,
  variant = "exclamation",
  className = "",
  buttonAriaLabel,
}: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
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

  const modalContent = isOpen && mounted && typeof document !== "undefined" ? (
    createPortal(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-dialog-title"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col z-[10000]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 px-5 py-4 text-white flex items-start justify-between relative">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-black text-lg flex-shrink-0">
                !
              </div>
              <div>
                <h3
                  id="help-dialog-title"
                  className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug"
                >
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-indigo-200 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              aria-label="Закрыть справку"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 space-y-4 overflow-y-auto text-sm text-slate-700 leading-relaxed bg-white">
            {/* 1. Что это такое простыми словами */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wide">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Простыми словами (Что это такое)</span>
              </div>
              <div className="text-slate-800 text-xs sm:text-sm">
                {whatIsIt}
              </div>
            </div>

            {/* 2. Зачем это нужно */}
            <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>Зачем это нужно и на что влияет</span>
              </div>
              <div className="text-slate-800 text-xs sm:text-sm">
                {whyNeeded}
              </div>
            </div>

            {/* 3. Реальный пример с цифрами */}
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wide">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Наглядный пример с расчетом</span>
              </div>
              <div className="text-slate-800 text-xs sm:text-sm">
                {example}
              </div>
            </div>

            {/* 4. Полезный совет (если есть) */}
            {tip && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Совет инвестору:</span>
                </div>
                <div>{tip}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:px-5 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Понятно, спасибо
            </button>
          </div>
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        aria-label={buttonAriaLabel || `Справка: ${title}`}
        title="Нажмите, чтобы прочитать простое объяснение с примером"
        className={`inline-flex items-center justify-center w-4 h-4 rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
          variant === "exclamation"
            ? "bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900 border border-amber-300 font-black text-[10px] leading-none"
            : "bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-700 font-bold text-[10px]"
        } ${className}`}
      >
        {variant === "exclamation" ? "!" : "?"}
      </button>

      {modalContent}
    </>
  );
}
