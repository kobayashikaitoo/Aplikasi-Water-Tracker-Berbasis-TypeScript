"use client";

import { useWaterStore } from "@/store/useWaterStore";
import {
  Droplet,
  GlassWater,
  Coffee,
  Beer,
  Trash2,
  Plus,
  Flame,
  Clock,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";
import DesktopShell from "@/components/DesktopShell";
import CupSelector from "@/components/CupSelector";
import { useEffect, useState, useMemo } from "react";


import { toast } from "sonner";
// import useSound from 'use-sound'; // Allow user to uncomment when files are ready

// Map icons
export default function DesktopDashboard() {
  const { todayAmount, dailyTarget, addWater, todayLogs, removeWater, history, reminders } = useWaterStore();
  const [isCupSelectorOpen, setIsCupSelectorOpen] = useState(false);

  // Manual Entry State
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  // Default to current time in object format
  const [manualTime, setManualTime] = useState<{ hour: string, minute: string, ampm: 'AM' | 'PM' }>({
    hour: new Date().toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0].split(':')[0],
    minute: new Date().getMinutes().toString().padStart(2, '0'),
    ampm: new Date().getHours() >= 12 ? 'PM' : 'AM'
  });
  const [manualAmount, setManualAmount] = useState(250);

  // Next Reminder Logic
  const nextReminder = useMemo(() => {
    if (!reminders.length) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Convert reminders to minutes and sort
    const sortedReminders = [...reminders]
      .filter(r => r.enabled && r.time && typeof r.time === 'string')
      .map(r => {
        const parts = r.time.split(':');
        if (parts.length < 2) return { ...r, minutes: 0 }; // Fallback
        const [h, m] = parts.map(Number);
        return { ...r, minutes: h * 60 + m };
      })
      .sort((a, b) => a.minutes - b.minutes);

    // Find first one after now
    const next = sortedReminders.find(r => r.minutes > currentMinutes);

    // If found, return it. If not, maybe show first of tomorrow?
    // For "Today's Record", showing "All done for today" might be better if none left.
    // Or wrap around to first one (tomorrow).
    // Let's show the *next occurance*. If none today, show first one.
    return next || sortedReminders[0];
  }, [reminders]);

  // Calculate Streak
  const streak = useMemo(() => {
    let count = 0;
    // Check history backwards (assuming ordered by date asc, so reverse it)
    // Actually, let's look at useWaterStore.ts, history is appended, so last is newest.
    const reversedHistory = [...history].reverse();

    // Check consecutive days in history
    for (const record of reversedHistory) {
      if (record.amount >= record.target) {
        count++;
      } else {
        break;
      }
    }

    // Add today if target met
    if (todayAmount >= dailyTarget) {
      count++;
    }

    return count;
  }, [history, todayAmount, dailyTarget]);

  const progressPercent = Math.min((todayAmount / dailyTarget) * 100, 100);
  const CIRCUMFERENCE = 251.327;
  const ARC_LENGTH = 188.5;

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        addWater(250);
        toast.success("💧 Fast Drink: +250ml Added!");
      }
      if (e.ctrlKey && e.key === 'z') {
        // Undo logic would go here if store supported it.
        // For now, implementing basic toast
        toast.info("Undo not yet implemented in store.");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addWater]);


  // Action Buttons Configuration
  const quickAdds = [
    { amount: 100, label: "Small", icon: Coffee },
    { amount: 200, label: "Medium", icon: GlassWater },
    { amount: 300, label: "Large", icon: Beer },
    { amount: 500, label: "Bottle", icon: Droplet },
  ];

  const handleCustomAdd = (size: number) => {
    addWater(size);
    setIsCupSelectorOpen(false);
    toast.success(`💧 Added ${size}ml custom amount!`);
  };

  return (
    <DesktopShell>
      <div className="grid grid-cols-10 gap-6 h-full relative">

        {/* Cup Selector Modal */}
        <CupSelector
          isOpen={isCupSelectorOpen}
          onClose={() => setIsCupSelectorOpen(false)}
          selectedSize={0}
          onSelect={handleCustomAdd}
        />

        {/* Manual Entry Modal */}
        <AnimatePresence>
          {isManualEntryOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsManualEntryOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl relative z-10"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-slate-800">Tambah Air</h3>
                  <button onClick={() => setIsManualEntryOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Waktu</label>
                    <div className="flex gap-2">
                      {/* Hour */}
                      <select
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none flex-1 text-center"
                        value={manualTime.hour}
                        onChange={(e) => setManualTime({ ...manualTime, hour: e.target.value })}
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                          <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      <span className="self-center font-bold text-slate-300">:</span>
                      {/* Minute */}
                      <select
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 appearance-none flex-1 text-center"
                        value={manualTime.minute}
                        onChange={(e) => setManualTime({ ...manualTime, minute: e.target.value })}
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map(m => ( // Every minute
                          <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      {/* AM/PM */}
                      <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200">
                        {['AM', 'PM'].map((p) => (
                          <button
                            key={p}
                            onClick={() => setManualTime({ ...manualTime, ampm: p as 'AM' | 'PM' })}
                            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${manualTime.ampm === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Jumlah (ml)</label>
                    <div className="flex gap-2">
                      {[100, 200, 250, 500].map(amt => (
                        <button key={amt} onClick={() => setManualAmount(amt)} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${manualAmount === amt ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300'}`}>
                          {amt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={manualAmount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0) setManualAmount(val);
                      }}
                      className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors text-center"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (manualAmount > 0) {
                        // Convert 12h to 24h string for store
                        let h = parseInt(manualTime.hour);
                        if (manualTime.ampm === 'PM' && h !== 12) h += 12;
                        if (manualTime.ampm === 'AM' && h === 12) h = 0;
                        const timeString = `${h.toString().padStart(2, '0')}:${manualTime.minute}`;

                        // If time is empty, it uses current time in store
                        addWater(manualAmount, timeString);
                        toast.success("Catatan berhasil ditambahkan");
                        setIsManualEntryOpen(false);
                        // Reset time to now
                        setManualTime({
                          hour: new Date().toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0].split(':')[0],
                          minute: new Date().getMinutes().toString().padStart(2, '0'),
                          ampm: new Date().getHours() >= 12 ? 'PM' : 'AM'
                        })
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-200"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* === LEFT COLUMN (MAIN STAGE) === */}
        <div className="col-span-7 flex flex-col gap-6 h-full min-h-0">

          {/* 1. HERO CARD (Progress & Wave) - Takes Full Height now */}
          <div className="flex-1 bg-white rounded-[40px] shadow-sm border border-slate-100 relative overflow-hidden flex flex-col items-center justify-center p-0 group">

            {/* WAVE BACKGROUND ANIMATION */}
            <div className="absolute inset-x-0 bottom-0 h-[40%] text-blue-500/10 pointer-events-none">
              <svg className="absolute bottom-0 w-[200%] h-full left-[-50%]" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <motion.path
                  fill="currentColor"
                  initial={{ d: "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" }}
                  animate={{
                    d: [
                      "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,170.7C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                      "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                />
              </svg>
            </div>

            <div className="flex flex-col items-center z-10 w-full h-full justify-center gap-6">

              {/* Main Progress Ring */}
              <div className="relative w-[320px] h-[320px] lg:w-[350px] lg:h-[350px] flex items-center justify-center">
                <svg className="w-full h-full drop-shadow-xl" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${ARC_LENGTH}, ${CIRCUMFERENCE}`} className="origin-center rotate-[135deg]" />
                  {/* Fill */}
                  <motion.circle
                    cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${ARC_LENGTH}, ${CIRCUMFERENCE}`}
                    initial={{ strokeDashoffset: ARC_LENGTH }}
                    animate={{ strokeDashoffset: ARC_LENGTH - (progressPercent / 100) * ARC_LENGTH }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="origin-center rotate-[135deg] drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </svg>

                {/* Center Content (Bigger Numbers) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xl font-bold text-slate-400 mb-[-10px]">Target Minuman Harian</span>
                    <div className="flex items-baseline gap-1 relative justify-center w-full px-4">
                      <AnimatedCounter
                        value={todayAmount}
                        className={`font-black text-slate-800 tracking-tighter leading-none transition-all duration-300 ${todayAmount > 9999 ? "text-[3rem]" :
                          todayAmount > 999 ? "text-[4rem]" :
                            "text-[6rem]"
                          }`}
                      />
                    </div>
                    <span className="text-xl font-bold text-slate-400 mt-2">dari {dailyTarget} ml</span>
                  </div>
                </div>
              </div>

              {/* Quick Buttons Grid (Compacted) */}
              <div className="flex gap-4">
                {quickAdds.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.amount}
                      onClick={() => { addWater(item.amount); toast.success(`+${item.amount}ml Ditambahkan`); }}
                      className="bg-white border-2 border-slate-50 hover:border-blue-500 rounded-3xl w-24 h-24 flex flex-col items-center justify-center gap-1 group transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Icon strokeWidth={2} className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                      <span className="text-lg font-black text-slate-700">{item.amount}</span>
                    </button>
                  )
                })}

                <button
                  onClick={() => setIsCupSelectorOpen(true)}
                  className="bg-blue-50 border-2 border-blue-100 hover:border-blue-500 rounded-3xl w-24 h-24 flex flex-col items-center justify-center gap-1 group transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <Plus strokeWidth={2} className="w-8 h-8 text-blue-400 group-hover:text-blue-600 transition-colors" />
                  <span className="text-sm font-bold text-blue-400">Lainnya</span>
                </button>
              </div>

            </div>
          </div>


        </div>

        {/* === RIGHT COLUMN (STATS & HISTORY) === */}
        <div className="col-span-3 flex flex-col gap-6 h-full min-h-0">



          {/* 2. STREAK MINI CARD */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-2xl">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-pulse" />
              </div>
              <div>
                <span className="block text-2xl font-black text-slate-800">{streak} Hari</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Streak Saat Ini</span>
              </div>
            </div>
          </div>

          {/* 3. HISTORY LIST (Scrollable) */}
          <div className="h-[calc(100vh-12rem)] bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden relative">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-800">Catatan hari ini</h3>
                <button onClick={() => setIsManualEntryOpen(true)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <Plus className="w-5 h-5 text-slate-400 hover:text-blue-500" />
                </button>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{todayLogs.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300 max-h-full">

              {/* NEXT ALARM CARD */}
              {nextReminder && (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 mb-2">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <Clock className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-800">{new Date(new Date().setHours(Number(nextReminder.time.split(':')[0]), Number(nextReminder.time.split(':')[1]))).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">Berikutnya</span>
                  </div>
                  <div className="ml-auto text-indigo-400 font-bold text-sm">
                    200ml
                  </div>
                </div>
              )}
              {todayLogs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2 opacity-50">
                  <GlassWater className="w-12 h-12 stroke-1" />
                  <span className="text-sm font-medium">Mulai minum!</span>
                </div>
              ) : (
                todayLogs.map((log) => (
                  <div key={log.id} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                        <GlassWater className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <span className="block font-bold text-slate-700">{log.amount}ml</span>
                        <span className="text-xs text-slate-400 font-medium">{log.time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        removeWater(log.id);
                        toast.success("Catatan dihapus");
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-2 hover:bg-white rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Gradient Fade at bottom of list */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </DesktopShell>
  );
}
