export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === "granted") {
    // If service worker is ready, use it (better for mobile)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          icon: '/icon-192x192.png', // valid path if exists, else fallback
          badge: '/badge.png',
          ...options,
          vibrate: [200, 100, 200]
        } as NotificationOptions & { vibrate?: number[] });
      });
    } else {
      // Fallback to standard API
      new Notification(title, options);
    }
  }
}
