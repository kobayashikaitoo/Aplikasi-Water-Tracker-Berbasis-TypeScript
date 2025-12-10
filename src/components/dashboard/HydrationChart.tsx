"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useWaterStore } from "@/store/useWaterStore";
import { useMemo } from "react";

export default function HydrationChart() {
  const { history, todayAmount } = useWaterStore();

  const data = useMemo(() => {
    // Generate last 7 days including today
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      let amount = 0;
      if (i === 0) {
        amount = todayAmount;
      } else {
        const record = history.find(h => h.date === dateStr);
        amount = record ? record.amount : 0;
      }

      days.push({ day: dayName, amount });
    }
    return days;
  }, [history, todayAmount]);

  return (
    <div className="w-full h-full bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm flex flex-col">
      <h3 className="text-lg font-bold text-slate-700 mb-4">Weekly Hydration</h3>
      <div className="flex-1 w-full min-h-[0]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: '#f1f5f9', radius: 8 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 text-white text-xs py-1 px-3 rounded-lg shadow-xl font-bold">
                      {payload[0].value} ml
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="amount" radius={[6, 6, 6, 6]} barSize={32}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 6 ? '#3b82f6' : '#cbd5e1'}
                  className="transition-all duration-500"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
