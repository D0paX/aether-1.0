import React from "react";
import { motion } from "motion/react";
import { Minus, Square, Copy, X } from "lucide-react";
import { browserBridge } from "../../services";
import { useWindowMaximizedState } from "../../hooks/useWindowMaximizedState";

/**
 * Window controls component rendering Windows-convention custom-styled
 * minimize, maximize, and close buttons on the right side of the TitleBar.
 */
export default function WindowControls(): React.JSX.Element {
  const isMaximized = useWindowMaximizedState();

  const handleMinimize = (): void => {
    void browserBridge.windowControls.minimize();
  };

  const handleMaximizeToggle = (): void => {
    if (isMaximized) {
      void browserBridge.windowControls.restore();
    } else {
      void browserBridge.windowControls.maximize();
    }
  };

  const handleClose = (): void => {
    void browserBridge.windowControls.close();
  };

  return (
    <div className="window-controls">
      {/* Minimize Button */}
      <motion.button
        className="window-control-btn"
        onClick={handleMinimize}
        whileHover={{
          backgroundColor: "var(--color-hover-overlay)",
          color: "var(--color-text-primary)",
        }}
        transition={{ duration: 0.12 }} // Matches --duration-fast (120ms)
      >
        <Minus size={14} />
      </motion.button>

      {/* Maximize / Restore Button */}
      <motion.button
        className="window-control-btn"
        onClick={handleMaximizeToggle}
        whileHover={{
          backgroundColor: "var(--color-hover-overlay)",
          color: "var(--color-text-primary)",
        }}
        transition={{ duration: 0.12 }}
      >
        {isMaximized ? <Copy size={14} /> : <Square size={14} />}
      </motion.button>

      {/* Close Button */}
      <motion.button
        className="window-control-btn btn-close"
        onClick={handleClose}
        whileHover={{
          backgroundColor: "var(--color-danger)",
          color: "#ffffff",
        }}
        transition={{ duration: 0.12 }}
      >
        <X size={14} />
      </motion.button>
    </div>
  );
}
