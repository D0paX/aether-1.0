import React from "react";
import { Bot } from "lucide-react";
import "./Panels.css";

// Full AI panel implemented in Batch 17
export function AIPanelShell(): React.JSX.Element {
  return (
    <div className="panel-root">
      <div className="panel-empty-state">
        <Bot size={32} className="panel-empty-icon" />
        <div className="panel-empty-title">AI Assistant</div>
        <div className="panel-empty-subtitle">Coming in Batch 17</div>
      </div>
    </div>
  );
}
