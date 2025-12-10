"use client";

import { useEffect } from "react";
import { useWaterStore } from "@/store/useWaterStore";
import { requestNotificationPermission, sendNotification } from "@/lib/notifications";

export function ServiceWorkerManager() {
  useEffect(() => {
    // Register SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered', reg))
        .catch(err => console.log('SW failed', err));
    }

    // Request Permission on mount
    requestNotificationPermission();
  }, []);

  return null;
}
