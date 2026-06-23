import React from "react";
import { Download } from "lucide-react";
import "../SettingsContent.css";
import "./SettingsStub.css";

// Full implementation in Batch 13
export function DownloadsSection(): React.JSX.Element {
  return (
    <div>
      <div className="settings-page-title">Downloads</div>
      <div className="settings-stub">
        <div className="settings-stub-icon">
          <Download size={32} />
        </div>
        <div className="settings-stub-message">
          Download settings — available in Batch 13
        </div>
      </div>
    </div>
  );
}
