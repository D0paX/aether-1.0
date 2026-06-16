import React from "react";
import { useUIStore } from "../../store/uiStore";
import "../Placeholders.css";

/**
 * ToolbarPlaceholder component.
 * Temporary placeholder for the browser's navigation and action toolbar.
 * Replaced in Batch 09/10 (Navigation & Omnibox).
 */
export function ToolbarPlaceholder(): React.JSX.Element {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className="toolbar-placeholder">
      <span>Toolbar — Batch 09/10</span>
      <button className="placeholder-btn" onClick={toggleSidebar}>
        Toggle Sidebar
      </button>
    </div>
  );
}

export default ToolbarPlaceholder;
