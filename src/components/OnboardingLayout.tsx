"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  currentStep: number;
  steps: { id: number; label: string; icon?: any }[]; // steps metadata
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean; // If true, maybe show 'Finish' instead of Next
  canProceed?: boolean; // Disable next if false
}

export default function OnboardingLayout({
  currentStep,
  steps,
  children,
  onNext,
  onBack,
  isFirstStep = false,
  isLastStep = false,
  canProceed = true,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4">
      {/* Centered Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-12 border border-slate-200"
      >
        {/* LEFT COLUMN: Sidebar (col-span-4) */}
        <div className="col-span-4 bg-slate-900 relative flex flex-col justify-between p-8 text-white">
          {/* Background Decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-blue-500 rounded-full blur-[100px] opacity-30"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[150%] h-[150%] bg-cyan-500 rounded-full blur-[80px] opacity-20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-12">
              <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
                <Droplet className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">HydroFlow</h1>
                <p className="text-xs text-slate-400">Edisi Desktop</p>
              </div>
            </div>

            {/* Steps Navigation */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex items-center gap-4 group">
                    {/* Indicator Circle */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                      isActive ? "bg-blue-500 border-blue-500 text-white scale-110 shadow-lg shadow-blue-500/25" :
                        isCompleted ? "bg-green-500 border-green-500 text-white" :
                          "border-slate-700 text-slate-500"
                    )}>
                      {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                    </div>

                    {/* Label */}
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        isActive ? "text-white" : isCompleted ? "text-slate-300" : "text-slate-600"
                      )}>
                        {step.label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="active-step-desc"
                          className="text-[10px] text-blue-400"
                        >
                          Sedang Berjalan
                        </motion.span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer / Quote */}
          <div className="relative z-10">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              "Air adalah kekuatan pendorong dari semua alam." <br />– Leonardo da Vinci
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Content (col-span-8) */}
        <div className="col-span-8 bg-white relative flex flex-col">
          {/* Scrollable Content Area */}
          <div className="flex-1 p-12 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col justify-center"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed Bottom Navigation */}
          <div className="h-24 border-t border-slate-100 flex items-center justify-between px-12 bg-white/80 backdrop-blur-sm absolute bottom-0 w-full z-20">
            <button
              onClick={onBack}
              disabled={isFirstStep}
              className={cn(
                "text-slate-500 font-medium px-6 py-2 rounded-xl hover:bg-slate-50 transition-colors",
                isFirstStep && "invisible"
              )}
            >
              Kembali
            </button>

            <button
              onClick={onNext}
              disabled={!canProceed}
              className={cn(
                "px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95",
                canProceed
                  ? "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              )}
            >
              {isLastStep ? "Selesai" : "Lanjut"}
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
