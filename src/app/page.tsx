"use client";

import { useEffect, useState } from "react";
import { useWaterStore } from "@/store/useWaterStore";
import { useRouter } from "next/navigation";
import DesktopDashboard from "@/components/DesktopDashboard";

export default function Home() {
  const router = useRouter();
  const { userData } = useWaterStore();

  // Hydration check
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (!useWaterStore.persist.hasHydrated()) {
      useWaterStore.persist.rehydrate();
    }
  }, []);

  // Redirect if not onboarded
  useEffect(() => {
    if (mounted && !userData.hasOnboarded) {
      router.push("/onboarding");
    }
  }, [mounted, userData.hasOnboarded, router]);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <DesktopDashboard />
  );
}
