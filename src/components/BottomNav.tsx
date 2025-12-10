"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, PieChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  // Hide nav on onboarding
  if (pathname === "/onboarding") return null;

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/history", label: "History", icon: BarChart3 },
    { href: "/reports", label: "Reports", icon: PieChart },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-neutral-200 pb-safe pt-2 px-6 z-50 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors px-4 py-2 rounded-xl",
                isActive ? "text-blue-500" : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current opacity-20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
