import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";
import NotificationManager from "@/components/NotificationManager";
import { ServiceWorkerManager } from "@/components/ServiceWorkerManager";
import ErrorSuppressor from "@/components/ErrorSuppressor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Water Tracker",
  description: "Track your daily hydration",
  manifest: "/manifest.json",
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-neutral-50 text-neutral-900 min-h-screen antialiased")}>
        <ServiceWorkerManager />
        <NotificationManager />
        <ErrorSuppressor />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
