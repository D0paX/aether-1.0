import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "@/chrome/store/uiStore";
import { SettingsNav } from "./SettingsNav";
import { SettingsContent } from "./SettingsContent";
import "./SettingsDrawer.css";

export function SettingsDrawer(): React.JSX.Element | null {
  const settingsOpen = useUIStore((state) => state.settingsOpen);
  const closeSettings = useUIStore((state) => state.closeSettings);

  return (
    <AnimatePresence>
      {settingsOpen && (
        <motion.div
          key="settings-drawer"
          className="settings-drawer-wrapper"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Overlay */}
          <motion.div
            className="settings-drawer-overlay"
            onClick={closeSettings}
            variants={{
              open: { opacity: 1 },
              closed: { opacity: 0 },
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Drawer panel */}
          <motion.div
            className="settings-drawer-panel"
            variants={{
              open: { x: 0 },
              closed: { x: "100%" },
            }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            {/* Drawer header */}
            <div className="settings-drawer-header">
              <span className="settings-drawer-title">Settings</span>
              <button
                className="settings-drawer-close"
                onClick={closeSettings}
                aria-label="Close settings"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="settings-drawer-body">
              {/* Left nav */}
              <div className="settings-drawer-nav">
                <SettingsNav />
              </div>

              {/* Right content */}
              <div className="settings-drawer-content">
                <SettingsContent />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
