"use client";

import { useWaterStore } from "@/store/useWaterStore";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Droplet
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="h-screen w-full bg-slate-50 p-6 grid grid-cols-12 gap-6 overflow-hidden font-sans text-slate-900">

      {/* COLUMN 1: SIDEBAR (col-span-2) */}
      <div className="col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Droplet className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">HydroFlow</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
              pathname === "/" ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <LayoutDashboard className="w-5 h-5" />
            Beranda
          </Link>
          <Link
            href="/history"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
              pathname === "/history" ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <BarChart3 className="w-5 h-5" />
            Statistik
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors",
              pathname === "/settings" ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Settings className="w-5 h-5" />
            Pengaturan
          </Link>
        </nav>


      </div>

      {/* CONTENT AREA (col-span-10) */}
      {/* Pages will render their specific layout logic inside here */}
      <div className="col-span-10 h-full">
        {children}
      </div>

    </div>
  );
}
