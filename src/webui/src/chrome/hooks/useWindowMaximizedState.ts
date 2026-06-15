import { useState, useEffect } from "react";
import { browserBridge } from "../services";

/**
 * Custom React hook to query the initial window maximized state
 * and listen for changes from the Mojo interface.
 */
export function useWindowMaximizedState(): boolean {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Query initial state
    browserBridge.windowControls.isMaximized().then(setIsMaximized);

    // Subscribe to state changes (Minimize/Maximize/Restore/externals)
    const unsubscribe = browserBridge.windowControls.onMaximizedStateChanged(
      setIsMaximized
    );

    return unsubscribe;
  }, []);

  return isMaximized;
}
