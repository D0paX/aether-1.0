import { useState, useEffect } from "react";
import { browserBridge } from "../../../chrome/services";
import { useTheme } from "../../../shared/hooks/useTheme";

export function useNTPBridge(): { ready: boolean } {
  const [ready, setReady] = useState(false);
  
  // Applies data-theme attribute on document root
  useTheme();

  useEffect(() => {
    let mounted = true;

    async function initializeNTP(): Promise<void> {
      // Get initial navigation state to confirm bridge is ready
      await browserBridge.navigation.getNavigationState();
      
      if (mounted) {
        setReady(true);
      }
    }

    void initializeNTP();

    return () => {
      mounted = false;
    };
  }, []);

  return { ready };
}
