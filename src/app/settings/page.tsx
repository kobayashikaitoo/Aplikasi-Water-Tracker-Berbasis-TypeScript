"use client";

import { useWaterStore } from "@/store/useWaterStore";
import { useState } from "react";
import { Trash2, Save, User, Bell, Plus, X, AlertTriangle, ChevronRight, Edit2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import DesktopShell from "@/components/DesktopShell";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { calculateDailyWaterTarget } from "@/lib/water-calculations";

export default function SettingsPage() {
  const router = useRouter();
  const userData = useWaterStore((state) => state.userData);
  const setUserData = useWaterStore((state) => state.setUserData);
  const resetData = useWaterStore((state) => state.resetData);
  const dailyTarget = useWaterStore((state) => state.dailyTarget);
  const setDailyTarget = useWaterStore((state) => state.setDailyTarget);

  const reminders = useWaterStore((state) => state.reminders);
  const toggleReminder = useWaterStore((state) => state.toggleReminder);
  const addReminder = useWaterStore((state) => state.addReminder);
  const deleteReminder = useWaterStore((state) => state.deleteReminder);

  // Local state for form
  const [form, setForm] = useState({
    weightKg: userData.weightKg,
    wakeTime: userData.wakeTime,
    sleepTime: userData.sleepTime,
    sex: userData.sex,
  });

  const [newReminderTime, setNewReminderTime] = useState<{ hour: string, minute: string, ampm: 'AM' | 'PM' }>({
    hour: new Date().toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0].split(':')[0],
    minute: new Date().getMinutes().toString().padStart(2, '0'),
    ampm: new Date().getHours() >= 12 ? 'PM' : 'AM'
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Target Modal State
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [customTarget, setCustomTarget] = useState(dailyTarget);

  const handleSave = () => {
    setUserData(form);
    alert("Preferensi diperbarui!");
  };

  const handleReset = () => {
    resetData();
    setIsDeleteConfirmOpen(false);
    router.push("/onboarding");
  };

  const openAppTargetModal = () => {
    setCustomTarget(dailyTarget);
    setIsTargetModalOpen(true);
  }

  const handleTargetReset = () => {
    const recommended = calculateDailyWaterTarget({
      weightKg: form.weightKg,
      sex: form.sex as 'male' | 'female'
    });
    setCustomTarget(recommended);
  }

  const handleTargetSave = () => {
    setDailyTarget(customTarget);
    setIsTargetModalOpen(false);
    // alert("Target updated!");
  }

  return (
    <DesktopShell>
      {/* Target Adjustment Modal */}
      <AnimatePresence>
        {isTargetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTargetModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl relative z-10 text-center"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6">Sesuaikan tujuan asupan</h3>

              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-5xl font-black text-slate-800">{customTarget}</span>
                <span className="text-xl font-bold text-slate-400 mt-4">ml</span>
                <button onClick={handleTargetReset} className="mt-2 p-2 rounded-full hover:bg-slate-100 transition-colors group">
                  <RotateCcw className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </button>
              </div>

              <div className="mb-2 px-2">
                <input
                  type="range"
                  min="1000"
                  max="6000"
                  step="50"
                  value={customTarget}
                  onChange={(e) => setCustomTarget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <p className="text-xs font-bold text-slate-400 mb-8 mt-4 uppercase tracking-wide">
                {customTarget === calculateDailyWaterTarget({ weightKg: form.weightKg, sex: form.sex as 'male' | 'female' }) ? "Direkomendasikan" : "Kustom"}
              </p>

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setIsTargetModalOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                >
                  Batal
                </button>
                <button
                  onClick={handleTargetSave}
                  className="flex-1 py-3 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl uppercase tracking-wider transition-colors"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Reset Semua Data?</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Tindakan ini tidak dapat dibatalkan. Semua riwayat, pengaturan, dan log hidrasi akan dihapus secara permanen.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full mt-2">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                  >
                    Hapus Semuanya
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-6 h-full content-start">
        {/* Header */}
        <div className="col-span-12 mb-2">
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
        </div>

        {/* COLUMN 1: Personal Info (Compact) */}
        <div className="col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Profil & Target</h2>
              <button
                onClick={openAppTargetModal}
                className="ml-auto bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2 transition-colors group"
              >
                <span className="text-sm font-bold text-blue-600">Target: {dailyTarget} ml</span>
                <Edit2 className="w-3 h-3 text-blue-400 group-hover:text-blue-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Berat Badan (kg)</label>
                <input
                  type="number"
                  value={form.weightKg}
                  onChange={e => setForm({ ...form, weightKg: Number(e.target.value) })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Jenis Kelamin</label>
                <div className="flex bg-slate-50 rounded-xl p-1 border-2 border-slate-100">
                  <button
                    onClick={() => setForm({ ...form, sex: 'male' })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                      form.sex === 'male' ? "bg-white text-blue-600 shadow-md ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Pria
                  </button>
                  <button
                    onClick={() => setForm({ ...form, sex: 'female' })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                      form.sex === 'female' ? "bg-white text-pink-500 shadow-md ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    Wanita
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Waktu Bangun</label>
                <input
                  type="time"
                  value={form.wakeTime}
                  onChange={e => setForm({ ...form, wakeTime: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Waktu Tidur</label>
                <input
                  type="time"
                  value={form.sleepTime}
                  onChange={e => setForm({ ...form, sleepTime: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>

          {/* Danger Zone (Compact) */}
          <div className="bg-red-50/50 rounded-3xl p-4 border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl text-red-500 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-sm">Area Berbahaya</h3>
                <p className="text-xs text-red-400">Hapus semua data aplikasi</p>
              </div>
            </div>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="bg-white text-red-500 border border-red-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>

        {/* COLUMN 2: Reminders (Compact Vertical List) */}
        <div className="col-span-5 h-[calc(100vh-6rem)]">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">

            {/* Header */}
            <div className="p-5 border-b border-slate-50 bg-white z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-xl text-indigo-500">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Pengingat</h2>
                </div>
                <button
                  onClick={() => {
                    if (Notification.permission === 'granted') new Notification("Test", { body: "It works!" });
                    else Notification.requestPermission();
                  }}
                  className="text-[10px] font-bold text-blue-400 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Tes Notif
                </button>
              </div>

              {/* Add Input */}
              {/* Add Input */}
              <div className="flex flex-col gap-2 mt-4 px-1">
                <div className="flex gap-2 w-full">
                  {/* Hour */}
                  <select
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 font-bold text-slate-700 outline-none focus:border-indigo-500 appearance-none flex-1 text-center text-sm"
                    value={newReminderTime.hour}
                    onChange={(e) => setNewReminderTime({ ...newReminderTime, hour: e.target.value })}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                      <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <span className="self-center font-bold text-slate-300">:</span>
                  {/* Minute */}
                  <select
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 font-bold text-slate-700 outline-none focus:border-indigo-500 appearance-none flex-1 text-center text-sm"
                    value={newReminderTime.minute}
                    onChange={(e) => setNewReminderTime({ ...newReminderTime, minute: e.target.value })}
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
                        onClick={() => setNewReminderTime({ ...newReminderTime, ampm: p as 'AM' | 'PM' })}
                        className={cn(
                          "px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                          newReminderTime.ampm === p ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Convert to 24h string
                    let h = parseInt(newReminderTime.hour);
                    if (newReminderTime.ampm === 'PM' && h !== 12) h += 12;
                    if (newReminderTime.ampm === 'AM' && h === 12) h = 0;
                    const timeString = `${h.toString().padStart(2, '0')}:${newReminderTime.minute}`;

                    addReminder(timeString);
                    // Reset to now
                    setNewReminderTime({
                      hour: new Date().toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0].split(':')[0],
                      minute: new Date().getMinutes().toString().padStart(2, '0'),
                      ampm: new Date().getHours() >= 12 ? 'PM' : 'AM'
                    });
                  }}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-3 rounded-xl flex items-center justify-center transition-all font-bold gap-2 shadow-lg shadow-indigo-200 mt-2"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Pengingat
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
              {reminders.length === 0 && (
                <div className="text-center py-10 text-slate-300 text-sm">Belum ada pengingat diatur.</div>
              )}
              {reminders.map((reminder) => (
                <div key={reminder.id} className="group flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-700 font-mono text-lg">
                      {(() => {
                        if (!reminder.time) return "--:--";
                        const parts = reminder.time.split(':');
                        if (parts.length < 2) return reminder.time;
                        const [h, m] = parts;
                        const date = new Date();
                        date.setHours(Number(h));
                        date.setMinutes(Number(m));
                        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                      })()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={cn(
                        "w-9 h-5 rounded-full p-0.5 transition-colors relative",
                        reminder.enabled ? "bg-green-500" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                        reminder.enabled ? "translate-x-4" : ""
                      )} />
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DesktopShell>
  );
}
