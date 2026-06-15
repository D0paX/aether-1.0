import React from "react";
import { motion } from "motion/react";
import { Minus, Square, X } from "lucide-react";

/**
 * Window controls component rendering Windows-convention custom-styled
 * minimize, maximize, and close buttons on the right side of the TitleBar.
 */
export default function WindowControls(): React.JSX.Element {
  // Handlers for window actions. Will interface with the Mojo IPC window management interface in Batch 07.
  const handleMinimize = (): void => {
    console.log(
      "[WindowControls] minimize — requires window management Mojo interface, see batch-07",
    );
  };

  const handleMaximize = (): void => {
    console.log(
      "[WindowControls] maximize — requires window management Mojo interface, see batch-07",
    );
  };

  const handleClose = (): void => {
    console.log("[WindowControls] close — requires window management Mojo interface, see batch-07");
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

      {/* Maximize Button */}
      <motion.button
        className="window-control-btn"
        onClick={handleMaximize}
        whileHover={{
          backgroundColor: "var(--color-hover-overlay)",
          color: "var(--color-text-primary)",
        }}
        transition={{ duration: 0.12 }}
      >
        <Square size={14} />
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
