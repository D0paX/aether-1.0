import React from "react";
import { useUIStore } from "../store/uiStore";
import TitleBar from "./titlebar/TitleBar";
import TabBarPlaceholder from "./tabs/TabBarPlaceholder";
import ToolbarPlaceholder from "./toolbar/ToolbarPlaceholder";
import SidebarPlaceholder from "./sidebar/SidebarPlaceholder";
import StatusBarPlaceholder from "./statusbar/StatusBarPlaceholder";
import ViewportPlaceholder from "../../shared/components/ViewportPlaceholder";
import "./AppShell.css";

/**
 * AppShell component.
 * Lays out the primary surfaces of the Aether Browser chrome using CSS Grid.
 * Manages the collapsible transition of the sidebar width.
 */
export function AppShell(): React.JSX.Element {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <div className={`app-shell-container ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <div className="area-titlebar">
        <TitleBar />
      </div>
      <div className="area-tabbar">
        <TabBarPlaceholder />
      </div>
      <div className="area-toolbar">
        <ToolbarPlaceholder />
      </div>
      <div className="area-sidebar">
        <SidebarPlaceholder />
      </div>
      <div className="area-viewport">
        <ViewportPlaceholder />
      </div>
      <div className="area-statusbar">
        <StatusBarPlaceholder />
      </div>
    </div>
  );
}

export default AppShell;
