import React from "react";
import { Search } from "lucide-react";
import "../SettingsContent.css";
import "./SettingsStub.css";

// Full implementation in Batch 13
export function SearchSection(): React.JSX.Element {
  return (
    <div>
      <div className="settings-page-title">Search Engines</div>
      <div className="settings-stub">
        <div className="settings-stub-icon">
          <Search size={32} />
        </div>
        <div className="settings-stub-message">
          Search engine management — available in Batch 13
        </div>
      </div>
    </div>
  );
}
