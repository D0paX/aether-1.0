import React from "react";
import { Package } from "lucide-react";
import "../SettingsContent.css";
import "./SettingsStub.css";

// Full implementation in Batch 20
export function ExtensionsSection(): React.JSX.Element {
  return (
    <div>
      <div className="settings-page-title">Extensions</div>
      <div className="settings-stub">
        <div className="settings-stub-icon">
          <Package size={32} />
        </div>
        <div className="settings-stub-message">
          Extension management — available in Batch 20
        </div>
      </div>
    </div>
  );
}
