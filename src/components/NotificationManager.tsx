"use client";

import { useWaterStore } from "@/store/useWaterStore";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function NotificationManager() {
  const reminders = useWaterStore((state) => state.reminders);
  const lastTriggeredRef = useRef<string | null>(null);

  useEffect(() => {
    // Request permission on mount
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });

      // Avoid double triggering in the same minute
      if (lastTriggeredRef.current === currentTime) return;

      const matchedReminder = reminders.find(
        (r) => r.enabled && r.time === currentTime
      );

      if (matchedReminder) {
        lastTriggeredRef.current = currentTime;

        // System Notification
        new Notification("Waktunya Minum Air! 💧", {
          body: "Sudah waktunya minum untuk mencapai target harianmu.",
          icon: "/icon.png", // Correct path from public root
          requireInteraction: true, // Keep it visible until user clicks
          silent: false
        });

        // In-App Toast (Optional backup)
        toast.info("Waktunya Minum Air! 💧", {
          duration: 5000,
        });

        // Optional: Play sound if enabled in settings
      }
    };

    // Check every 10 seconds to hit the minute mark closely
    const interval = setInterval(checkReminders, 10000);

    return () => clearInterval(interval);
  }, [reminders]);

  return null; // Headless component
}
