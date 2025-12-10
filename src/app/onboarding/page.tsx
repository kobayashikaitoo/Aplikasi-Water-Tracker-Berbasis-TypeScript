"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWaterStore } from "@/store/useWaterStore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import OnboardingLayout from "@/components/OnboardingLayout";
import { Sun, Moon } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const setUserData = useWaterStore((state) => state.setUserData);

  // Steps: 1=Gender, 2=Weight, 3=Wake, 4=Sleep, 5=Reveal
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    sex: "male" as "male" | "female",
    weightKg: 70,
    wakeTime: "06:00",
    sleepTime: "22:00",
  });

  const steps = [
    { id: 1, label: "Jenis Kelamin" },
    { id: 2, label: "Berat Badan" },
    { id: 3, label: "Bangun Tidur" },
    { id: 4, label: "Tidur Malam" },
  ];

  // Calculate target locally
  const calculatedTarget = Math.max(
    formData.weightKg * 35,
    1500
  );

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      setUserData(formData);
      setStep(5); // Reveal
    } else if (step === 5) {
      router.push("/");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <OnboardingLayout
      currentStep={step}
      steps={steps}
      onNext={handleNext}
      onBack={handleBack}
      isFirstStep={step === 1}
      isLastStep={step === 5} // If 5, button says "Finish Setup"? Or "Start Hydrating"
    // If step 5 (Reveal), we might want custom button text handled by layout or just standard "Finish"
    >
      {/* STEP 1: GENDER */}
      {step === 1 && (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Pilih Jenis Kelamin</h2>
          <p className="text-slate-500 mb-12">Untuk menghitung tingkat hidrasi ideal Anda.</p>

          <div className="flex gap-8">
            <button
              onClick={() => setFormData({ ...formData, sex: 'male' })}
              className={cn(
                "group relative w-40 h-48 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4",
                formData.sex === 'male'
                  ? "border-blue-500 bg-blue-50 shadow-xl shadow-blue-100 scale-105"
                  : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
              )}
            >
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">👦</span>
              <span className={cn("font-bold text-lg", formData.sex === 'male' ? "text-blue-600" : "text-slate-400")}>Pria</span>

              {formData.sex === 'male' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>

            <button
              onClick={() => setFormData({ ...formData, sex: 'female' })}
              className={cn(
                "group relative w-40 h-48 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4",
                formData.sex === 'female'
                  ? "border-pink-500 bg-pink-50 shadow-xl shadow-pink-100 scale-105"
                  : "border-slate-200 hover:border-pink-300 hover:bg-slate-50"
              )}
            >
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">👧</span>
              <span className={cn("font-bold text-lg", formData.sex === 'female' ? "text-pink-600" : "text-slate-400")}>Wanita</span>

              {formData.sex === 'female' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: WEIGHT */}
      {step === 2 && (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Berat Badan Anda</h2>
          <p className="text-slate-500 mb-12">Digunakan untuk menentukan asupan dasar.</p>

          <div className="relative flex flex-col items-center justify-center">
            <div className="text-[120px] mb-4 opacity-10 absolute pointer-events-none grayscale">⚖️</div>

            <div className="flex items-center gap-4 z-10">
              <button
                onClick={() => setFormData(prev => ({ ...prev, weightKg: Math.max(20, prev.weightKg - 1) }))}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 transition-colors"
              >
                -
              </button>

              <div className="flex flex-col items-center w-40">
                <input
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                  className="text-7xl font-black text-slate-800 w-full text-center bg-transparent outline-none focus:scale-110 transition-transform"
                />
                <span className="text-lg font-bold text-slate-400 mt-2">kg</span>
              </div>

              <button
                onClick={() => setFormData(prev => ({ ...prev, weightKg: Math.min(200, prev.weightKg + 1) }))}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: WAKE TIME */}
      {step === 3 && (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Waktu Bangun</h2>
          <p className="text-slate-500 mb-12">Mulai jadwal hidrasi Anda.</p>

          <div className="bg-orange-50 p-8 rounded-[40px] border border-orange-100 flex flex-col items-center w-full max-w-sm">
            <Sun className="w-16 h-16 text-orange-400 mb-6" />
            <input
              type="time"
              value={formData.wakeTime}
              onChange={(e) => setFormData({ ...formData, wakeTime: e.target.value })}
              className="text-6xl font-black text-slate-800 bg-transparent outline-none border-b-4 border-orange-200 focus:border-orange-500 w-full text-center pb-2 cursor-pointer font-mono"
            />
          </div>
        </div>
      )}

      {/* STEP 4: SLEEP TIME */}
      {step === 4 && (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Waktu Tidur</h2>
          <p className="text-slate-500 mb-12">Pengingat terakhir hari ini.</p>

          <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100 flex flex-col items-center w-full max-w-sm">
            <Moon className="w-16 h-16 text-indigo-400 mb-6" />
            <input
              type="time"
              value={formData.sleepTime}
              onChange={(e) => setFormData({ ...formData, sleepTime: e.target.value })}
              className="text-6xl font-black text-slate-800 bg-transparent outline-none border-b-4 border-indigo-200 focus:border-indigo-500 w-full text-center pb-2 cursor-pointer font-mono"
            />
          </div>
        </div>
      )}

      {/* STEP 5: REVEAL */}
      {step === 5 && (
        <div className="flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700 h-full">
          <div className="w-48 h-48 rounded-full bg-blue-500 flex items-center justify-center relative shadow-2xl shadow-blue-300 mb-8 overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-blue-600 animate-pulse"></div>
            {/* Wave SVG */}
            <div className="absolute bottom-0 w-full h-full opacity-30">
              <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_5s_linear_infinite]">
                <path fill="rgba(255,255,255,0.2)" d="M 0,100 C 50,120 150,80 200,100 V 200 H 0 Z" />
              </svg>
            </div>
            <span className="relative text-5xl font-black text-white z-10 drop-shadow-md">
              {calculatedTarget}
              <span className="text-sm font-bold block opacity-80 mt-1">ml</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-3">Target Dihitung!</h2>
          <p className="text-slate-500 max-w-md leading-relaxed">
            Rencana hidrasi sempurna Anda sudah siap. <br />
            Kami akan mengingatkan Anda antara <span className="font-bold text-slate-700">{formData.wakeTime}</span> dan <span className="font-bold text-slate-700">{formData.sleepTime}</span>.
          </p>
        </div>
      )}

    </OnboardingLayout>
  );
}
