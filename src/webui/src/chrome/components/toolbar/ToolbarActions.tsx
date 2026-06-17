import React from "react";
import { PanelLeft, Download, Settings2 } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import "./toolbarButton.css";
import "./ToolbarActions.css";

export function ToolbarActions(): React.JSX.Element {
  const { sidebarOpen, setSidebarPanel, toggleSidebar } = useUIStore();

  const handleSidebarToggle = (): void => {
    toggleSidebar();
  };

  const handleDownloadsClick = (): void => {
    setSidebarPanel("downloads");
    if (!sidebarOpen) {
      toggleSidebar();
    }
  };

  const handleSettingsClick = (): void => {
    console.log("[ToolbarActions] Settings — Batch 12");
  };

  return (
    <div className="toolbar-actions-container">
      <button
        className={`toolbar-btn ${sidebarOpen ? "toolbar-btn-active" : ""}`}
        onClick={handleSidebarToggle}
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <PanelLeft size={16} />
      </button>

      <button
        className="toolbar-btn"
        onClick={handleDownloadsClick}
        title="Downloads"
      >
        <Download size={15} />
      </button>

      {/* Extensions Placeholder - To be implemented later */}

      <button
        className="toolbar-btn"
        onClick={handleSettingsClick}
        title="Settings"
      >
        <Settings2 size={15} />
      </button>
    </div>
  );
}
