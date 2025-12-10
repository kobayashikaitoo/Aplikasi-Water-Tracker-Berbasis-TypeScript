"use client";

import { useState, useMemo } from "react";
import { useWaterStore } from "@/store/useWaterStore";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";
import DesktopShell from "@/components/DesktopShell";

export default function HistoryPage() {
  const { history, dailyTarget, todayAmount, todayLogs } = useWaterStore();
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly");

  // --- DATA GENERATION HANDLERS (Same as before) ---
  const weeklyData = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' });

      const historyRecord = history.find(h => h.date === dateStr);
      let amount = (i === 0) ? todayAmount : (historyRecord?.amount || 0);

      days.push({ label: dayName, date: dateStr, amount, target: historyRecord?.target || dailyTarget, isToday: i === 0 });
    }
    return days;
  }, [history, todayAmount]);

  const monthlyData = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.getDate().toString();

      const historyRecord = history.find(h => h.date === dateStr);
      let amount = (i === 0) ? todayAmount : (historyRecord?.amount || 0);

      days.push({ label: dayLabel, date: dateStr, amount, target: historyRecord?.target || dailyTarget, isToday: i === 0 });
    }
    return days;
  }, [history, todayAmount]);

  const yearlyData = useMemo(() => {
    const months = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      d.setDate(1);
      const monthKey = d.toISOString().split('T')[0].substring(0, 7);
      const monthLabel = d.toLocaleDateString('id-ID', { month: 'short' });

      const currentMonthStr = new Date().toISOString().split('T')[0].substring(0, 7);
      const isCurrentMonth = monthKey === currentMonthStr;

      let totalAmount = history.filter(h => h.date.startsWith(monthKey)).reduce((acc, curr) => acc + curr.amount, 0);

      if (isCurrentMonth) totalAmount += todayAmount;
      // Estimate target for month? Or just use dailyTarget * days? For simplicity, using dailyTarget * 30 or similar is complex.
      // For yearly view, we aren't using the gray logic so we can just pass 0 or current dailyTarget as placeholder.
      months.push({ label: monthLabel, date: monthKey, amount: totalAmount, target: dailyTarget * 30, isToday: isCurrentMonth });
    }
    return months;
  }, [history, todayAmount]);


  const data = period === 'weekly' ? weeklyData : period === 'monthly' ? monthlyData : yearlyData;
  const chartTitle = period === 'weekly' ? 'Asupan Air Mingguan' : period === 'monthly' ? '30 Hari Terakhir' : 'Gambaran Tahunan';

  const totalDrunk = history.reduce((acc, curr) => acc + curr.amount, 0) + todayAmount;
  const successDays = history.filter(d => d.amount >= d.target).length + (todayAmount >= dailyTarget ? 1 : 0);
  const totalDays = history.length + 1;
  const completionRate = Math.round((successDays / totalDays) * 100);

  return (
    <DesktopShell>
      <div className="flex flex-col h-full gap-6">

        {/* Header / Tabs */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Statistik</h1>
            <p className="text-slate-500">Analisis tren hidrasi Anda dari waktu ke waktu.</p>
          </div>

          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            {(["weekly", "monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                  period === p ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {p === 'weekly' ? 'Mingguan' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">

          {/* Main Chart Card (col-span-8) */}
          <div className="col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-800">{chartTitle}</h2>
              {/* Legend */}
              <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> Target Tercapai
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-300"></span> Kurang
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={period === 'monthly' ? 12 : 32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={16}
                    interval={period === 'monthly' ? 2 : 0}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 8 }}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: 'none',
                      borderRadius: '16px',
                      color: '#1e293b',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      padding: '12px 16px'
                    }}
                    formatter={(value: number) => [<span className="font-bold text-blue-600">{value} ml</span>, 'Asupan']}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 6, 6]} className="transition-all duration-300">
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={period === 'yearly'
                          ? "#3b82f6" // Yearly always blue
                          : (entry.amount >= (entry.target || dailyTarget)
                            ? (entry.isToday ? "#2563eb" : "#60a5fa") // Met: Dark blue (today) or Blue (others)
                            : (entry.isToday ? "#94a3b8" : "#cbd5e1")  // Not Met: Dark Gray (today) or Light Gray (others)
                          )
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Stats (col-span-4) */}
          <div className="col-span-4 flex flex-col gap-6">
            {/* 1. Average Daily Intake */}
            <div className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-center min-h-[140px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

              <span className="text-blue-100 font-medium mb-1">Rata-rata Harian</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight">{Math.round(totalDrunk / totalDays)}</span>
                <span className="text-lg font-medium text-blue-200">ml</span>
              </div>
              <span className="text-xs text-blue-200 mt-1 capitalize">Rata-rata {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}</span>
            </div>

            {/* 2. Completion Rate */}
            <div className="bg-emerald-500 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-center min-h-[140px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

              <span className="text-emerald-100 font-medium mb-1">Tingkat Penyelesaian</span>
              <span className="text-4xl font-black tracking-tight mb-1">{completionRate}%</span>
              <span className="text-xs text-emerald-200">Skor Konsistensi</span>
            </div>

            {/* 3. Drink Frequency */}
            <div className="bg-indigo-500 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-center min-h-[140px]">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

              <span className="text-indigo-100 font-medium mb-1">Frekuensi Minum</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tight">
                  {/* Calculate avg frequency if available, else default to estimated based on cup size or logs */}
                  {Math.round(
                    (history.reduce((acc, curr) => acc + (curr.logsCount || 0), 0) + todayLogs.length) / totalDays
                  ) || 0}
                </span>
                <span className="text-lg font-medium text-indigo-200">kali</span>
              </div>
              <span className="text-xs text-indigo-200 mt-1">per hari (rata-rata)</span>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Wawasan</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {todayAmount >= dailyTarget
                  ? "Kerja bagus! Ginjal Anda berterima kasih atas konsistensi Anda."
                  : "Sedikit lagi hari ini. Ingat, konsistensi adalah kunci kesehatan!"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </DesktopShell>
  );
}
