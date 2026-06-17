import React, { useEffect } from "react";
import { motion } from "motion/react";
import { useUIStore } from "../../store/uiStore";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarContent } from "./SidebarContent";
import "./Sidebar.css";

export function Sidebar(): React.JSX.Element {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const activePanel = useUIStore((state) => state.sidebarActivePanel);
  const setSidebarPanel = useUIStore((state) => state.setSidebarPanel);

  useEffect(() => {
    if (sidebarOpen && activePanel === null) {
      setSidebarPanel("bookmarks");
    }
  }, [sidebarOpen, activePanel, setSidebarPanel]);

  return (
    <motion.div
      className={`sidebar-container ${sidebarOpen ? "is-open" : ""}`}
      initial={{ width: 0 }}
      animate={{ width: sidebarOpen ? 260 : 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="sidebar-inner">
        <SidebarHeader />
        <SidebarContent />
      </div>
    </motion.div>
  );
}
