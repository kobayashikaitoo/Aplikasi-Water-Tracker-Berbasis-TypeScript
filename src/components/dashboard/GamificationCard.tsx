"use client";

import { useWaterStore } from "@/store/useWaterStore";
import { Trophy, Medal, Crown } from "lucide-react";

export default function GamificationCard() {
  const { history, todayAmount } = useWaterStore();

  // Calculate Total Water All Time
  const historicalTotal = history.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWater = historicalTotal + todayAmount;

  // XP System: 10XP per 200ml
  const totalXP = Math.floor(totalWater / 20);
  const xpForNextLevel = 500; // Fixed XP per level for simplicity or scaled

  // Simple Level Formula: 1 Level per 500 XP
  const level = Math.floor(totalXP / xpForNextLevel) + 1;
  const currentLevelXP = totalXP % xpForNextLevel;
  const progressPercent = (currentLevelXP / xpForNextLevel) * 100;

  // Rank Titles
  const getRank = (lvl: number) => {
    if (lvl >= 50) return { title: "Poseidon", icon: Crown, color: "text-yellow-500" };
    if (lvl >= 20) return { title: "Ocean Master", icon: Trophy, color: "text-purple-500" };
    if (lvl >= 10) return { title: "Hydro Homie", icon: Medal, color: "text-blue-500" };
    return { title: "Water Rookie", icon: DropletIcon, color: "text-slate-400" };
  };

  const rank = getRank(level);
  const RankIcon = rank.icon;

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/60 p-5 rounded-3xl shadow-sm flex items-center gap-4 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
        <RankIcon className="text-white w-7 h-7" />
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-x font-bold text-slate-400 uppercase tracking-wider">Level {level}</span>
          <span className="text-xs font-bold text-slate-800">{currentLevelXP} / {xpForNextLevel} XP</span>
        </div>
        <h3 className={`text-lg font-black ${rank.color} leading-none mb-3`}>{rank.title}</h3>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625c1.242 0 2.25 1.008 2.25 2.25S13.242 15.375 12 15.375 9.75 14.367 9.75 13.125s1.008-2.25 2.25-2.25Z" fillOpacity="0.5" />
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12 6a7.5 7.5 0 0 0-7.5 7.5c0 4.142 3.358 7.5 7.5 7.5s7.5-3.358 7.5-7.5A7.5 7.5 0 0 0 12 6Z" clipRule="evenodd" />
    </svg>
  )
}
