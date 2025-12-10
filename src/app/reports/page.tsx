"use client";

import { useWaterStore } from "@/store/useWaterStore";
import { TrendingUp, Award, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import HydrationChart from "@/components/dashboard/HydrationChart";

export default function ReportsPage() {
  const { history, dailyTarget, todayAmount } = useWaterStore();

  const totalConsumed = history.reduce((acc, curr) => acc + curr.amount, 0) + todayAmount;
  const daysTracked = history.length + 1;
  const average = Math.round(totalConsumed / daysTracked);
  const successDays = history.filter((d) => d.amount >= d.target).length + (todayAmount >= dailyTarget ? 1 : 0);
  const successRate = Math.round((successDays / daysTracked) * 100);

  // Simple Insight Logic
  const insights = [
    {
      title: "Hydration Streak",
      value: `${successDays} Days`,
      desc: "Days you hit your goal.",
      icon: Award,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Daily Average",
      value: `${average} ml`,
      desc: "Your typical intake.",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      desc: "Goal achievement rate.",
      icon: Calendar,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="p-6 h-full flex flex-col space-y-6 overflow-y-auto pb-24">
      <h1 className="text-2xl font-bold">Insights</h1>

      <div className="grid gap-4">
        {insights.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white border border-neutral-100 shadow-sm p-4 rounded-2xl flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", item.bg, item.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm text-neutral-500">{item.title}</h3>
                <div className="text-xl font-bold text-neutral-900">{item.value}</div>
                <p className="text-xs text-neutral-400">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Hydration Chart */}
      <div className="h-80 w-full">
        <HydrationChart />
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl mt-4">
        <h3 className="flex items-center gap-2 font-bold text-blue-600 mb-2">
          <AlertCircle className="w-5 h-5" />
          Recommendation
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          {average < dailyTarget
            ? `You are averaging ${average}ml, which is below your target of ${dailyTarget}ml. Try to add one more glass in the afternoon.`
            : "Great job! You are consistently meeting your hydration goals. Keep it up!"
          }
        </p>
      </div>
    </div>
  );
}
