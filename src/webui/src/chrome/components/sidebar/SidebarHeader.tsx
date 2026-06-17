import React from "react";
import { Bookmark, Clock, Download, Sparkles } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import type { SidebarPanel } from "../../store/uiStore";
import "./Sidebar.css";

const TABS: { id: SidebarPanel; icon: React.ReactNode; title: string }[] = [
  { id: "bookmarks", icon: <Bookmark size={15} />, title: "Bookmarks" },
  { id: "history", icon: <Clock size={15} />, title: "History" },
  { id: "downloads", icon: <Download size={15} />, title: "Downloads" },
  { id: "ai", icon: <Sparkles size={15} />, title: "AI Assistant" },
];

export function SidebarHeader(): React.JSX.Element {
  const activePanel = useUIStore((state) => state.sidebarActivePanel);
  const setSidebarPanel = useUIStore((state) => state.setSidebarPanel);

  return (
    <div className="sidebar-header">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`sidebar-tab-btn ${activePanel === tab.id ? "is-active" : ""}`}
          title={tab.title}
          onClick={() => setSidebarPanel(tab.id)}
        >
          {tab.icon}
        </button>
      ))}
    </div>
  );
}
