"use client";

import { useEffect } from "react";

export default function ErrorSuppressor() {
  useEffect(() => {
    // Save original console.error
    const originalError = console.error;

    console.error = (...args) => {
      if (typeof args[0] === 'string') {
        // Suppress Next.js 404 resource errors
        if (args[0].includes('__next') && args[0].includes('404')) return;
        if (args[0].includes('Failed to load resource')) return;
        // Suppress Recharts defaultProps warning if any (common in React 18 strict mode)
        if (args[0].includes('defaultProps')) return;
      }
      originalError.apply(console, args);
    };

    return () => {
      // Restore on cleanup
      console.error = originalError;
    };
  }, []);

  return null;
}
