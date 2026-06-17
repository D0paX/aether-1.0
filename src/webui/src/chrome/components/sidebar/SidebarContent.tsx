import React from "react";
import { useUIStore } from "../../store/uiStore";
import { BookmarksPanelShell } from "./panels/BookmarksPanelShell";
import { HistoryPanelShell } from "./panels/HistoryPanelShell";
import { DownloadsPanelShell } from "./panels/DownloadsPanelShell";
import { AIPanelShell } from "./panels/AIPanelShell";
import "./Sidebar.css";

export function SidebarContent(): React.JSX.Element | null {
  const activePanel = useUIStore((state) => state.sidebarActivePanel);

  if (!activePanel) {
    return null;
  }

  return (
    <div className="sidebar-content">
      {activePanel === "bookmarks" && <BookmarksPanelShell />}
      {activePanel === "history" && <HistoryPanelShell />}
      {activePanel === "downloads" && <DownloadsPanelShell />}
      {activePanel === "ai" && <AIPanelShell />}
    </div>
  );
}
