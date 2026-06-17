import React from "react";
import { Download } from "lucide-react";
import "./Panels.css";

// Shell only — real data from DownloadManager in Batch 13
export function DownloadsPanelShell(): React.JSX.Element {
  return (
    <div className="panel-root">
      <div className="panel-empty-state downloads-empty-state">
        <Download size={32} className="panel-empty-icon" />
        <div className="panel-empty-subtitle">No recent downloads</div>
      </div>
    </div>
  );
}
